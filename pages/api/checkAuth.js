import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export default async function authMiddleware(req) {
  const sessionToken = req.cookies?.sessionToken;

  if (!sessionToken) {
    console.log('No session token found');
    return null; // Return null when no session token is present
  }

  try {
    await client.connect();
    const db = client.db('user_database');
    const session = await db.collection('sessions').findOne({ token: sessionToken });

    if (!session || new Date() > new Date(session.expiresAt)) {
      console.log('Session expired or invalid');
      return null; // Return null for invalid or expired sessions
    }

    // Return user data
    return { username: session.username }; // Ensure returned value is serializable
  } finally {
    await client.close();
  }
}
