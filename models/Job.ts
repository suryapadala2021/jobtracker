import { Schema, model, models, type Document, Types } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  skills: string[];
  location: string;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  companyName?: string;
  companyLogo?: string;
  recruiterId: Types.ObjectId;
  status: "open" | "closed";
  createdAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    experienceMin: {
      type: Number,
      min: 0,
    },
    experienceMax: {
      type: Number,
      min: 0,
    },
    salaryMin: {
      type: Number,
      min: 0,
    },
    salaryMax: {
      type: Number,
      min: 0,
    },
    companyName: {
      type: String,
      trim: true,
    },
    companyLogo: {
      type: String,
      trim: true,
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
const Job = models.Job || model<IJob>("Job", JobSchema);

export default Job;
