import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Username and password are required' });
      return;
    }

    try {
      await client.connect();
      const db = client.db('user_database');
      const usersCollection = db.collection('users');

      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) {
        res.status(409).json({ success: false, message: 'Username already exists' });
        return;
      }

      
      const hashedPassword = password; 

      // Insert the new user into the database
      const result = await usersCollection.insertOne({ username, password: hashedPassword });

      // Respond with success
      res.status(201).json({ success: true, message: 'User registered successfully', userId: result.insertedId });
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
