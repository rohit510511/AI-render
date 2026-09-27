import { NextResponse } from "next/server";

export async function GET() {
  const hasGoogleAuth = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      !process.env.GOOGLE_CLIENT_ID.includes("placeholder")
  );

  return NextResponse.json({
    hasGoogleAuth,
    redirectUri: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/callback/google`,
  });
}
