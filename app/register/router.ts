import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const hashed = await hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      password: hashed,
    },
  });
  return NextResponse.json({ message: "User created" });
}