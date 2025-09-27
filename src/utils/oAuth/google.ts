import { z } from "zod";
import { OAuthClient } from "./index";

export function createGoogleOAuthClient() {
  return new OAuthClient({
    provider: "GOOGLE",
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    scopes: ["openid", "email", "profile"],
    urls: {
      auth: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token",
      user: "https://www.googleapis.com/oauth2/v2/userinfo",
    },
    userInfo: {
      schema: z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        given_name: z.string().optional(),
        family_name: z.string().optional(),
        picture: z.string().url().optional(),
        verified_email: z.boolean().optional(),
      }),
      parser: (user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.picture,
      }),
    },
  });
}
