import { Button, Center, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import Login from "./login";
import Signup from "./signup";
import { useState } from "react";
import GoogleSignInButton from "./googleSignInButton"
export default function AuthScreen() {
  const [account, setAccount] = useState(true);

  const Card = () => {
    if (!account) {
      return (
        <Stack>
          <Signup />
          <Button
            onClick={() => {
              setAccount(true);
            }}
          >
            Already have an account? Log in.
          </Button>
        </Stack>
      );
    } else {
      return (
        <Stack>
          <Login />
          <Button
            onClick={() => {
              setAccount(false);
            }}
          >
            {" "}
            Don&apos;t have an account? Signup.
          </Button>
        </Stack>
      );
    }
  };
  
  return (
    <>
      <Center width="100vw" height="100vh">
        <Stack>
          <Card />
          <Center>
            <VStack>
             <GoogleSignInButton/>
            </VStack>
          </Center>
        </Stack>
      </Center>
    </>
  );
}
