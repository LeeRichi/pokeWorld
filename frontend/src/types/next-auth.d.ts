// import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // Add your custom property here
  }
}
