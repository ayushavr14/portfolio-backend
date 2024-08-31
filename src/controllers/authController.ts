import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import UserDetails from "../models/userDetails";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "4h",
    });

    res.json({ msg: "User registered successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "4h",
    });

    res.json({ msg: "Logged in successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Add User Details
export const userDetails = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ msg: "No cv uploaded" });
  }

  const cv = files.map((file) => file.path);
  try {
    const userDetails = new UserDetails({
      ...req.body,
      cvLink: cv,
    });

    await userDetails.save();
    res.status(201).json(userDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to add user details." });
  }
};

// Edit User Details
export const editUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const newCvFiles = req.files as Express.Multer.File[];
  const newCvUrls = newCvFiles ? newCvFiles.map((file) => file.path) : [];

  const updatedData = {
    ...req.body,
    image: [...req.body.cvLink, ...newCvUrls],
  };

  try {
    const userDetails = await UserDetails.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!userDetails) {
      return res.status(404).json({ error: "User details not found." });
    }

    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to edit user details." });
  }
};
