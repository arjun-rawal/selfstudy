import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise; // Get MongoDB client
      const db = client.db('user_database'); // Replace with your database name
      const collection = db.collection('plans'); // Replace with your collection name

      // Fetch all documents in the collection
      const cards = await collection.find({}).toArray();

      // Format data as "{topic} in {number} {time}"
      const formattedCards = cards.map(card => ({
        id: card._id,
        text: `${card.topic} in ${card.number} ${card.time}`,
      }));

      res.status(200).json({ success: true, data: formattedCards });
    } catch (error) {
      console.error('Error fetching cards:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
