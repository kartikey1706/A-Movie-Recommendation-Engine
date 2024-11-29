import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

export class GraphDatabase {
  constructor() {
    this.driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    );
  }

  async getUserPreferences(userId) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[r:RATED]->(m:Movie)
         RETURN m, r.rating`,
        { userId }
      );
      return result.records.map(record => ({
        movie: record.get('m').properties,
        rating: record.get('r.rating')
      }));
    } finally {
      await session.close();
    }
  }

  async findSimilarUsers(userId) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u1:User {id: $userId})-[r1:RATED]->(m:Movie)<-[r2:RATED]-(u2:User)
         WHERE u1 <> u2
         WITH u2, count(*) AS commonMovies, 
         avg(abs(r1.rating - r2.rating)) AS ratingDiff
         WHERE commonMovies > 5
         RETURN u2
         ORDER BY ratingDiff ASC, commonMovies DESC
         LIMIT 10`,
        { userId }
      );
      return result.records.map(record => record.get('u2').properties);
    } finally {
      await session.close();
    }
  }
}