import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt";

// interface User
// {
// 	name: string,
// 	email: string,
// 	image: string,
// 	access_token: string,
// }

// interface Token
// {
// 	accessToken: string,
// }

// interface Session
// {
// 	accessToken: string,
// }

export const authOptions: NextAuthOptions = {
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
    // async jwt({ token, account }: { token: Token; account?: User }) {
		// 	if (account) {
		// 		token.accessToken = account.access_token;
		// 	}
		// 	return token;
		// },
		async jwt({ token, account, user }): Promise<JWT> {
      if (account && user) {
        token.accessToken = account.access_token;
      }
      return token;
    },
		async session({ session, token })
		{
			return {
				...session,
				user: {
					...session.user,
					accessToken: token.accessToken as string,
				},
			}
		}
	},
  pages: {
    signIn: '/login',
},
	session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
};
