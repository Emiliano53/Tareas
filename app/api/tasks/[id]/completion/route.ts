import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Convertir el ID de string a número
    const taskId = parseInt(params.id);
    
    // Validar que sea un número válido
    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: "ID debe ser un número" },
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId }, // Usar el número convertido
      select: { 
        completed: true,
        userId: true // Importante para validar permisos
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 }
      );
    }

    // Verificación adicional de seguridad (opcional)
    // const session = await getSession();
    // if (task.userId !== session.user.id) {
    //   return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    // }

    return NextResponse.json({ completed: task.completed });
  } catch (error) {
    console.error('Error en API route:', error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}