import {
  Button,
  Center,
  Heading,
  HStack,
  Input,
  Menu,
  MenuContent,
  MenuItem,
  MenuItemCommand,
  MenuRoot,
  MenuTrigger,
  Stack,
  Text,
} from "@chakra-ui/react";
import { StepperInput } from "@/components/ui/stepper-input";
import { useState } from "react";
import Link from 'next/link';

export default function NewTopic() {
  const [timeVal, setTimeVal] = useState("Months");
  return (
    <>


      <Center height={"100vh"}>
        <Stack gap="2vh" width="auto">
          <Input placeholder="I want to learn..." />
          <Stack
            direction={{ base: "column", md: "row" }}
            margin={"auto"}
            alignItems={"center"}
          >
            <Text whiteSpace={"no-wrap"}> I have...</Text>
            <StepperInput defaultValue="3" min={1} max={5} />
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
                  Days{" "}
                </MenuItem>
                <MenuItem
                  value="Weeks"
                  onClick={(e) => {
                    setTimeVal(e.target.id);
                  }}
                >
                  Weeks{" "}
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
          <Button>Generate</Button>
        </Stack>
      </Center>
    </>
  );
}
