import fetch from 'node-fetch';

export class DataLoader {
  constructor() {
    this.baseUrl = 'https://www.kaggle.com/datasets/mustafaanandwala/10000-bollywood-dataset';
  }

  async loadMovieData() {
    try {
      const response = await fetch(this.baseUrl);
      const data = await response.json();
      return this.preprocessData(data);
    } catch (error) {
      console.error('Error loading movie data:', error);
      throw error;
    }
  }

  preprocessData(data) {
    return data.map(movie => ({
      id: movie.id,
      title: movie.title,
      features: this.extractFeatures(movie),
      embedding: this.generateEmbedding(movie)
    }));
  }

  extractFeatures(movie) {
    return {
      genre: movie.genre,
      director: movie.director,
      actors: movie.actors,
      year: movie.year,
      rating: movie.rating
    };
  }
}