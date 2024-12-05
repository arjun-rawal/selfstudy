import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { topics } = req.body;
    if (!topics || !Array.isArray(topics)) {
      res.status(400).json({ success: false, message: 'Topics are required and must be an array' });
      return;
    }

    try {
      const API_KEY = "AIzaSyA6DW5hzFPzZhEkSHZPwBhfBaVVOq4HUfE"; //tl api key
      const searchYouTube = async (searchQuery) => {
        const endpoint = 'https://www.googleapis.com/youtube/v3/channels';
        const response = await fetch(`${endpoint}?part=contentDetails&id=<UC4a-Gbdw7vOaccHmFo40b9g>&key=${API_KEY}`);
        console.log(response)
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = fetch("www.google.com");
        console.log(result)

        

        const data = await response.json();

        return data;
        if (data.items && data.items.length > 0) {
          const video = data.items[0];
          console.log(video)
          return {
            title: video.snippet.title,
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          };
        }
        return null;
      };

      const fetchVideoLinks = async (topics) => {
        const links = [];
        for (const topic of topics) {
          const videoLink = await searchYouTube(topic);
          if (videoLink) {
            links.push(videoLink);
          }
        }
        return links;
      };

      const links = await fetchVideoLinks(topics);
      res.status(200).json({
        success: true,
        message: 'Video links found',
        links,
      });
    } catch (error) {
      console.error('Error:', error);
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
