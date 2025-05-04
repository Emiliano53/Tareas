// app/api/tasks/[id]/completion/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Solución: Usar Response nativo en lugar de NextResponse
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {  // <-- Cambio crucial aquí
  try {
    const taskId = parseInt(params.id);
    
    if (isNaN(taskId)) {
      return new Response(
        JSON.stringify({ error: "ID inválido" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { completed: true }
    });

    if (!task) {
      return new Response(
        JSON.stringify({ error: "Tarea no encontrada" }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ completed: task.completed }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en API route:', error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}