// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // Validación de campos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Validación de longitud mínima de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe (insensible a mayúsculas)
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await hash(password, 12);

    // Crear nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(), // Normalizar email
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true
      }
    });

    return NextResponse.json(
      { 
        message: 'Usuario registrado exitosamente',
        user: newUser 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar el registro' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}