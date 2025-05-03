import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener todas las tareas
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse(null, { status: 401 });

    const tasks = await prisma.task.findMany({
      where: { userId: Number(session.user.id) }
    });
    return NextResponse.json(tasks || []);
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

// POST: Crear nueva tarea
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse(null, { status: 401 });

    const { title } = await request.json();
    const task = await prisma.task.create({
      data: {
        title,
        userId: Number(session.user.id)
      }
    });
    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}