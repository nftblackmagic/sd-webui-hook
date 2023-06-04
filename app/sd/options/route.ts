import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { sdUrl, args } = await req.json();

  if (sdUrl === null || sdUrl === undefined) {
    return new Response("No sdUrl provided.", {
      status: 500,
    });
  }

  const body = args;

  const optionsResponse = await fetch(`${sdUrl}/sdapi/v1/options`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const optionsResponseJson = await optionsResponse.json();

  // console.log("optionsResponseJson in api", optionsResponseJson);

  return new Response(JSON.stringify(optionsResponseJson), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}

export async function GET(req: NextRequest) {
  const { sdUrl } = await req.json();

  if (sdUrl === null || sdUrl === undefined) {
    return new Response("No sdUrl provided.", {
      status: 500,
    });
  }

  const optionsResponse = await fetch(`${sdUrl}/sdapi/v1/options`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const optionsResponseJson = await optionsResponse.json();

  // console.log("optionsResponseJson in api", optionsResponseJson);

  return new Response(JSON.stringify(optionsResponseJson), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}
