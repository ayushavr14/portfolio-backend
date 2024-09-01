import { Request, Response } from "express";
import Skill from "../models/skill";
import { io } from "../server"; // Import the Socket.IO instance

export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const skills = name.split(",");
    const skill = new Skill(skills);
    await skill.save();

    io.emit("skill-updated", skill);

    res.status(201).json(skill);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body);

    if (!skill) {
      return res.status(404).json({ msg: "Skill not found" });
    }

    io.emit("skill-updated", skill);

    res.json(skill);
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({ msg: "Skill not found" });
    }

    io.emit("skill-deleted", skill._id); // Emit deletion event with skill ID

    res.json({ msg: "Skill removed" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};
