import NextAuth from "next-auth";

void NextAuth

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}
