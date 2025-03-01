import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const allowedOrigin = "https://checkmonark.byzantine.fi";
  const referer = req.headers.get("referer");
  const origin = req.headers.get("origin");

  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    if (!origin && !referer) {
      return NextResponse.json(
        { message: "Forbidden: no origin or referer" },
        { status: 403 }
      );
    }

    if (origin !== allowedOrigin && referer !== allowedOrigin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  } else {
    const localhost = "http://localhost:3000";
    if (origin !== localhost && referer !== localhost) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
