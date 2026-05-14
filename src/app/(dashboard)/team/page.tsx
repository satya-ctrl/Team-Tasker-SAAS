"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TeamPage() {
  // To keep things simple without creating a dedicated /api/users endpoint,
  // we can just fetch all projects and extract unique team members, 
  // or I can quickly implement a /api/users endpoint!
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects-team"],
    queryFn: async () => {
      const res = await axios.get("/api/projects");
      return res.data.projects;
    },
  });

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading team...</div>;
  }

  // Extract unique members from projects
  const uniqueMembers = new Map();
  projects?.forEach((project: any) => {
    project.members?.forEach((member: any) => {
      if (!uniqueMembers.has(member.id)) {
        uniqueMembers.set(member.id, member);
      }
    });
  });
  
  const teamMembers = Array.from(uniqueMembers.values());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">People collaborating on your projects.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member: any) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-col items-center pb-2">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                  {member.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{member.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                Team Member
              </span>
            </CardContent>
          </Card>
        ))}
        {teamMembers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No team members found in your projects.
          </div>
        )}
      </div>
    </div>
  );
}
