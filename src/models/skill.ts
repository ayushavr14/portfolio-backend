import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Skill = mongoose.model<ISkill>("Skill", skillSchema);

export default Skill;
