import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { getProjectById, addRenderImage } from "@/lib/db-service";
import { buildRenderPrompt } from "@/lib/prompts";
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

    // 1. Build photorealistic prompt template from stored requirements
    const prompt = customPrompt || buildRenderPrompt(project);

    // 2. Call Cloudflare Workers AI Flux-1-Schnell model
    const imageBuffer = await runCloudflareAI({
      model: "@cf/black-forest-labs/flux-1-schnell",
      prompt,
      numSteps: 4,
    });

    // 3. Upload resulting render image to Cloudinary
    const uploadResult = await uploadImageBuffer(imageBuffer, "interior-ai/renders");

    // 4. Save to project renderImages
    const newImage = {
      url: uploadResult.url,
      cloudinaryId: uploadResult.publicId,
      generatedAt: new Date(),
      prompt,
      model: "flux-schnell",
    };

    const updatedProject = await addRenderImage(id, session.user.id, newImage);

    return NextResponse.json(
      {
        message: "Photorealistic render generated and saved successfully",
        image: newImage,
        project: updatedProject,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[POST /api/projects/[id]/generate-render error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate render image" },
      { status: 500 }
    );
  }
}
