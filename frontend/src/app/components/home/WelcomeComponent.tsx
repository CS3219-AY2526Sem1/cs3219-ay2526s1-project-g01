"use client";

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  function directToHome() {
    window.location.href = "/match";
  }

  return (
    <Card className="m-10 h-[20%]">
      <CardHeader>
        <CardTitle className="text-4xl flex">
          Hello
          <p className="ml-2 font-bold">Derrick Wong</p>
        </CardTitle>
        <CardTitle className="text-4xl flex">Ready to start coding?</CardTitle>
      </CardHeader>

      <CardContent>
        <Button
          className="w-30 bg-white border-black text-black border-2 border-black"
          onClick={() => directToHome()}
        >
          Start
        </Button>
      </CardContent>
    </Card>
  );
}
