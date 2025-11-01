/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT(model: GPT 5.0), date: 2025-10-22
 * Purpose: To create a dialog box using radix-ui
 * Author Review: I validated correctness and performance of the code suggested and modified areas such as
 * TailWindCSS style classes for a more aesthetic look. I modified the component to make it reusable
 */

"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";

interface DisconnectAlertDialogProps {
  open: boolean;
  onAccept: () => void;
  onReject: () => void;
  buttonOneTitle: string;
  buttonTwoTitle: string;
  title: string;
  description: string;
}

export default function DisconnectAlertDialog({
  open,
  onAccept,
  onReject,
  buttonOneTitle,
  buttonTwoTitle,
  title,
  description,
}: DisconnectAlertDialogProps) {
  const router = useRouter();

  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
        <AlertDialog.Content
          className="fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 
          rounded-2xl bg-white p-6 shadow-lg"
        >
          <AlertDialog.Title className="text-lg font-semibold text-gray-900">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-gray-600">
            {description}
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button
                onClick={onAccept}
                className="w-24 px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                {buttonOneTitle}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={onReject}
                className="w-24 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                {buttonTwoTitle}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
