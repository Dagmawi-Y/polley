import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PollsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Polls</h1>
        <Link className="text-sm underline" href="/polls/new">Create new</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1,2,3].map((id) => (
          <Link key={id} href={`/polls/${id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Poll #{id}</CardTitle>
                <CardDescription>Short description of the poll.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">0 votes • 3 options</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
