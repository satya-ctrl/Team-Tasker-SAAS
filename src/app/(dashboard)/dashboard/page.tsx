"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FolderKanban, CheckSquare, Clock, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardPage() {
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("/api/projects");
      return res.data.projects;
    },
  });

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("/api/tasks");
      return res.data.tasks;
    },
  });

  if (projectsLoading || tasksLoading) {
    return <div className="flex h-full items-center justify-center">Loading dashboard...</div>;
  }

  const projects = projectsData || [];
  const tasks = tasksData || [];

  const completedTasks = tasks.filter((t: any) => t.status === "COMPLETED").length;
  const inProgressTasks = tasks.filter((t: any) => t.status === "IN_PROGRESS").length;
  const overdueTasks = tasks.filter((t: any) => {
    if (t.status === "COMPLETED" || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const chartData = [
    { name: "To Do", count: tasks.filter((t: any) => t.status === "TODO").length },
    { name: "In Progress", count: inProgressTasks },
    { name: "Completed", count: completedTasks },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress Tasks</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.slice(0, 5).map((task: any) => (
                <div key={task.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.project.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded text-[10px] font-medium uppercase ${
                      task.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                      task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {task.status.replace("_", " ")}
                    </div>
                    {task.assignedTo && (
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700">
                          {task.assignedTo.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No tasks found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
