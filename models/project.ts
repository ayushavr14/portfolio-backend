import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  demoLink: string;
  sourceCodeLink: string;
  image: string[];
  tag: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String, required: true }],
    demoLink: { type: String, required: false },
    sourceCodeLink: { type: String, required: false },
    image: { type: [String], required: false },
    tag: { type: String, required: false },
    status: { type: String, required: false },
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;
