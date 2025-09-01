import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Poll #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            This is a placeholder for the poll detail and voting UI.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
