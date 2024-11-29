import * as tf from '@tensorflow/tfjs';

export class MovieRecommender {
  constructor(graphDb) {
    this.graphDb = graphDb;
    this.model = null;
  }

  async initialize() {
    this.model = await this.buildModel();
    await this.trainModel();
  }

  async buildModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 256, activation: 'relu', inputShape: [512] }),
        tf.layers.dropout({ rate: 0.5 }),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'softmax' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  async getRecommendations(userId) {
    const userPreferences = await this.graphDb.getUserPreferences(userId);
    const similarUsers = await this.graphDb.findSimilarUsers(userId);
    const recommendations = await this.generateRecommendations(userPreferences, similarUsers);
    return recommendations;
  }

  async generateRecommendations(userPreferences, similarUsers) {
    // Combine collaborative filtering with content-based filtering
    const userEmbedding = await this.getUserEmbedding(userPreferences);
    const predictions = await this.model.predict(userEmbedding);
    return this.processModelPredictions(predictions, similarUsers);
  }
}