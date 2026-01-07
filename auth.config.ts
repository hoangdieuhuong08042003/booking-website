import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const publicRoutes = ["/", "/dashboard/blog", "/dashboard/blog/[id]"];
      const authRoutes = ["/login", "/register"];

      if (nextUrl.pathname.startsWith("/admin")) {
        if (auth?.user?.role === "admin") {
          // Only redirect if not already on /admin
          if (nextUrl.pathname === "/admin") {
            return true;
          }
          return true;
        }
        return Response.redirect(new URL("/404", nextUrl));
      }

      if (isLoggedIn && nextUrl.pathname === "/") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Prevent redirect loop: if already on /dashboard, allow
      if (isLoggedIn && nextUrl.pathname === "/dashboard") {
        return true;
      }

      // Allow access to public routes for everyone
      // Allow access to /dashboard/blog and its subroutes for everyone
      if (
        publicRoutes.includes(nextUrl.pathname) ||
        nextUrl.pathname.startsWith("/dashboard/blog")
      ) {
        return true;
      }

      return true;
    },
    async session({ session, token }) {
      if (token) {
          session.user = {
            ...session.user,
            id: token.id as string,
            name: token.name as string,
            email: token.email as string,
          
            image: token.image as string,
            role: (token.role === "admin" || token.role === "user") ? token.role : "user",
          };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
       
          token.image = user.image;
          token.role = (user.role === "admin" || user.role === "user") ? user.role : "user";
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [Google],
} satisfies NextAuthConfig;