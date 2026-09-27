import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  // No adapter — using pure JWT sessions.
  // The MongoDB adapter causes OAUTH_CALLBACK_HANDLER_ERROR when local MongoDB
  // is not running because it tries getUserByAccount during Google's callback.
  // JWT strategy stores everything in a signed cookie; no DB lookup needed.
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    // 1. Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-secret",
    }),

    // 2. Instant Studio Demo / Developer Access Provider
    CredentialsProvider({
      id: "credentials",
      name: "Interior Studio Access",
      credentials: {
        email: { label: "Studio Email", type: "email", placeholder: "designer@lumenatelier.com" },
        name: { label: "Designer Name", type: "text", placeholder: "Elena Rostova" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        return {
          id: "665f1a2b3c4d5e6f7a8b9c0d",
          email: credentials.email,
          name: credentials.name || "Elena Rostova (Lead Designer)",
          image:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        // For credentials sign-in
        token.id = user.id;
      }
      if (account?.provider === "google" && profile) {
        // For Google sign-in, use the Google sub as a stable ID
        token.id = (profile as any).sub || token.sub;
        token.picture = (profile as any).picture || token.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          (token.id as string) ||
          (token.sub as string) ||
          "665f1a2b3c4d5e6f7a8b9c0d";
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "ai_interior_studio_super_secret_jwt_key_2026_dev",
};

/**
 * Server-side session retrieval helper
 */
export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}
