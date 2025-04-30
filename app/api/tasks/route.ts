// filepath: c:\Users\Emiliano\task-manager\app\api\tasks\route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { title } = await req.json();

  const task = await prisma.task.create({
    data: {
      title,
      user: {
        connect: { email: session.user.email },
      },
    },
  });
  return NextResponse.json(task);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: { user: { email: session.user.email } },
  });
  return NextResponse.json(tasks);
}