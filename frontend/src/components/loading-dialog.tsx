/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT(model: GPT 5.0), date: 2025-10-29
 * Purpose: To create a loading dialog box using radix-ui
 * Author Review: I validated correctness and performance of the code suggested and modified areas such as
 * TailWindCSS style classes for a more aesthetic look.
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface SessionCreatingDialogProps {
  open: boolean;
}

export default function SessionCreatingDialog({
  open,
}: SessionCreatingDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="
          w-[40%]
          flex
          flex-col
          items-center
          justify-center
          bg-stone-800
          rounded-2xl
          border-black
          py-10
          text-center
        "
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader className="text-white mb-6">
          <DialogTitle className="text-xl font-semibold">
            Creating your session...
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Please wait while we connect you and your partner.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <p className="text-sm text-gray-300">
            This usually takes just a few seconds.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
