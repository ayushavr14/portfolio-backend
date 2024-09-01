import mongoose, { Schema, Document } from "mongoose";

export interface IUserDetails extends Document {
  user: { type: String };
  about?: string;
  cvLink?: string[];
  githubLink?: string;
  linkedinLink?: string;
}

const userDetailsSchema: Schema = new Schema({
  user: { type: String },
  about: { type: String },
  cvLink: { type: [String], required: false },
  githubLink: { type: String },
  linkedinLink: { type: String },
});

const UserDetails = mongoose.model<IUserDetails>(
  "UserDetails",
  userDetailsSchema
);
export default UserDetails;
