import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

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

      const user = await usersCollection.findOne({ username });
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
        return;
      }

      if (password !== user.password) {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
        return;
      }



      const sessionToken = uuidv4();
      await db.collection('sessions').insertOne({
        username,
        token: sessionToken,
        expiresAt: new Date(Date.now() + 3600 * 1000), 
      });
      res.setHeader('Set-Cookie', `sessionToken=${sessionToken}; HttpOnly; Path=/; Max-Age=3600;`);

      res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
      console.error('Error connecting to MongoDB or querying user:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
