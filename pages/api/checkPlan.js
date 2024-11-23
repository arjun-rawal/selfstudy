import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username } = req.body;

    // Validate input
    if (!username) {
      res.status(400).json({ success: false, message: 'Username is required' });
      return;
    }

    try {
      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db('user_database'); // Replace with your database name
      const plansCollection = db.collection('plans'); // Collection storing plans

      // Query the database for the user's plan
      const result = await plansCollection.findOne({ username });
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
