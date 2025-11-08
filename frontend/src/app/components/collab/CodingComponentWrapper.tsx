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
  onLeave: () => void;
  onEditorMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onLanguageChange?: (language: string) => void;
}

export default function CodingComponentWrapper({
  ydoc,
  isOpen,
  closeDialog,
  onLeave,
  onEditorMount,
  onLanguageChange,
}: CodingComponentWrapperProps) {
  return (
    <CodingComponent
      ydoc={ydoc}
      isOpen={isOpen}
      closeDialog={closeDialog}
      onLeave={onLeave}
      onEditorMount={onEditorMount}
      onLanguageChange={onLanguageChange}
    />
  );
}
