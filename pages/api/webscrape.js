import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  const { subject } = req.query;

  if (!subject) {
    return res.status(400).json({ error: "Subject parameter is required" });
  }

  try {
    // Construct the search query
    const query = subject.replace(" ", "+") + "+online+learning+resources+free";
    const searchUrl = `https://www.google.com/search?q=${query}`;

    // Headers to mimic a browser
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    };

    // Fetch the search results page
    const response = await axios.get(searchUrl, { headers });

    // Log the HTML for debugging
    console.log("HTML Response:", response.data.slice(0, 500));

    // Load the HTML into cheerio
    const $ = cheerio.load(response.data);

    // Extract links from the search results
    const links = [];
    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (
        href &&
        href.includes("url?q=") &&
        !href.includes("webcache.googleusercontent.com") &&
        !["login", "google.com", "signin", "ads", "/search"].some((badKeyword) =>
          href.toLowerCase().includes(badKeyword)
        )
      ) {
        const cleanLink = href.split("url?q=")[1].split("&")[0];
        links.push(cleanLink);
      }
    });

    // Remove duplicates and limit to the top 10
    const uniqueLinks = [...new Set(links)].slice(0, 10);

    // Respond with the links
    return res.status(200).json({ subject, links: uniqueLinks });
  } catch (error) {
    console.error("Error fetching or parsing search results:", error.message);
    return res.status(500).json({ error: "Failed to retrieve search results" });
  }
}
