"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupForm() {
  function NavigateToLogin() {
    window.location.href = "/auth/login";
  }

  return (
    <Card className="min-h-[50%] min-w-[40%]">
      <CardHeader className="mt-5">
        <CardTitle className="text-center text-4xl font-bold">
          Register an account
        </CardTitle>
      </CardHeader>

      <CardContent className="px-15 pt-10">
        <form>
          <div className="flex flex-col gap-4">
            <div>
              <Label className="m-2">Email</Label>
              <Input name="email" type="email" required></Input>
            </div>
            <div>
              <Label className="m-2">Password</Label>
              <Input name="password" type="password" required></Input>
            </div>

            <div className="flex justify-center ">
              <Button className="w-full">Register</Button>
            </div>

            <div>
              <Button onClick={() => NavigateToLogin()}>Back</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
