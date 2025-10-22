/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT(model: GPT 5.0), date: 2025-10-22
 * Purpose: To create a dialog box using radix-ui
 * Author Review: I validated correctness and performance of the code suggested and modified areas such as
 * TailWindCSS style classes for a more aesthetic look.
 */

"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";

interface DisconnectAlertDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function DisconnectAlertDialog({
  open,
  onClose,
}: DisconnectAlertDialogProps) {
  const router = useRouter();

  return (
    <AlertDialog.Root open={open} onOpenChange={onClose}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
        <AlertDialog.Content
          className="fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 
          rounded-2xl bg-white p-6 shadow-lg"
        >
          <AlertDialog.Title className="text-lg font-semibold text-gray-900">
            Your partner has disconnected
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-gray-600">
            Do you want to continue working alone or leave the session?
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button
                onClick={onClose}
                className="w-24 px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Continue
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={() => router.replace("/match")}
                className="w-24 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Leave
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
