import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "cms_session";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function getSecretKey() {
  const secret = mustEnv("CMS_SESSION_SECRET");
  return new TextEncoder().encode(secret);
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export async function signSession(payload: { email: string }) {
  const key = getSecretKey();
  const token = await new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
  return token;
}

export async function verifySession(token: string) {
  const key = getSecretKey();
  const { payload } = await jwtVerify(token, key);
  const email = String(payload.email || "");
  if (!email) throw new Error("Invalid session");
  return { email };
}

export function verifyAdminCredentials(email: string, password: string) {
  const envEmail = mustEnv("CMS_ADMIN_EMAIL");
  const envPass = mustEnv("CMS_ADMIN_PASSWORD");
  return email === envEmail && password === envPass;
}
