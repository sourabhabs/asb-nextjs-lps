import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "asb_admin_session";

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getAdminCredentials() {
  return {
    username: requireEnv("ADMIN_USERNAME"),
    password: requireEnv("ADMIN_PASSWORD"),
  };
}

export function getExpectedAdminToken() {
  const { username, password } = getAdminCredentials();
  return encodeURIComponent(`${username}:${password}`);
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, getExpectedAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === getExpectedAdminToken();
}

export async function authenticateAdminLogin(username: string, password: string) {
  const expected = getAdminCredentials();
  return username === expected.username && password === expected.password;
}

export { ADMIN_COOKIE_NAME };
