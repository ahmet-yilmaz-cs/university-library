import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.set("guest_mode", "true", {
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.redirect(new URL("/", request.url));
}
