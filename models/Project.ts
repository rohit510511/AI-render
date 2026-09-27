import mongoose, { Schema, Document, Model } from "mongoose";

export type RoomType =
  | "living-room"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "dining-room"
  | "home-office"
  | "other";

export type DesignStyle =
  | "minimalist"
  | "scandinavian"
  | "industrial"
  | "boho"
  | "modern"
  | "traditional"
  | "other";

export type BudgetRange = "low" | "medium" | "high";

export type ProjectStatus =
  | "draft"
  | "moodboard-generated"
  | "layout-uploaded"
  | "render-generated"
  | "complete";

export interface IGeneratedImage {
  url: string;
  cloudinaryId: string;
  generatedAt: Date;
  prompt: string;
  model: string;
}

export interface IProject {
  userId: mongoose.Types.ObjectId | string;
  clientName: string;
  roomType: RoomType;
  style: DesignStyle;
  colorPalette?: string;
  budgetRange?: BudgetRange;
  notes?: string;
  status: ProjectStatus;
  moodboardImages: IGeneratedImage[];
  renderImages: IGeneratedImage[];
  layoutFileUrl?: string;
  layoutFileName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectDocument extends IProject, Document {
  _id: mongoose.Types.ObjectId;
}

const GeneratedImageSchema = new Schema<IGeneratedImage>(
  {
    url: { type: String, required: true },
    cloudinaryId: { type: String, default: "" },
    generatedAt: { type: Date, default: Date.now },
    prompt: { type: String, default: "" },
    model: { type: String, default: "sdxl" },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProjectDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    roomType: {
      type: String,
      required: true,
      enum: [
        "living-room",
        "bedroom",
        "kitchen",
        "bathroom",
        "dining-room",
        "home-office",
        "other",
      ],
    },
    style: {
      type: String,
      required: true,
      enum: [
        "minimalist",
        "scandinavian",
        "industrial",
        "boho",
        "modern",
        "traditional",
        "other",
      ],
    },
    colorPalette: {
      type: String,
      default: "",
    },
    budgetRange: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "draft",
        "moodboard-generated",
        "layout-uploaded",
        "render-generated",
        "complete",
      ],
      default: "draft",
    },
    moodboardImages: {
      type: [GeneratedImageSchema],
      default: [],
    },
    renderImages: {
      type: [
        new Schema<IGeneratedImage>(
          {
            url: { type: String, required: true },
            cloudinaryId: { type: String, default: "" },
            generatedAt: { type: Date, default: Date.now },
            prompt: { type: String, default: "" },
            model: { type: String, default: "flux-schnell" },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    layoutFileUrl: {
      type: String,
    },
    layoutFileName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index Project.userId for fast per-user queries
ProjectSchema.index({ userId: 1, createdAt: -1 });

// Export compiled model safe for Next.js hot-reload
export const Project: Model<IProjectDocument> =
  (mongoose.models?.Project as Model<IProjectDocument>) ||
  mongoose.model<IProjectDocument>("Project", ProjectSchema);

export default Project;
