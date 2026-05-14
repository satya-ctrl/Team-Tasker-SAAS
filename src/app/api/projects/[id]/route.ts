import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const updateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  deadline: z.string().nullable().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
  memberIds: z.array(z.string()).optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = updateProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, description, deadline, status, memberIds } = result.data;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (deadline !== undefined) data.deadline = deadline ? new Date(deadline) : null;
    if (status !== undefined) data.status = status;
    if (memberIds !== undefined) {
      data.members = {
        set: memberIds.map((memberId) => ({ id: memberId })),
      };
    }

    const project = await prisma.project.update({
      where: { id },
      data,
      include: {
        members: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("PUT /projects/:id error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /projects/:id error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
