export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}

export async function PUT(request: Request) {
  return handler(request);
}

export async function PATCH(request: Request) {
  return handler(request);
}

export async function DELETE(request: Request) {
  return handler(request);
}

async function handler(request: Request) {
  // Get part after /api/admin/ in the string URL
  const requestUrl = request.url.split("/api/admin")[1];

  // Update the API base URL to the correct endpoint
  const url = `https://api.korbojoy.shop/v1${requestUrl}`;

  const options: RequestInit = {
    method: request.method,
    headers: {
      prefer: (request.headers.get("prefer") as string) ?? "",
      accept: request.headers.get("accept") ?? "application/json",
      ["content-type"]:
        request.headers.get("content-type") ?? "application/json",
      // Supabase authentication (if needed, adjust as per your implementation)
      apiKey: process.env.SUPABASE_SERVICE_ROLE ?? "",
      Authorization: "Bearer " + (process.env.SUPABASE_API_KEY ?? ""),
    },
  };

  // If the request contains a body, include it in the options
  if (request.body) {
    const body = await request.json();
    options.body = JSON.stringify(body);
  }

  // Call the API with the constructed URL and options
  const response = await fetch(url, options);

  const contentRange = response.headers.get("content-range");

  const headers = new Headers();
  if (contentRange) {
    headers.set("Content-Range", contentRange);
  }
  const data = await response.text();
  return new Response(data, {
    status: response.status, // Use the actual status code from the response
    headers,
  });
}
