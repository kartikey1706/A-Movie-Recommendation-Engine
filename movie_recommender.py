import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Load sample data
# In a real-world scenario, you would load this data from your database
users = {'User1': {'Movie1': 4.5, 'Movie2': 5.0, 'Movie3': 3.0, 'Movie4': 4.0},
         'User2': {'Movie1': 3.0, 'Movie2': 4.0, 'Movie4': 3.5, 'Movie5': 4.0},
         'User3': {'Movie1': 4.0, 'Movie3': 3.5, 'Movie4': 4.5, 'Movie5': 4.0},
         'User4': {'Movie2': 3.5, 'Movie3': 4.0, 'Movie4': 4.0, 'Movie5': 3.5}}

# Convert the dictionary to a DataFrame
df = pd.DataFrame(users).T.fillna(0)

print("User-Movie Rating Matrix:")
print(df)
print()

# Calculate cosine similarity between users
user_similarity = cosine_similarity(df)
user_similarity_df = pd.DataFrame(user_similarity, index=df.index, columns=df.index)

print("User Similarity Matrix:")
print(user_similarity_df)
print()

def get_user_recommendations(user, df, user_similarity_df, n=2):
    # Get similar users
    similar_users = user_similarity_df[user].sort_values(ascending=False)[1:] # Exclude the user itself
    
    # Get movies the user hasn't watched
    user_movies = set(df.loc[user].loc[df.loc[user] > 0].index)
    unwatched_movies = set(df.columns) - user_movies
    
    # Calculate weighted average rating for unwatched movies
    recommendations = {}
    for movie in unwatched_movies:
        weighted_sum = 0
        similarity_sum = 0
        for similar_user, similarity in similar_users.items():
            if df.loc[similar_user, movie] > 0:
                weighted_sum += similarity * df.loc[similar_user, movie]
                similarity_sum += similarity
        if similarity_sum > 0:
            recommendations[movie] = weighted_sum / similarity_sum
    
    # Sort and return top n recommendations
    return sorted(recommendations.items(), key=lambda x: x[1], reverse=True)[:n]

# Get recommendations for User1
user = 'User1'
recommendations = get_user_recommendations(user, df, user_similarity_df)

print(f"Top 2 Movie Recommendations for {user}:")
for movie, score in recommendations:
    print(f"{movie}: Predicted rating = {score:.2f}")
