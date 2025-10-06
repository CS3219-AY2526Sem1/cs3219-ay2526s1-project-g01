"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SearchComponent() {
  const [searchStatus, setSearchStatus] = useState(false);

  function initializeSearch() {
    setSearchStatus(true);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-15 w-[80%] bg-black text-white" variant="outline">
          Start Searching
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[30%] flex flex-col items-center">
        <DialogHeader className="flex items-center">
          <DialogTitle>Searching for a match....</DialogTitle>
          <DialogDescription>Hold on tight .....</DialogDescription>
        </DialogHeader>
        <Spinner variant="circle-filled" />
      </DialogContent>
    </Dialog>
  );
}
