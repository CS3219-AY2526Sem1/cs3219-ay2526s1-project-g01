"use client";

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const { user } = useUser();
  const router = useRouter();

  function directToMatch() {
    router.push("/match");
  }

  return (
    <Card className="m-10 h-[20%]">
      <CardHeader>
        <CardTitle className="text-4xl flex">
          Hello
          <p className="ml-2 font-bold">{user?.username || "Guest"}</p>
        </CardTitle>
        <CardTitle className="text-4xl flex">Ready to start coding?</CardTitle>
      </CardHeader>

      <CardContent>
        <Button
          className="w-30 bg-white border-black text-black border-2 border-black"
          onClick={() => directToMatch()}
        >
          Start
        </Button>
      </CardContent>
    </Card>
  );
}
