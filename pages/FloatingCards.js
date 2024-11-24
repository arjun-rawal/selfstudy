import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const FloatingCards = () => {
  const [cards, setCards] = useState([]); // Fetched cards
  const [displayedCards, setDisplayedCards] = useState([]); // Cards to display on screen

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch("/api/getAllPlans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch cards:", await res.text());
          return;
        }

        const data = await res.json();
        setCards(data.data || []); // Set the fetched cards
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    }

    fetchCards();
  }, []);

  useEffect(() => {
    if (cards.length === 0) return;

    const interval = setInterval(() => {
      // Pick a random card and add it to displayedCards
      const randomCard = cards[Math.floor(Math.random() * cards.length)];

      // Precompute position and side (left/right), and assign a unique ID
      const newCard = {
        ...randomCard,
        id: Date.now(),
        top: Math.random() * 50 + 20, // Precompute Y position (20%-70%)
        side: Math.random() < 0.5 ? "left" : "right", // Randomly decide side
      };

      setDisplayedCards((prev) => [...prev, newCard]);

      // Automatically remove the card after 5 seconds
      setTimeout(() => {
        setDisplayedCards((prev) =>
          prev.filter((card) => card.id !== newCard.id)
        );
      }, 5000);
    }, 2000); // New card every 2 seconds

    return () => clearInterval(interval); // Cleanup interval
  }, [cards]);

  return (
    <Box
      position="absolute"
      width="100%"
      height="100%"
      top="0"
      pointerEvents="none"
      overflow="hidden"
      zIndex="10"
    >
      {displayedCards.map((card) => (
        <Box
          key={card.id}
          position="absolute"
          width="300px"
          p={4}
          bg="white"
          boxShadow="lg"
          borderRadius="md"
          animation={`floatUp 5s ease-in forwards`}
          top={`${card.top}%`} // Use precomputed top position
          left={card.side === "left" ? "10%" : "auto"}
          right={card.side === "right" ? "10%" : "auto"}
        >
          <Text>{card.text}</Text>
        </Box>
      ))}
      <style>
        {`
          @keyframes floatUp {
            0% {
              transform: translateY(20px);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            80% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100px);
              opacity: 0;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default FloatingCards;
