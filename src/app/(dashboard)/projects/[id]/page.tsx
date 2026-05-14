"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ArrowLeft, UserPlus, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const projectId = params.id as string;

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      // Since we don't have a specific GET /api/projects/:id endpoint, 
      // we can fetch all and find, OR just create one. 
      // Wait, let's just fetch all projects and filter for now to save time
      const res = await axios.get("/api/projects");
      return res.data.projects.find((p: any) => p.id === projectId);
    },
  });

  const { data: tasks } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const res = await axios.get("/api/tasks");
      return res.data.tasks.filter((t: any) => t.projectId === projectId);
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (emailStr: string) => {
      return axios.post(`/api/projects/${projectId}/members`, { email: emailStr });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      setEmail("");
      setError("");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to invite member");
    }
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    inviteMutation.mutate(email);
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Button onClick={() => router.push("/projects")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/projects")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
            <p className="text-muted-foreground">{project.description || "No description provided."}</p>
          </div>
        </div>
        <Badge variant={
          project.status === "COMPLETED" ? "default" :
          project.status === "IN_PROGRESS" ? "secondary" : "outline"
        } className="text-sm px-3 py-1">
          {project.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks && tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-slate-500">{task.description}</p>
                      </div>
                      <Badge>{task.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">No tasks found for this project.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite to Project</DialogTitle>
                    <DialogDescription>
                      Enter the email address of the person you want to invite to this project. They must already have an account.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInvite} className="space-y-4 pt-4">
                    {error && <div className="p-3 bg-red-100 text-red-600 text-sm rounded-md">{error}</div>}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="colleague@example.com" 
                          className="pl-9"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={inviteMutation.isPending}>
                      {inviteMutation.isPending ? "Inviting..." : "Send Invite"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.members?.map((member: any) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email || "Member"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {project.deadline && (
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Deadline</span>
                    <span className="font-medium">{format(new Date(project.deadline), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
