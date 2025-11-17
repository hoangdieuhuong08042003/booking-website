import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// Check if the route is protected (requires authentication)
function isProtectedRoute(pathname: string) {
  // Only protect dashboard routes (and their subpaths)
  const protectedRoutes = ["/dashboard"];
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

// Check if the route is an authentication route (login/auth/register)
function isAuthRoute(pathname: string) {
  return (
    pathname.startsWith("/auth") &&
    pathname !== "/auth/verify-email" &&
    !pathname.startsWith("/auth/project-share-accept")
  );
}

// function isPublicRoute(pathname: string) {
//   const publicRoutes = ["/"];
//   return publicRoutes.includes(pathname);
// }

// Check if the user has permission to access the route
// Extend this function to check for roles/permissions as needed
// function hasPermission(user: User, pathname: string) {
// }

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  callbacks: {
    // Authorization callback for NextAuth middleware
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // If user is logged in and visits auth pages or root, send to dashboard
      if (isLoggedIn && (isAuthRoute(pathname) || pathname === "/")) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // If the route is protected, require authentication
      if (isProtectedRoute(pathname)) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/auth/login", nextUrl));
        }
        return true;
      }

      // Allow access to public or other routes (including "/")
      return true;
    },
  },
  providers: [Google, Credentials],
} satisfies NextAuthConfig;
