import axios from "axios";
import cheerio from "cheerio";


  const API_KEY = 'AIzaSyA6DW5hzFPzZhEkSHZPwBhfBaVVOq4HUfE';
  const CX = 'c3ade081b62534a67';

  async function searchGoogleForLearningLinks(topics) {
      const links = [];

      for (const topic of topics) {
          const query = encodeURIComponent("learn " + topic + " youtube.com video");
          const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${query}`;

          try {
              const response = await fetch(url);
              if (!response.ok) {
                  console.error(`Error fetching results for ${topic}: ${response.statusText}`);
                  continue;
              }

              const data = await response.json();

              const youtubeLinks = data.items?.filter(item => item.link.includes('youtube.com')) || [];

              if (youtubeLinks.length > 0) {
                  links.push(youtubeLinks[0].link);
              } else {
                  console.warn(`No YouTube results found for ${topic}`);
              }
          } catch (error) {
              console.error(`Error fetching results for ${topic}: ${error.message}`);
          }
      }

      return links;
  }

  const topics = ["JavaScript basics", "Python for data analysis", "Introduction to AI"];
  //console.log("YouTube Learning Links:", links);


  export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { topics } = req.body;

            if (!topics || !Array.isArray(topics) || topics.length === 0) {
                return res.status(400).json({ error: "Topics must be a non-empty array." });
            }

            const links = await searchGoogleForLearningLinks(topics);

            return res.status(200).json({ topics, links });
        } catch (error) {
            console.error("Error processing the request:", error.message);
            return res.status(500).json({ error: "Internal server error." });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed. Please use POST." });
    }
}

// export default async function handler(req, res) {
//   const { topics } = req.query;
//   console.log(topics)
//   const links = await searchGoogleForLearningLinks(topics)
//   console.log(links)
//   return res.status(200).json({ subject, links });
//   // if (!subject) {
//   //   return res.status(400).json({ error: "Subject parameter is required" });
//   // }

//   // try {
//   //   // Construct the search query
//   //   const query = subject.replace(" ", "+") + "+online+learning+resources+free";
//   //   const searchUrl = `https://www.google.com/search?q=${query}`;

//   //   // Headers to mimic a browser
//   //   const headers = {
//   //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
//   //   };

//   //   // Fetch the search results page
//   //   const response = await axios.get(searchUrl, { headers });

//   //   // Log the HTML for debugging
//   //   console.log("HTML Response:", response.data.slice(0, 500));

//   //   // Load the HTML into cheerio
//   //   const $ = cheerio.load(response.data);

//   //   // Extract links from the search results
//   //   const links = [];
//   //   $("a").each((_, element) => {
//   //     const href = $(element).attr("href");
//   //     if (
//   //       href &&
//   //       href.includes("url?q=") &&
//   //       !href.includes("webcache.googleusercontent.com") &&
//   //       !["login", "google.com", "signin", "ads", "/search"].some((badKeyword) =>
//   //         href.toLowerCase().includes(badKeyword)
//   //       )
//   //     ) {
//   //       const cleanLink = href.split("url?q=")[1].split("&")[0];
//   //       links.push(cleanLink);
//   //     }
//   //   });

//   //   // Remove duplicates and limit to the top 10
//   //   const uniqueLinks = [...new Set(links)].slice(0, 10);

//   //   // Respond with the links
//   //   return res.status(200).json({ subject, links: uniqueLinks });
//   // } catch (error) {
//   //   console.error("Error fetching or parsing search results:", error.message);
//   //   return res.status(500).json({ error: "Failed to retrieve search results" });
//   // }
// }
