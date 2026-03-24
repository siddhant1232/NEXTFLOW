import crypto from "crypto";

export async function GET() {
  const authKey = process.env.TRANSLOADIT_AUTH_KEY;
  const authSecret = process.env.TRANSLOADIT_AUTH_SECRET;

  if (!authKey || !authSecret) {
    return Response.json(
      { error: "Missing Transloadit keys in .env.local" },
      { status: 500 }
    );
  }


  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  
  const params = JSON.stringify({
    auth: { key: authKey, expires },
    steps: {
      ":original": {
        robot: "/upload/handle",
      },
    },
  });


  const hexDigest = crypto
    .createHmac("sha384", authSecret)
    .update(Buffer.from(params, "utf-8"))
    .digest("hex");

  const signature = `sha384:${hexDigest}`;

  return Response.json({ params, signature });
}
