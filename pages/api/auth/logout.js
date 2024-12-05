import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Connect to MongoDB
            const client = await clientPromise;
            const db = client.db('user_database'); // Replace with your database name
            const sessionsCollection = db.collection('sessions'); // Replace with your session collection name

            // Extract session token from cookies (if it's stored there)
            const sessionToken = req.cookies.sessionToken;

            if (sessionToken) {
                const result = await sessionsCollection.deleteMany({});
                
                if (result.deletedCount === 0) {
                    console.warn('Session token not found in the database.');
                }
            }

            // Clear the cookie
            res.setHeader('Set-Cookie', 'sessionToken=; Path=/; Max-Age=0;');

            // Send response
            res.status(200).json({ success: true, message: 'Logged out successfully' });
        } catch (error) {
            console.error('Error during logout:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
}
