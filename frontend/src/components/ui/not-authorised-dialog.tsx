/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT(model: GPT 5.0), date: 2025-11-01
 * Purpose: To create a not authorised notifcation dialog box using radix-ui
 * Author Review: I validated correctness and performance of the code suggested and modified areas such as
 * TailWindCSS style classes for a more aesthetic look. I also modified the code to make it reusable
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NotAuthorizedDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonName: string;
}

export default function NotAuthorizedDialog({
  open,
  onClose,
  title,
  description,
  buttonName,
}: NotAuthorizedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-600">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onClose} variant="default">
              {buttonName}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
