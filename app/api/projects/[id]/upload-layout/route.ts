import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { getProjectById, updateLayoutFile } from "@/lib/db-service";
import { uploadRawFile } from "@/lib/cloudinary";

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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Please upload a CAD (.skp, .dwg) or layout reference file." },
        { status: 400 }
      );
    }

    const originalFilename = file.name || "layout-reference.dwg";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload raw file to Cloudinary / storage
    const uploadResult = await uploadRawFile(
      buffer,
      originalFilename,
      "interior-ai/layouts"
    );

    // Save to project document
    const updatedProject = await updateLayoutFile(
      id,
      session.user.id,
      uploadResult.url,
      originalFilename
    );

    return NextResponse.json(
      {
        message: "Layout reference uploaded successfully",
        layoutFileUrl: uploadResult.url,
        layoutFileName: originalFilename,
        project: updatedProject,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[POST /api/projects/[id]/upload-layout error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload layout reference file" },
      { status: 500 }
    );
  }
}
