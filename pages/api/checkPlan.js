import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { username, authToken } = req.body;

    // Validate input
    if (!username && !authToken) {
      res.status(400).json({ success: false, message: 'Username is required' });
      return;
    }
    const client = await clientPromise;
    const db = client.db('user_database'); // Replace with your database name
    const sessions = db.collection('sessions')
    if (!username){
      try{
        console.log(await sessions.findOne({token:authToken}))
         username = (await sessions.findOne({token:authToken})).username
        console.log("USERNAME FOUND", username)
      } catch (error){
        res.status(500).json({ success: false, message: 'Internal Server Error' });
        return;
      }
    }

    try {
      // Connect to MongoDB
// Collection storing plans

      // Query the database for the user's plan
      const plansCollection = db.collection('plans'); 
      const result = await plansCollection.find({username}).toArray();

      console.log("HERE",result)
      console.log("USERNAME: ", username);
      // Respond based on the query result
      if (!result) {
        res.status(200).json({
          success: true,
          username: username,
          message: 'No plans found for the user',
          planExists: false,
        });
      } else {
        res.status(200).json({
          success: true,
          username: username,
          message: 'Plan found for the user',
          planExists: true,
          result,
        });
      }
    } catch (error) {
      console.error('Error querying MongoDB:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} is not allowed`,
    });
  }
}
