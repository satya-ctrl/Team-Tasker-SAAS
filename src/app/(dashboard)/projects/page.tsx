"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users, Calendar, FolderKanban } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProjectsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("/api/projects");
      return res.data.projects;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newProject: any) => {
      return axios.post("/api/projects", newProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      setTitle("");
      setDescription("");
      setDeadline("");
    },
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createMutation.mutate({
      title,
      description,
      deadline: deadline || undefined,
    });
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your team&apos;s projects and tasks.</p>
        </div>
        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            } />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Enter the details for your new project.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project: any) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    project.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                    project.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {project.status.replace("_", " ")}
                  </span>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {project.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4 flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{project.members.length} members</span>
                </div>
                {project.deadline && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(project.deadline), "MMM d, yyyy")}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
        {projects?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-500 bg-white border border-dashed rounded-lg">
            <FolderKanban className="h-12 w-12 mb-4 text-slate-300" />
            <p className="text-lg font-medium">No projects found</p>
            {isAdmin && <p className="text-sm">Create a new project to get started.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
