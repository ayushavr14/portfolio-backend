import { Request, Response } from "express";
import Experience from "../models/experience";
import { io } from "../server"; // Import the Socket.IO instance

export const createExperience = async (req: Request, res: Response) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();

    io.emit("experience-updated", experience); // Emit to all clients

    res.status(201).json(experience);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const getExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find();
    res.status(200).json(experiences);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!experience) {
      return res.status(404).json({ msg: "Experience not found" });
    }

    io.emit("experience-updated", experience); // Emit to all clients

    res.json(experience);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({ msg: "Experience not found" });
    }

    io.emit("experience-deleted", experience._id); // Emit deletion event with experience ID

    res.json({ msg: "Experience removed" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};
