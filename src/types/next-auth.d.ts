import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      /** Your added field: */
      id: string;
    } & DefaultSession["user"];
  }
  interface JWT {
    /** Mirror the property you set in jwt() */
    userId: string;
  }
}
