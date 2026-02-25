import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.AUTHENTICATION_CLIENT_ID);
export async function verifyAuthorizarionToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.AUTHENTICATION_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Invalid Google token");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    given_name: payload.given_name,
    family_name: payload.family_name,
    picture: payload.picture,
  };
}