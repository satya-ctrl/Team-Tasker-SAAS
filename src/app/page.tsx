import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 py-4 flex justify-between items-center bg-white shadow-sm border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-lg flex items-center justify-center shadow-lg">
            <Layers className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">TeamTasker</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-3xl">
          Manage your team&apos;s work, <br />
          <span className="text-blue-600">all in one place.</span>
        </h2>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl">
          TeamTasker is a modern, collaborative task management platform designed to help your team stay organized, focused, and productive.
        </p>
        <div className="flex gap-4">
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8 text-lg">Start for free</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">See how it works</Button>
          </Link>
        </div>

        <div className="mt-20 w-full max-w-5xl rounded-xl border bg-white shadow-2xl overflow-hidden">
          <div className="h-12 border-b bg-slate-50 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="h-[400px] bg-slate-100 flex items-center justify-center">
            <p className="text-slate-400 font-medium">Dashboard Preview</p>
          </div>
        </div>
      </main>
    </div>
  );
}
