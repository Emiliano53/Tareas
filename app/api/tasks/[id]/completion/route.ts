import { NextResponse } from 'next/server';

// Obtener estado de completado
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Reemplaza esto con tu lógica real de base de datos
    const taskStatus = {
      id: params.id,
      completed: false // Valor por defecto
    };
    
    return NextResponse.json(taskStatus);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al cargar estado" },
      { status: 500 }
    );
  }
}

// Actualizar estado de completado
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { completed } = await request.json();
    
    // Reemplaza esto con tu lógica real de base de datos
    console.log(`Actualizando tarea ${params.id} a completed=${completed}`);
    
    return NextResponse.json({
      success: true,
      id: params.id,
      completed
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar estado" },
      { status: 500 }
    );
  }
}