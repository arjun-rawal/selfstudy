import { OAuth2Client } from "google-auth-library";
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

import clientPromise from '../../../../lib/mongodb';
export default async function handler(req, res) {
  console.log(req.body);
  const { credential } = req.body;

  if (!credential) {
     res.status(400).send("Missing credential");
  }

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL);

  try {
    // Exchange the code for an access token
    // const { tokens } = await client.getToken(code);
    // const idToken = tokens.id_token;

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;

    const mongoClient = await clientPromise;
    const db = mongoClient.db('user_database'); 
    const users = db.collection('users');
    let user = await users.findOne({ username: email });

    const encryptedEmail = CryptoJS.SHA256(email).toString();
    console.log(user)
    if (!user) {      
        await users.insertOne({ username: email, password: encryptedEmail });
    }


    const sessionToken = uuidv4();
    await db.collection('sessions').insertOne({
      username : email,
      token: sessionToken,
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1-hour expiration
    });

    // Set the session token as an HTTP-only cookie
    res.setHeader('Set-Cookie', `sessionToken=${sessionToken}; HttpOnly; Path=/; Max-Age=3600;`);
    
    
         res.redirect("/")          

  } catch (error) {
    console.error(error);
     res.status(500).send("Authentication failed");
  }
}
