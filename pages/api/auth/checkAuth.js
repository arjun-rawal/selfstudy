import clientPromise from '../../../lib/mongodb';

export default async function authMiddleware({ cookies, givenSessionToken }) {
  const sessionToken = givenSessionToken || cookies?.sessionToken;

  console.log("Session token received in authMiddleware:", sessionToken);

  if (!sessionToken) {
    console.log('No session token found');
    return null;
  }

  try {
    const client = await clientPromise;
    const db = client.db('user_database');
    const session = await db.collection('sessions').findOne({ token: sessionToken });

    console.log("Session retrieved from MongoDB:", session);

    if (!session || new Date() > new Date(session.expiresAt)) {
      console.log('Session expired or invalid');
      return null; // Return null for invalid or expired sessions
    }
    const username = session.username;
    const user = await db.collection('users').findOne({username})

    return { username: session.username, password: user.password }; 
  } finally {
  }
}
