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
      if (account && user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        
        token.apiToken = jwtLib.sign(
          { sub: user.id, email: user.email, userId: user.id, name: user.name },
          process.env.AUTH_SECRET,
          { algorithm: "HS256", expiresIn: "1h" }
        );
        token.apiTokenExpires = Date.now() + 60 * 60 * 1000;
        return token;
      }

      if (Date.now() > token.apiTokenExpires - 5 * 60 * 1000) {
        try {
          token.apiToken = jwtLib.sign(
            { sub: token.userId, email: token.email, userId: token.userId, name: token.name },
            process.env.AUTH_SECRET,
            { algorithm: "HS256", expiresIn: "1h" }
          );
          token.apiTokenExpires = Date.now() + 60 * 60 * 1000;
        } catch (error) {
          console.error("Error refreshing apiToken:", error);
        }
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
