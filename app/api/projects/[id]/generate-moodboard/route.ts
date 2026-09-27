import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { getProjectById, addMoodboardImage } from "@/lib/db-service";
import { buildMoodboardPrompt } from "@/lib/prompts";
import { runCloudflareAI } from "@/lib/cloudflare-ai";
import { uploadImageBuffer } from "@/lib/cloudinary";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, props: RouteProps) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { id } = await props.params;
    const project = await getProjectById(id, session.user.id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or unauthorized access" },
        { status: 404 }
      );
    }

    // Parse optional body overrides if provided
    let customPrompt: string | undefined;
    try {
      const body = await req.json();
      customPrompt = body?.customPrompt;
    } catch {
      // Body is optional
    }

    // 1. Build text prompt from stored requirements
    const prompt = customPrompt || buildMoodboardPrompt(project);

    // 2. Call Cloudflare Workers AI SDXL model
    const imageBuffer = await runCloudflareAI({
      model: "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      prompt,
      numSteps: 25,
    });

    // 3. Upload resulting image buffer to Cloudinary
    const uploadResult = await uploadImageBuffer(imageBuffer, "interior-ai/moodboards");

    // 4. Save to project moodboardImages
    const newImage = {
      url: uploadResult.url,
      cloudinaryId: uploadResult.publicId,
      generatedAt: new Date(),
      prompt,
      model: "sdxl",
    };

    const updatedProject = await addMoodboardImage(id, session.user.id, newImage);

    return NextResponse.json(
      {
        message: "Moodboard generated and saved successfully",
        image: newImage,
        project: updatedProject,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[POST /api/projects/[id]/generate-moodboard error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate moodboard image" },
      { status: 500 }
    );
  }
}
