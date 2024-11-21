import { Button, Center, Stack } from "@chakra-ui/react";
import Login from "./login";
import Signup from "./signup";
import { useState } from "react";





export default function authScreen() {
    const [account,setAccount] = useState(true);

    const Card=()=>{
        if (!account){
            return(
                <Stack>
                    <Signup />
                    <Button onClick={()=>{setAccount(true)}} >Already have an account? Log in.</Button>
                </Stack>
            )
        }

        else{
            return(
                <Stack>
                    <Login/>
                    <Button onClick={()=>{setAccount(false)}}> Don't have an account? Signup.</Button>
                </Stack>
            )
        }

    }
  return (
    <>
      <Center width="100vw" height="100vh">
        <Stack>
            <Card/>
        </Stack>
      </Center>
    </>
  );
}
