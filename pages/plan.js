import OpenAI from "openai";
import { useState, useEffect } from "react";

const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_KEY, 
    dangerouslyAllowBrowser: true  
});

async function find() {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: "Write a haiku about recursion in programming.",
            },
        ],
    });
    console.log(completion)
    return completion.choices[0].message.content;
}

export default function TestCall() {
    const [gptCall, setGptCall] = useState("");

    useEffect(() => {
        async function fetchData() {
            const result = await find();
            setGptCall(result);
        }
        fetchData();
    }, []); // Empty dependency array ensures this runs only once after the first render.

    return (
        <>
            <p>{gptCall || "Loading..."}</p>
        </>
    );
}
