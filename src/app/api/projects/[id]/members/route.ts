import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const addMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    // Check if project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = addMemberSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Find the user to add
    const userToAdd = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToAdd) {
      return NextResponse.json(
        { message: "No user found with that email address" },
        { status: 404 }
      );
    }

    // Check if already a member
    if (project.members.some((m) => m.id === userToAdd.id)) {
      return NextResponse.json(
        { message: "User is already a member of this project" },
        { status: 400 }
      );
    }

    // Add user to project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        members: {
          connect: { id: userToAdd.id },
        },
      },
      include: {
        members: { select: { id: true, name: true, avatar: true, email: true } },
      },
    });

    return NextResponse.json(
      { message: "Member added successfully", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /projects/:id/members error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
