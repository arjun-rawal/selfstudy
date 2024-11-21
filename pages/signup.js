import { Button, Card, Center, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useState } from "react";
export default function Login() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleSubmit = async () => {
      
        console.log(username,password);
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
          }
        const res = await fetch('/api/signupAuth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
      
        const data = await res.json();
      
        if (res.ok) {
          alert('success');
   
        } else {
          alert(data.message); 
        }
      };











  return (
    <>
      <Card.Root maxW="sm">
        <Card.Header>
          <Card.Description>
            Fill in the form below to create an account
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
            <Field label="Confirm Password">
              <Input 
              onChange={(e) => setConfirmPassword(e.target.value)}/>
            </Field>
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button variant="outline">Cancel</Button>
          <Button variant="solid" onClick={handleSubmit}>Sign in</Button>
        </Card.Footer>
      </Card.Root>
    </>
  );
}
