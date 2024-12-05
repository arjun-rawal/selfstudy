import clientPromise from "../../lib/mongodb";
import OpenAI from "openai";
import { useState, useEffect } from "react";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password, topic, number, time } = req.body;
    
    if (!topic || !number || !time) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

  

    try {
      const client = await clientPromise;
      const db = client.db("user_database");
      const usersCollection = db.collection("plans");

      const user = await db.collection('users').findOne({ username: username });

      if(!user){
        console.log("user not found")
        res.status(400).json({
          success: false,
          message: "User not found",
        });
        return;
      }
  
      if (user.password != password){
        console.log("Access Denied")
        res.status(400).json({
          success: false,
          message: "Access Denied",
        });
        return;
      }
  
  
  
      let numDays = 0;
      if (time === "Days"){
        numDays = number;
      }
      else if (time === "Weeks"){
        numDays = number*7;
      }
      else{
        numDays = number*30;
      }
  
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 5000, 
        messages: [
          
          {
            role: "system",
            content: `
                                                       You are tasked with creating a detailed, day-by-day study schedule based on two inputs:
                            1. Topic: A subject such as 'AP Calculus.'
                            2. Number of Days: The number of days to create the schedule for.

                            Your response must be in JSON format for easy parsing. Use the following structure:
                            
                            [
                                {
                                    "day": 1,
                                    "videoTopic": " video topic for Day 1",
                                    "assignmentLink": "link to an assignment for Day 1"
                                },
                                {
                                    "day": 2,
                                    "videoTopic": "video topic  for Day 2",
                                    "assignmentLink": "Link to an assignment for Day 2"
                                },
                            ]

                            Ensure each day's video topic and assignment are specific to the subject, avoiding vague topics like "summary of topics." Ensure that all data fits the JSON structure exactly. Do not include any text outside the JSON object.

                            Now, create a day-by-day study schedule for the following:
                            Topic: ${topic}
                            Number of days: ${numDays}

                            DO NOT START YOUR OUTPUT WITH A HEADER I.E.('''json) ONLY RETURN EXACT JSON FORMAT
                            DO NOT PROVIDE EXAMPLE LINKS FOR ASSIGNMENTS, FIND REAL ONES ONLINE

            `,
          },
        ],
        temperature: 0.7, 
        n: 1, 
      });
  
      console.log(completion);
      const promptTokens = completion.usage.prompt_tokens;
      const completionTokens = completion.usage.completion_tokens;
  
  
      const costInput = (promptTokens / 1000000) * 2.5; 
      const costOutput = (completionTokens / 1000000) * 10; 
  
  
      const totalCost = costInput + costOutput;
      const outputText = completion.choices[0].message.content
    
      

      const result = await usersCollection.insertOne({
        username,
        topic,
        numDays,
        outputText,
        totalCost
      });

      // Respond with success
      res.status(201).json({
        success: true,
        message: "Topic registered successfully",
        userId: result.insertedId,
      });
    } catch (error) {
      console.error("Error connecting to MongoDB or inserting user:", error);
      res
        .status(500)
        .json({ success: false, message: 'Internal Server Error'+error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
