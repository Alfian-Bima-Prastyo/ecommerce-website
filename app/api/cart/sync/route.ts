import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { items } = await req.json();

  await prisma.cartItem.deleteMany({ where: { userId: user.id } });

  if (items.length > 0) {
    await prisma.cartItem.createMany({
      data: items.map((item: any) => ({
        userId: user.id,
        productId: item.product_id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        size: item.size,
        color: item.color,
      })),
    });
  }

  return NextResponse.json({ ok: true });
}