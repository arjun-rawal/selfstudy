import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { count } = req.body; // Get the number of documents to insert

    // Validate input
    if (!count || typeof count !== 'number' || count <= 0) {
      res.status(400).json({
        success: false,
        message: 'A valid count (positive number) is required',
      });
      return;
    }

    try {
      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db('user_database'); // Replace with your database name
      const plansCollection = db.collection('plans'); // Collection storing plans

      // Generate random data
      const courses = [
        'Calculus',
        'Pre-Calculus',
        'AP Biology',
        'AP Chemistry',
        'Linear Algebra',
        'Discrete Mathematics',
        'Physics',
        'US History',
        'World History',
      ];
      const times = ['Days', 'Weeks', 'Months'];
      const randomPlans = Array.from({ length: count }).map(() => ({
        username: 'testdata',
        topic: courses[Math.floor(Math.random() * courses.length)], // Random course
        number: Math.floor(Math.random() * 5) + 1, // Random number between 1 and 5
        time: times[Math.floor(Math.random() * times.length)], // Random time
      }));

      // Insert data into the collection
      const result = await plansCollection.insertMany(randomPlans);

      // Respond with success
      res.status(200).json({
        success: true,
        message: `${result.insertedCount} documents inserted successfully.`,
        insertedIds: result.insertedIds,
      });
    } catch (error) {
      console.error('Error inserting data into MongoDB:', error);
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
