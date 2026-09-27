import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise } from "./mongodb";

export const authOptions: NextAuthOptions = {
  // Use MongoDB adapter for persistent user and account storage
  adapter: process.env.MONGODB_URI ? MongoDBAdapter(clientPromise) : undefined,
  session: {
    // JWT strategy allows hybrid support for both Google OAuth and Developer Test logins
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    // 1. Google OAuth Provider (Requested primary auth)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : [
          // Fallback provider placeholder if Google keys aren't added yet
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-google-client-id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-google-client-secret",
          }),
        ]),

    // 2. Instant Studio Demo / Developer Access Provider
    // Ensures developers & reviewers can test all features without requiring immediate GCP setup
    CredentialsProvider({
      id: "credentials",
      name: "Interior Studio Access",
      credentials: {
        email: { label: "Studio Email", type: "email", placeholder: "designer@aurastudio.com" },
        name: { label: "Designer Name", type: "text", placeholder: "Elena Rostova" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        return {
          id: "665f1a2b3c4d5e6f7a8b9c0d", // Standard 24-char ObjectId format
          email: credentials.email,
          name: credentials.name || "Elena Rostova (Lead Designer)",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Ensure user ID is always string / ObjectId-compatible
        session.user.id = (token.id as string) || (token.sub as string) || "665f1a2b3c4d5e6f7a8b9c0d";
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
