import { Box, Button, Card, Center, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import NewTopic from "./newTopic";
import { useEffect, useState } from "react";

export default function Dashboard(props) {

  console.log(props.user);
  useEffect(() => {
    if (props.user === undefined) {
      window.location.href = "/";
    }
  }, [props.user]);

  if (props.user === undefined) {
    return;
  }

  const user = props.user;
  
  const [plans, setPlans] = useState([]);

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

  useEffect(() => {
    async function fetchData() {
      if (user) {
        console.log("USERNAME:", user.username);
        const result = await getPlan(user.username);

        if (result.planExists) {
          setPlans(result.result);
        }
      }
    }
    fetchData();
  }, [user]);

  console.log(plans)
  return (
    <>
      {plans.length === 0 ? (
        <NewTopic username={user} />
      ) : (
        <>

          {plans.map((plan) => (
            <div border="3px black solid" key={plan._id} width="20vw" height="20vw">
   
                {plan.topic}

            </div>
          ))}

        </>
      )}
    </>
  );
}
