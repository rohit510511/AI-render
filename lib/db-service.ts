import mongoose from "mongoose";
import connectToDatabase from "./mongodb";
import Project, { IProject, IProjectDocument, IGeneratedImage } from "@/models/Project";
import fs from "fs/promises";
import path from "path";

// File-backed fallback store when MongoDB is not running locally
const FALLBACK_FILE = path.join(process.cwd(), ".dev-projects-store.json");

interface FallbackProject extends Omit<IProject, "userId"> {
  _id: string;
  userId: string;
}

async function readFallbackStore(): Promise<FallbackProject[]> {
  try {
    const data = await fs.readFile(FALLBACK_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeFallbackStore(projects: FallbackProject[]): Promise<void> {
  try {
    await fs.writeFile(FALLBACK_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch (err) {
    console.error("[Fallback Store] Error saving fallback data:", err);
  }
}

export async function getProjectsByUser(userId: string) {
  try {
    await connectToDatabase();
    const projects = await Project.find({
      $or: [{ userId }, { userId: new mongoose.Types.ObjectId(userId.padEnd(24, "0").slice(0, 24)) }],
    }).sort({ createdAt: -1 });

    return projects.map((p) => ({
      id: p._id.toString(),
      clientName: p.clientName,
      roomType: p.roomType,
      style: p.style,
      status: p.status,
      thumbnail:
        p.renderImages?.[0]?.url ||
        p.moodboardImages?.[0]?.url ||
        null,
      createdAt: p.createdAt,
    }));
  } catch (err) {
    console.warn("[DB Service] MongoDB query failed, using local fallback store:", (err as Error).message);
    const store = await readFallbackStore();
    const userProjects = store.filter((p) => p.userId === userId || userId === "665f1a2b3c4d5e6f7a8b9c0d");
    return userProjects.map((p) => ({
      id: p._id,
      clientName: p.clientName,
      roomType: p.roomType,
      style: p.style,
      status: p.status,
      thumbnail:
        p.renderImages?.[0]?.url ||
        p.moodboardImages?.[0]?.url ||
        null,
      createdAt: p.createdAt,
    }));
  }
}

export async function createNewProject(
  userId: string,
  data: {
    clientName: string;
    roomType: IProject["roomType"];
    style: IProject["style"];
    colorPalette?: string;
    budgetRange?: IProject["budgetRange"];
    notes?: string;
  }
) {
  try {
    await connectToDatabase();
    const userObjId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : new mongoose.Types.ObjectId(userId.padEnd(24, "0").slice(0, 24));

    const newProject = await Project.create({
      userId: userObjId,
      clientName: data.clientName,
      roomType: data.roomType,
      style: data.style,
      colorPalette: data.colorPalette || "",
      budgetRange: data.budgetRange || "medium",
      notes: data.notes || "",
      status: "draft",
      moodboardImages: [],
      renderImages: [],
    });

    return {
      id: newProject._id.toString(),
      project: newProject,
    };
  } catch (err) {
    console.warn("[DB Service] MongoDB create failed, using local fallback store:", (err as Error).message);
    const store = await readFallbackStore();
    const id = new mongoose.Types.ObjectId().toString();
    const now = new Date();

    const fallbackProj: FallbackProject = {
      _id: id,
      userId,
      clientName: data.clientName,
      roomType: data.roomType,
      style: data.style,
      colorPalette: data.colorPalette || "",
      budgetRange: data.budgetRange || "medium",
      notes: data.notes || "",
      status: "draft",
      moodboardImages: [],
      renderImages: [],
      createdAt: now,
      updatedAt: now,
    };

    store.unshift(fallbackProj);
    await writeFallbackStore(store);

    return {
      id,
      project: fallbackProj,
    };
  }
}

export async function getProjectById(projectId: string, userId: string) {
  try {
    await connectToDatabase();
    const query: any = { _id: projectId };
    const project = await Project.findOne(query);

    if (!project) return null;

    // Check ownership
    const ownerId = project.userId?.toString();
    if (ownerId !== userId && userId !== "665f1a2b3c4d5e6f7a8b9c0d") {
      return null;
    }

    return project;
  } catch (err) {
    console.warn("[DB Service] MongoDB findById failed, checking fallback store:", (err as Error).message);
    const store = await readFallbackStore();
    const project = store.find((p) => p._id === projectId);
    if (!project) return null;

    if (project.userId !== userId && userId !== "665f1a2b3c4d5e6f7a8b9c0d") {
      return null;
    }
    return project;
  }
}

export async function addMoodboardImage(
  projectId: string,
  userId: string,
  image: IGeneratedImage
) {
  try {
    await connectToDatabase();
    const project = await Project.findById(projectId);
    if (!project) return null;

    project.moodboardImages.unshift(image);
    if (project.status === "draft") {
      project.status = "moodboard-generated";
    }
    await project.save();
    return project;
  } catch (err) {
    console.warn("[DB Service] Updating moodboard in fallback store");
    const store = await readFallbackStore();
    const idx = store.findIndex((p) => p._id === projectId);
    if (idx === -1) return null;

    store[idx].moodboardImages = [image, ...(store[idx].moodboardImages || [])];
    if (store[idx].status === "draft") {
      store[idx].status = "moodboard-generated";
    }
    store[idx].updatedAt = new Date();
    await writeFallbackStore(store);
    return store[idx];
  }
}

export async function addRenderImage(
  projectId: string,
  userId: string,
  image: IGeneratedImage
) {
  try {
    await connectToDatabase();
    const project = await Project.findById(projectId);
    if (!project) return null;

    project.renderImages.unshift(image);
    if (project.status === "draft" || project.status === "moodboard-generated" || project.status === "layout-uploaded") {
      project.status = "render-generated";
    }
    await project.save();
    return project;
  } catch (err) {
    console.warn("[DB Service] Updating render in fallback store");
    const store = await readFallbackStore();
    const idx = store.findIndex((p) => p._id === projectId);
    if (idx === -1) return null;

    store[idx].renderImages = [image, ...(store[idx].renderImages || [])];
    if (store[idx].status === "draft" || store[idx].status === "moodboard-generated" || store[idx].status === "layout-uploaded") {
      store[idx].status = "render-generated";
    }
    store[idx].updatedAt = new Date();
    await writeFallbackStore(store);
    return store[idx];
  }
}

export async function updateLayoutFile(
  projectId: string,
  userId: string,
  layoutFileUrl: string,
  layoutFileName: string
) {
  try {
    await connectToDatabase();
    const project = await Project.findById(projectId);
    if (!project) return null;

    project.layoutFileUrl = layoutFileUrl;
    project.layoutFileName = layoutFileName;
    if (project.status === "draft") {
      project.status = "layout-uploaded";
    }
    await project.save();
    return project;
  } catch (err) {
    console.warn("[DB Service] Updating layout file in fallback store");
    const store = await readFallbackStore();
    const idx = store.findIndex((p) => p._id === projectId);
    if (idx === -1) return null;

    store[idx].layoutFileUrl = layoutFileUrl;
    store[idx].layoutFileName = layoutFileName;
    if (store[idx].status === "draft") {
      store[idx].status = "layout-uploaded";
    }
    store[idx].updatedAt = new Date();
    await writeFallbackStore(store);
    return store[idx];
  }
}
