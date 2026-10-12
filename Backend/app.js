import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose"; //ODM Library
import Feedback from "./modle/feedback.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static("../Frontend"));
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed");
    console.log(error.message);
  });

app.post("/feedback", async (req, res) => {
  try { //try and catch is a JS error-handling mechanism.
    const { name, rating, comments } = req.body;

    const feedback = new Feedback({
      name,
      rating,
      comments
    });

    await feedback.save();
     
    res.status(201).json({  // 201: new resource
      message: "Feedback saved successfully",
      feedback
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to save feedback",
      error: error.message
    });
  }
});

app.get("/feedback", async (req, res) => {
  try {
    const feedback = await Feedback.find();

    res.json(feedback);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch feedback",
      error: error.message
    });
  }
});



