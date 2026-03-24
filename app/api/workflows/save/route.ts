import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { nodes, edges } = await req.json();

  const sql = neon(process.env.DATABASE_URL!);


  await sql`
    DELETE FROM workflows
    WHERE user_id = ${userId}
  `;


  await sql`
    INSERT INTO workflows (id, user_id, data)
    VALUES (${Date.now().toString()}, ${userId}, ${JSON.stringify({
      nodes,
      edges,
    })})
  `;

  return Response.json({ success: true });
}