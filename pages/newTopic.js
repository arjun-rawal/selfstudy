import {
  Button,
  Center,
  Input,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  Stack,
  Text,
} from "@chakra-ui/react";
import { StepperInput } from "@/components/ui/stepper-input";
import { useState } from "react";

export default function NewTopic(props) {
  const [timeVal, setTimeVal] = useState("Months");
  const [numVal, setNumVal] = useState(3);
  const [topic, setTopic] = useState("");
  const [showAd, setShowAd] = useState(false);
  const username = props.username?.username || "";
  const password = props.username?.password || "";
  const vastUrl = "https://s.magsrv.com/splash.php?idzone=5486412"; // Replace with your VAST URL

  const handleNumChange = (newVal) => {
    setNumVal(newVal.valueAsNumber);
  };

  async function handleNew() {
    const res = await fetch("/api/submitPlan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, topic, number: numVal, time: timeVal }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.reload();
    } else {
      alert(data.message);
    }
  }

  const handleGenerate = () => {
    setShowAd(true); // Display the video ad
  };

  const handleAdComplete = () => {
    setShowAd(false); // Hide the ad
    handleNew(); // Run the API call after the ad is complete
  };

  return (
    <Center height={"95vh"}>
      <Stack gap="2vh" width="auto">
        {showAd ? (
          <div>
            <Text>Watch this ad to proceed:</Text>
            <video
              id="video-player"
              controls
              width="600"
              onEnded={handleAdComplete}
              autoPlay
            >
              <source src={vastUrl} type="application/xml+vast" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <>
            <Input
              placeholder="I want to learn..."
              onChange={(e) => {
                setTopic(e.target.value);
              }}
            />
            <Stack
              direction={{ base: "column", md: "row" }}
              margin={"auto"}
              alignItems={"center"}
            >
              <Text whiteSpace={"no-wrap"}> I have...</Text>
              <StepperInput value={numVal} min={1} max={5} onValueChange={handleNumChange} />
              <MenuRoot positioning={{ placement: "bottom-end" }}>
                <MenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {timeVal}
                  </Button>
                </MenuTrigger>
                <MenuContent>
                  <MenuItem
                    value="Days"
                    onClick={(e) => {
                      setTimeVal(e.target.id);
                    }}
                  >
                    Days
                  </MenuItem>
                  <MenuItem
                    value="Weeks"
                    onClick={(e) => {
                      setTimeVal(e.target.id);
                    }}
                  >
                    Weeks
                  </MenuItem>
                  <MenuItem
                    value="Months"
                    onClick={(e) => {
                      setTimeVal(e.target.id);
                    }}
                  >
                    Months
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            </Stack>
            <Button onClick={handleGenerate}>Generate</Button>
          </>
        )}
      </Stack>
    </Center>
  );
}
