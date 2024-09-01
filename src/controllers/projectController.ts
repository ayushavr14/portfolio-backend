import { Request, Response } from "express";
import Project from "../models/project";
import { io } from "../server";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { technologies, ...restData } = req.body;

    const singleTechnology = technologies.split(",");

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ msg: "No images uploaded" });
    }

    const imageUrls = files.map((file) => file.path);

    const newProject = new Project({
      ...restData,
      technologies: singleTechnology,
      image: imageUrls,
    });

    const savedProject = await newProject.save();

    io.emit("project-created", savedProject);
    res
      .status(201)
      .json({ msg: "Project Added Successfully", savedProject: savedProject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { search, technology, date, status } = req.query;

    // Initialize a filter object
    let filter: any = {};

    // Apply search filter (search by title, description, or tags)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tag: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by technology (assuming technology is an array in the schema)
    if (technology) {
      filter.technologies = { $in: [technology] };
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by date
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(date as string);
      endDate.setHours(23, 59, 59, 999); // End of the day
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    // Fetch projects based on the constructed filter
    const projects = await Project.find(filter);

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
    const { technologies, image: updatedImageList, ...restData } = req.body;

    // Ensure technologies is a string and split it into an array
    const singleTechnology =
      typeof technologies === "string" ? technologies.split(",") : [];

    // Handle file uploads
    const newImageFiles = req.files as Express.Multer.File[]; // Files from the request
    const newImageUrls = newImageFiles
      ? newImageFiles.map((file) => file.path)
      : [];

    // Find the project by ID
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Ensure updatedImageList is an array or default to an empty array
    const updatedImageArray = Array.isArray(updatedImageList)
      ? updatedImageList
      : [];

    // Combine existing images with new images and filter out images that are removed
    const existingImages = Array.isArray(project.image) ? project.image : [];
    const combinedImages = [
      ...newImageUrls,
      ...existingImages.filter((img) => updatedImageArray.includes(img)),
    ];

    // Prepare the data to be updated
    const updatedData = {
      ...restData,
      technologies: singleTechnology,
      image: combinedImages,
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

    // Emit the updated project
    io.emit("project-updated", updatedProject);

    res.json(updatedProject);
  } catch (error) {
    console.log(error);

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
