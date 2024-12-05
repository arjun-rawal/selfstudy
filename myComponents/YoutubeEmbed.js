import { AspectRatio } from "@chakra-ui/react";
import React from "react";

const YouTubeEmbed = ({ url }) => {
  // Extract the video ID from the YouTube URL
  const formatEmbedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    return null; // Invalid YouTube link
  };

  const embedUrl = formatEmbedUrl(url);

  if (!embedUrl) {
    return <p>Invalid YouTube URL</p>;
  }

  return (
    <AspectRatio ratio={4 / 3} rounded="lg" overflow="hidden">
    <iframe
    //   height="100%"
      src={embedUrl}
      title="YouTube video player"
      allowFullScreen
    ></iframe>
    </AspectRatio>
  );
};

export default YouTubeEmbed;
