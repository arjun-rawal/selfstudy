import { Button, Card, Center, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useState } from "react";

export default function Login() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");


    const handleSubmit = async () => {
      
        console.log(username,password);
        const res = await fetch('/api/auth/loginAuth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
      
        const data = await res.json();
      
        if (res.ok) {
          window.location.reload();          

        } else {
          alert(data.message); 
        }
      };

  return (
    <>
  
      <Card.Root maxW="sm">
        <Card.Header>
          <Card.Description>
            Fill in the form below to log into your account
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field label="Username">
              <Input 
              onChange={(e) => setUsername(e.target.value)}/>
            </Field>
            <Field label="Password">
              <Input 
              onChange={(e) => setPassword(e.target.value)}/>
            </Field>
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button variant="outline">Cancel</Button>
          <Button variant="solid" onClick={handleSubmit}>Log in</Button>
        </Card.Footer>
      </Card.Root>
    </>
  );
}
