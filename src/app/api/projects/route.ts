import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  deadline: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let projects;
    if (user.role === "ADMIN") {
      projects = await prisma.project.findMany({
        include: {
          members: { select: { id: true, name: true, avatar: true } },
          _count: { select: { tasks: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          members: {
            some: { id: user.id },
          },
        },
        include: {
          members: { select: { id: true, name: true, avatar: true } },
          _count: { select: { tasks: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("GET /projects error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const result = createProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, description, deadline, memberIds } = result.data;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        createdById: user.id,
        members: {
          connect: [...(memberIds?.map((id) => ({ id })) || []), { id: user.id }],
        },
      },
      include: {
        members: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("POST /projects error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
