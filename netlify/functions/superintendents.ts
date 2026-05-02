import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { superintendents } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method === "GET") {
    try {
      const allSupts = await db.select().from(superintendents);
      return Response.json(allSupts);
    } catch (e) {
      console.error(e);
      return Response.json({ error: "Failed to fetch superintendents" }, { status: 500 });
    }
  }

  if (req.method === "POST") {
    try {
      const { districtId, name } = await req.json();
      if (!districtId || !name) {
        return Response.json({ error: "Missing districtId or name" }, { status: 400 });
      }
      
      const [updated] = await db.insert(superintendents)
        .values({ districtId: Number(districtId), name })
        .onConflictDoUpdate({ target: superintendents.districtId, set: { name } })
        .returning();
      
      return Response.json(updated, { status: 200 });
    } catch (e) {
      console.error(e);
      return Response.json({ error: "Failed to update superintendent" }, { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/superintendents",
};
