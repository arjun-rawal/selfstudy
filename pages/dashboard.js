import { Box, Button, Card, Center, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import NewTopic from "./newTopic";
import { useEffect, useState } from "react";

export default function Dashboard(props) {
  const [plans, setPlans] = useState([]);
  
  useEffect(() => {
    if (!props.user) {
      window.location.href = "/";
    }
  }, [props.user]);

  useEffect(() => {
    async function fetchData() {
      if (props.user) {
        console.log("USERNAME:", props.user.username);
        const result = await getPlan(props.user.username);

        if (result?.planExists) {
          setPlans(result.result);
        }
      }
    }
    fetchData();
  }, [props.user]);

  async function getPlan(username) {
    if (!username) {
      console.error("No username provided");
      return null;
    }

    const res = await fetch("/api/checkPlan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      console.error("Failed to fetch plan:", await res.text());
      return;
    }

    const data = await res.json();
    return data;
  }

  if (!props.user) {
    return null; 
  }

  return (
    <>
        <NewTopic username={props.user} />
    </>
  );
}
