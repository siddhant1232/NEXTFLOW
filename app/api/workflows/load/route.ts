import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  const result = await sql`
    SELECT * FROM workflows
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (!result.length) {
    return Response.json({ nodes: [], edges: [] });
  }

  return Response.json(result[0].data);
}