import React, { useState, useEffect } from "react";

class Day {
    constructor(dayNumber, videoLink, assignmentLink) {
        this.dayNumber = dayNumber;
        this.videoLink = videoLink;
        this.assignmentLink = assignmentLink;
    }
}

class Week {
    constructor(weekNumber) {
        this.weekNumber = weekNumber;
        this.days = [];
    }

    addDay(day) {
        this.days.push(day);
    }
}

class Month {
    constructor(monthNumber) {
        this.monthNumber = monthNumber;
        this.weeks = [];
    }

    addWeek(week) {
        this.weeks.push(week);
    }
}

class Schedule {
    constructor() {
        this.months = [];
    }

    addMonth(month) {
        this.months.push(month);
    }
}

// Function to parse JSON array into the schedule structure
function parseSchedule(jsonArray) {
    const schedule = new Schedule();
    let currentMonth = null;
    let currentWeek = null;

    let dayCount = 0;
    let weekCount = 0;
    let monthCount = 0;

    jsonArray.forEach((dayData, index) => {
        dayCount++;
        const day = new Day(dayData.day, dayData.videoTopic, dayData.assignmentLink);

        // Start a new week every 7 days or for the first day
        if (dayCount % 7 === 1 || currentWeek === null) {
            weekCount++;
            if (currentWeek) {
                currentMonth.addWeek(currentWeek); // Append the finished week to the current month
            }
            currentWeek = new Week(weekCount);
        }

        // Add the day to the current week
        currentWeek.addDay(day);

        // Start a new month every 30 days or for the first day
        if (dayCount % 30 === 1 || currentMonth === null) {
            monthCount++;
            if (currentMonth) {
                schedule.addMonth(currentMonth); // Append the finished month to the schedule
            }
            currentMonth = new Month(monthCount);
        }

        // Handle the last day in the input
        if (index === jsonArray.length - 1) {
            if (currentWeek) {
                currentMonth.addWeek(currentWeek); // Append the last week to the current month
            }
            if (currentMonth) {
                schedule.addMonth(currentMonth); // Append the last month to the schedule
            }
        }
    });

    return schedule;
}


// Function to fetch the plan from the API
async function getPlan(username) {
    if (!username) {
        console.error("No username provided");
        return null;
    }

    try {
        const res = await fetch("/api/checkPlan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });

        if (!res.ok) {
            console.error("Failed to fetch plan:", await res.text());
            return null;
        }

        const data = await res.json();
        return data.result[0].outputText; // Adjust this if the API structure differs
    } catch (error) {
        console.error("Error fetching plan:", error);
        return null;
    }
}

export default function StudyPlan() {
    const [daySchedule, setDaySchedule] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const outputText = await getPlan("a");
                if (!outputText) {
                    console.error("No data received from the API");
                    return;
                }

                // Parse the JSON string from the API directly
                const parsedJson = JSON.parse(outputText);
                console.log(parsedJson);
                // Process the parsed JSON into the schedule structure
                const schedule = parseSchedule(parsedJson);
                setDaySchedule(schedule);
                console.log(schedule)
            } catch (error) {
                console.error("Error processing the schedule:", error);
            }
        }

        fetchData();
    }, []); // Empty dependency array ensures this runs only once

    if (!daySchedule) return <div>Loading...</div>;

    return (
        <div>
            <h1>Study Plan</h1>
            {daySchedule.months.map((month, monthIndex) => (
                <div key={monthIndex} style={{ marginBottom: "20px" }}>
                    <h2>Month {month.monthNumber}</h2>
                    {month.weeks.map((week, weekIndex) => (
                        <div key={weekIndex} style={{ marginBottom: "15px" }}>
                            <h3>Week {week.weekNumber}</h3>
                            <ul>
                                {week.days.map((day) => (
                                    <li key={day.dayNumber}>
                                        <strong>Day {day.dayNumber}</strong>:<br />
                                        <span>Video Topic: {day.videoLink}</span>
                                        <br />
                                        <span>
                                            Assignment:{" "}
                                            <a
                                                href={day.assignmentLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {day.assignmentLink}
                                            </a>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
