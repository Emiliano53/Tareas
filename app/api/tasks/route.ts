import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { title } = await req.json();

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        user: {
          connect: { email: session.user.email },
        },
      },
    });

    console.log("Tarea creada:", task);
    return NextResponse.json(task);
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { user: { email: session.user.email } },
    });

    console.log("Tareas obtenidas:", tasks);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}