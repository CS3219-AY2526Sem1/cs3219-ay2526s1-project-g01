//With reference to https://www.geeksforgeeks.org/reactjs/how-to-fix-the-error-window-is-not-defined-in-nextjs/ in solving bug

/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: GPT 5.0), date: 2025-09-23
 * Purpose: To understand root cause of ReferenceError: window is not defined when CollabPage is being built by docker
 * Author Review: I validated correctness of the code and modified the solution based on online research
 */

/**
 * AI Assistance Disclosure:
 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2024-10-28
 * Purpose: Added props for editor instance and language change callbacks to support AI assistant integration
 * Author Review: Props interface and forwarding pattern validated
 */

/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-08
 * Purpose: Added ydoc prop to share Yjs document with chat component
 * Author Review: Props interface and forwarding validated
 */

"use client";

import dynamic from "next/dynamic";
import * as monaco from "monaco-editor";
import * as Y from "yjs";

const CodingComponent = dynamic(() => import("./CodingComponent"), {
  ssr: false,
});

interface CodingComponentWrapperProps {
  ydoc: Y.Doc | null;
  isOpen: boolean;
  closeDialog: () => void;
  openDialog: () => void;
  onLeave: () => void;
  onEditorMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onLanguageChange?: (language: string) => void;
}

export default function CodingComponentWrapper({
  ydoc,
  isOpen,
  closeDialog,
  openDialog,
  onLeave,
  onEditorMount,
  onLanguageChange,
}: CodingComponentWrapperProps) {
  return (
    <CodingComponent
      ydoc={ydoc}
      isOpen={isOpen}
      closeDialog={closeDialog}
      openDialog={openDialog}
      onLeave={onLeave}
      onEditorMount={onEditorMount}
      onLanguageChange={onLanguageChange}
    />
  );
}
