import express from 'express';
import { MovieRecommender } from './recommender/MovieRecommender.js';
import { DataLoader } from './data/DataLoader.js';
import { GraphDatabase } from './database/GraphDatabase.js';

const app = express();
app.use(express.json());

const graphDb = new GraphDatabase();
const dataLoader = new DataLoader();
const recommender = new MovieRecommender(graphDb);

app.get('/recommendations/:userId', async (req, res) => {
  try {
    const recommendations = await recommender.getRecommendations(req.params.userId);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});