import "server-only";
import { jwtVerify as joseVerify, SignJWT } from "jose";

// Fungsi untuk menandatangani JWT
export const jwtSign = async (payload: any) => {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "b265ea32ce8928b55dbfdef083d6765d4f24d59ee0ad3b0d2238a6b1f6ebb605"
  );

  // Membuat JWT dengan jose
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(process.env.JWT_EXPIRE ?? "1d")
    .sign(secret);

  return token;
};

// Fungsi untuk memverifikasi JWT
export const jwtVerify = async (token: string) => {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "b265ea32ce8928b55dbfdef083d6765d4f24d59ee0ad3b0d2238a6b1f6ebb605"
  );

  // Memverifikasi token dengan jose
  const { payload } = await joseVerify(token, secret);

  return payload; // Return payload dari token yang sudah diverifikasi
};
