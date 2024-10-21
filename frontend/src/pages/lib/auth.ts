import GoogleProvider from "next-auth/providers/google";
// import NextAuth, { NextAuthOptions, Session, User } from "next-auth";

interface User
{
	name: string,
	email: string,
	image: string,
	access_token: string,
}

interface Token
{
	accessToken: string,
}

interface Session
{
	accessToken: string,
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
        }
      }
    }),
	],
	callbacks: {
    async jwt({ token, account }: { token: Token; account?: User }) {
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }: { session?: Session;  token: Token} ) {
			if (session) {
        session.accessToken = token.accessToken;
			}
			return session;
		},
	},
  pages: {
    signIn: '/login',
	},
	  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 days (session expiration)
    updateAge: 24 * 60 * 60, // Optional: refresh session after 24 hours of inactivity
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7, // 7 days (JWT expiration)
  },
};
