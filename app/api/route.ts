import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://data.mongodb-api.com/...", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return NextResponse.json({ data });
}
