import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener una tarea específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse(null, { status: 401 });

    const task = await prisma.task.findUnique({
      where: { 
        id: Number(params.id),
        userId: Number(session.user.id) 
      }
    });

    if (!task) return new NextResponse(null, { status: 404 });

    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

// PUT: Actualizar tarea
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse(null, { status: 401 });

    const { title, completed } = await request.json();
    const task = await prisma.task.update({
      where: { 
        id: Number(params.id),
        userId: Number(session.user.id) 
      },
      data: { title, completed },
    });
    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

// DELETE: Eliminar tarea
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse(null, { status: 401 });

    await prisma.task.delete({
      where: { 
        id: Number(params.id),
        userId: Number(session.user.id) 
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}