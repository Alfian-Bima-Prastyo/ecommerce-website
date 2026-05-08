import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { name, email, address, items, total } = body;

    if (!name || !email || !address || !items || items.length === 0) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ?? null,
        guestEmail: email,
        guestName: name,
        address,
        total,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            qty: item.qty,
            size: item.size,
            color: item.color,
          })),
        },
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}