import { PrismaClient } from "@prisma/client";

export async function GET() {
  try {
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany();
    return Response.json({ ok: true, count: users.length });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}