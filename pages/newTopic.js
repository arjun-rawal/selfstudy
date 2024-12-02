import {
  Box,
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
import VideoAd from "@/myComponents/videoAd";
import ReCAPTCHA from "react-google-recaptcha";

export default function NewTopic(props) {
  const [timeVal, setTimeVal] = useState("Months");
  const [numVal, setNumVal] = useState(3);
  const [topic, setTopic] = useState("");
  const [showAd, setShowAd] = useState(false);
  const username = props.username?.username || "";
  const password = props.username?.password || "";
  const vastUrl = "https://basil79.github.io/vast-sample-tags/pg/vast.xml";
  const [validCaptcha, setValidCaptcha] = useState(false)
  const [showErrorMessage, setErrorMessage] = useState(false)
  const handleNumChange = (newVal) => {
    setNumVal(newVal.valueAsNumber);
  };

  async function handleNew() {
    const res = await fetch("/api/submitPlan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        topic,
        number: numVal,
        time: timeVal,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.reload();
    } else {
      alert(data.message);
    }
  }

  const handleGenerate = () => {
    if (validCaptcha){
      setShowAd(true); // Display the video ad
    }
    else{
      setErrorMessage(true);
    }
  };

  const handleAdComplete = () => {
    console.log("AD DONE");
    setShowAd(false); // Hide the ad
    handleNew(); // Run the API call after the ad is complete
  };

  return (
    <Center height={"95vh"}>
      <Stack gap="2vh" width="auto">
   

        {showAd ? (
          <>
            {/* <video
              id="video-player"
              controls
              width="600"
              onEnded={handleAdComplete}
              autoPlay
            >
              <source src={vastUrl} type="application/xml+vast" />
              Your browser does not support the video tag.
            </video> */}
                    <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.7)"
          zIndex={10}
        />
            <Box zIndex={15}>
            <Text alignSelf={"center"}>Watch this ad to proceed:</Text>
            <VideoAd
              vastUrl={"https://basil79.github.io/vast-sample-tags/pg/vast.xml"}
              handleComplete={handleAdComplete}
            />
            </Box>
            <Box/>
            
            {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/qZS50KXjAX0?si=D5r2krQtDbp7MXq5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
          </>
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
              <StepperInput
                value={numVal}
                min={1}
                max={5}
                onValueChange={handleNumChange}
              />
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
            <ReCAPTCHA
              sitekey="6LeFe5AqAAAAAAFSMOGrpOD_MZvEa06Tup5YYEzh"
              onChange={(value)=>{setValidCaptcha((value.length>0)); console.log("CAPTCHA: ",value.length>0)}}
            />
            {showErrorMessage ? (
              <Text> Captcha Required! </Text>
            ) : (<></>)

            }
            <Button onClick={handleGenerate}>Generate</Button>
          </>
        )}
      </Stack>
    </Center>
  );
}
