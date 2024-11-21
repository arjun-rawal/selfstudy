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
  const [topic,setTopic] = useState("");
  const username = props.username;

  async function handleNew(){
    const res = await fetch('/api/submitPlan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, topic, number: numVal, time: timeVal}),
    });
  
    const data = await res.json();
  
    if (res.ok) {
      window.location.reload();          

    } else {
      alert(data.message); 
    }
  }


  return (
    <>


      <Center height={"100vh"}>
        <Stack gap="2vh" width="auto">
          <Input placeholder="I want to learn..." onChange={(e)=>{setTopic(e.target.value)}}/>
          <Stack
            direction={{ base: "column", md: "row" }}
            margin={"auto"}
            alignItems={"center"}
          >
            <Text whiteSpace={"no-wrap"}> I have...</Text>
            <StepperInput defaultValue="3" min={1} max={5} onClick={(value)=>{setNumVal(value)}}/>
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
          <Button onClick = {handleNew}>Generate</Button>
        </Stack>
      </Center>
    </>
  );
}
