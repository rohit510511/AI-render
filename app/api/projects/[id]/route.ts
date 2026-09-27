import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { getProjectById } from "@/lib/db-service";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, props: RouteProps) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { id } = await props.params;

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const project = await getProjectById(id, session.user.id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or you do not have permission to view it" },
        { status: 404 }
      );
    }

    return NextResponse.json(project, { status: 200 });
  } catch (err: any) {
    console.error("[GET /api/projects/[id] error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to retrieve project details" },
      { status: 500 }
    );
  }
}
