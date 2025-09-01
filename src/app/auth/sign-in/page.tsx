"use client";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm" htmlFor="email">Email</label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm" htmlFor="password">Password</label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="secondary" asChild>
          <Link href="/auth/sign-up">Create account</Link>
        </Button>
        <Button disabled={loading} onClick={() => setLoading(true)}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </CardFooter>
    </Card>
  );
}
