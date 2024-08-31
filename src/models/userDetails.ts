import mongoose, { Schema, Document } from "mongoose";

export interface IUserDetails extends Document {
  userId: Schema.Types.ObjectId;
  about?: string;
  cvLink?: string;
  githubLink?: string;
  linkedinLink?: string;
}

const userDetailsSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  about: { type: String },
  cvLink: { type: String },
  githubLink: { type: String },
  linkedinLink: { type: String },
});

const UserDetails = mongoose.model<IUserDetails>(
  "UserDetails",
  userDetailsSchema
);
export default UserDetails;
