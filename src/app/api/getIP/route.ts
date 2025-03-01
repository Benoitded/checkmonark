import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch("https://ifconfig.me/ip");
  const ip = await response.text();

  return NextResponse.json({ ip });
}
