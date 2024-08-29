import { Request, Response } from "express";
import Project from "../models/project";
import { io } from "../server";
import { cloudinary } from "../config/cloudinary";

export const createProject = async (req: Request, res: Response) => {
  try {
    const image = req.file ? req.file.path : null;

    const project = new Project({
      ...req.body,
      image,
    });
    await project.save();

    io.emit("project-updated", project); // Emit to all clients

    res.status(201).json(project);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    // Handle multiple image uploads
    const newImageFiles = req.files as Express.Multer.File[]; // Get new images
    const newImages = newImageFiles
      ? newImageFiles.map((file) => file.path)
      : [];

    // Find the existing project
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Extract the old images (for deletion)
    const oldImages = project.image || [];

    // Update project data with new images
    const updatedData = {
      ...req.body,
      images: [...newImages], // Set the images to the new list of images
    };

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Delete old images from Cloudinary that are not in the new list
    const oldImagePublicIds = oldImages.map((url) => {
      // Extract the public ID from the Cloudinary URL
      const segments = url.split("/");
      return segments[segments.length - 1].split(".")[0];
    });

    oldImagePublicIds.forEach(async (publicId) => {
      await cloudinary.v2.uploader.destroy(publicId);
    });

    // Emit real-time update
    io.emit("project-updated", updatedProject); // Emit to all clients

    res.json(updatedProject);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    io.emit("project-deleted", project._id);

    res.json({ msg: "Project removed" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};
