"use client";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewPollPage() {
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [saving, setSaving] = useState(false);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a new poll</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm" htmlFor="question">Question</label>
            <Input id="question" placeholder="What's your question?" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Options</span>
              <Button
                variant="secondary"
                onClick={() => setOptions((o) => [...o, ""])}
                disabled={options.length >= 10}
              >
                Add option
              </Button>
            </div>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input placeholder={`Option ${idx + 1}`} value={opt} onChange={(e) => {
                    const v = e.target.value;
                    setOptions((prev) => prev.map((p, i) => (i === idx ? v : p)));
                  }} />
                  <Button
                    variant="ghost"
                    onClick={() => setOptions((prev) => prev.filter((_, i) => i !== idx))}
                    disabled={options.length <= 2}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="ghost" asChild>
            <Link href="/polls">Cancel</Link>
          </Button>
          <Button disabled={saving} onClick={() => setSaving(true)}>
            {saving ? "Creating…" : "Create poll"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
