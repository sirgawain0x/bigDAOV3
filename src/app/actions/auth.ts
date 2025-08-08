"use server";
import { VerifyLoginPayloadParams } from "thirdweb/auth";
import { cookies } from "next/headers";
import { thirdwebAuth } from "../consts/thirdwebAuth";

export const generatePayload = thirdwebAuth.generatePayload;

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  console.log({ payload });
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    console.log({ jwt });
    (await cookies()).set("jwt", jwt);
  }
}

export async function isLoggedIn() {
  const jwt = (await cookies()).get("jwt");
  if (!jwt?.value) {
    return false;
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
  console.log({ authResult });
  if (!authResult.valid) {
    return false;
  }
  return true;
}

export async function logout() {
  (await cookies()).delete("jwt");
}
