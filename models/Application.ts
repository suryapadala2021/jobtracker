import { Schema, model, models, type Document, Types } from "mongoose";

export interface IApplication extends Document {
  jobId: Types.ObjectId;
  userId: Types.ObjectId;
  recruiterId: Types.ObjectId;
  status: "applied" | "shortlisted" | "rejected";
  appliedAt: Date;
  fullName: string;
  email: string;
  resumeLink: string;
  note?: string;
}

const ApplicationSchema = new Schema<IApplication>({
  jobId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Job",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  recruiterId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["applied", "shortlisted", "rejected"],
    default: "applied",
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  fullName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  resumeLink: {
    type: String,
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  },
});

const Application =
  models.Application || model<IApplication>("Application", ApplicationSchema);

export default Application;
