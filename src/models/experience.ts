import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  title: string;
  company: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
  },
  { timestamps: true }
);

const Experience = mongoose.model<IExperience>("Experience", experienceSchema);

export default Experience;
