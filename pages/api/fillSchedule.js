import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { _id, schedule } = req.body;

    if ( !schedule || !_id) {
      res.status(400).json({
        success: false,
        message: "schedule required",
      });
      return;
    }

    try {
      const client = await clientPromise;
      const db = client.db("user_database");
      const plansCollection = db.collection("plans");

 
      // Validate that the plan exists
      const plan = await plansCollection.findOne({ _id: new ObjectId(_id) });
      console.log(
        "PLAN FOUND"
      )
      if (!plan) {
        res.status(404).json({
          success: false,
          message: "Plan not found",
        });
        return;
      }

      // Update the plan with the new schedule
        console.log(JSON.stringify(schedule))
      const result = await plansCollection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { schedule } }
      );
 
      const updatedPlan =  await plansCollection.findOne({ _id: new ObjectId(_id) });

      // Respond with successs
      res.status(200).json({
        success: true,
        message: "Schedule updated successfully",
        updatedPlanId: _id,
        updatedPlan
      });
    } catch (error) {
      console.error("Error connecting to MongoDB or updating plan:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error: " + error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
