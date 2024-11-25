import clientPromise from "../../lib/mongodb";
import OpenAI from "openai";
import { useState, useEffect } from "react";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, topic, number, time } = req.body;

    if (!topic || !number || !time) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
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
          content:
            "You are a helpful assistant that creates detailed, structured study plans.",
        },
        {
          role: "user",
          content: `
    You are tasked with creating a detailed, day-by-day study schedule based on two inputs:
    1. Topic: A subject such as 'AP Calculus.'
    2. Number of Days
    
    Provide numbered output for each day, where each day includes:
       - A **specific video topic** to study (e.g., "How to compute limits with L'Hôpital's Rule").
       - A **specific assignment** to practice (e.g., "Worksheet on computing limits using L'Hôpital's Rule").
    3. Avoid vague topics like "summary of topics" or "general review." I will be webscraping these topics for content.
    4. The output format should look like this:
    
    1. video: {specific video topic} assignment: {specific assignment topic}
    2. video: {specific video topic} assignment: {specific assignment topic}    
    Now, create a day-by-day study schedule for the following:
    Topic: {${topic}}
    Number of days: {${numDays}}
    Do not cut off in the middle, provide the entire schedule
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
    

    try {
      const client = await clientPromise;
      const db = client.db("user_database");
      const usersCollection = db.collection("plans");

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
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
