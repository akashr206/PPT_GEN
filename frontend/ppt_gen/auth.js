import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import api from "./lib/api";
import jwtLib from "jsonwebtoken";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const { data } = await api.post("/api/user", {
          email: user.email,
          name: user.name,
          profile: user.image,
          author_name: user.name
        }, {
          headers: {
            "x-internal-secret": process.env.AUTH_SECRET,
          }
        }
        );

        user.id = data.id;
      } catch (err) {
        console.error("Error saving user on signIn:", err);
        return false;
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account) {
        const apiToken = jwtLib.sign(
          { sub: user.id, email: user.email, userId: user.id, name: user.name },
          process.env.AUTH_SECRET,
          { algorithm: "HS256", expiresIn: "7d" }
        );
        token.apiToken = apiToken;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.apiToken;
      session.user.id = token.userId;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
})
