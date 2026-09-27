import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { createNewProject, getProjectsByUser } from "@/lib/db-service";
import { z } from "zod";

const createProjectSchema = z.object({
  clientName: z.string().min(1, "Client name is required").trim(),
  roomType: z.enum([
    "living-room",
    "bedroom",
    "kitchen",
    "bathroom",
    "dining-room",
    "home-office",
    "other",
  ]),
  style: z.enum([
    "minimalist",
    "scandinavian",
    "industrial",
    "boho",
    "modern",
    "traditional",
    "other",
  ]),
  colorPalette: z.string().optional().default(""),
  budgetRange: z.enum(["low", "medium", "high"]).optional().default("medium"),
  notes: z.string().optional().default(""),
});

// 1. POST /api/projects — create a project tied to the signed-in user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = createProjectSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { clientName, roomType, style, colorPalette, budgetRange, notes } = parseResult.data;

    const result = await createNewProject(session.user.id, {
      clientName,
      roomType,
      style,
      colorPalette,
      budgetRange,
      notes,
    });

    return NextResponse.json(
      {
        id: result.id,
        message: "Project created successfully",
        project: result.project,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[POST /api/projects error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create project" },
      { status: 500 }
    );
  }
}

// 2. GET /api/projects — list the signed-in user's projects
export async function GET() {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const projects = await getProjectsByUser(session.user.id);
    return NextResponse.json(projects, { status: 200 });
  } catch (err: any) {
    console.error("[GET /api/projects error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to retrieve projects" },
      { status: 500 }
    );
  }
}
