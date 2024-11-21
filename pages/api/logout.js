export default function handler(req, res) {
    if (req.method === 'POST') {
      res.setHeader('Set-Cookie', 'sessionToken=; HttpOnly; Path=/; Max-Age=0;'); // Deletes the cookie
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
  }
  