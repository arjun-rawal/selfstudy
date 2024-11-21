import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, topic, number, time } = req.body;

    if (!topic || !number || !time) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }

    try {
      await client.connect();
      const db = client.db('user_database');
      const usersCollection = db.collection('plans');

      
      const result = await usersCollection.insertOne({ username, topic, number, time});

      // Respond with success
      res.status(201).json({ success: true, message: 'Topic registered successfully', userId: result.insertedId });
    } catch (error) {
      console.error('Error connecting to MongoDB or inserting user:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
