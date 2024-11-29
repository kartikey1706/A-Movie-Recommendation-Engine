-- Create Movies table
CREATE TABLE Movies (
    movie_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_date DATE,
    average_rating FLOAT,
    overview TEXT,
    poster_url VARCHAR(255)
);

-- Create Genres table
CREATE TABLE Genres (
    genre_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create Movie_Genres table
CREATE TABLE Movie_Genres (
    movie_id INT,
    genre_id INT,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id),
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
);

-- Create Users table
CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    date_joined DATE NOT NULL
);

-- Create Ratings table
CREATE TABLE Ratings (
    rating_id INT PRIMARY KEY,
    user_id INT,
    movie_id INT,
    rating FLOAT NOT NULL,
    rating_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
);

-- Create Watchlist table
CREATE TABLE Watchlist (
    watchlist_id INT PRIMARY KEY,
    user_id INT,
    movie_id INT,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
);

-- Create indexes for faster querying
CREATE INDEX idx_movie_title ON Movies(title);
CREATE INDEX idx_user_username ON Users(username);
CREATE INDEX idx_rating_user_movie ON Ratings(user_id, movie_id);
CREATE INDEX idx_watchlist_user ON Watchlist(user_id);