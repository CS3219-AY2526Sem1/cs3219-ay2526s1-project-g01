/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-08
 * Purpose: Added ydoc prop to pass to ChatComponent
 * Author Review: Props forwarding validated
 */

"use client";

import { useState } from "react";
import ChatComponent from "./ChatComponent";
import AiAssistPanel from "./AiAssistPanel";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles } from "lucide-react";
import * as monaco from "monaco-editor";
import * as Y from "yjs";

interface ChatPanelWrapperProps {
  ydoc: Y.Doc | null;
  editorInstance?: monaco.editor.IStandaloneCodeEditor;
  language: string;
}

export default function ChatPanelWrapper({
  ydoc,
  editorInstance,
  language,
}: ChatPanelWrapperProps) {
  const [showAiAssist, setShowAiAssist] = useState(false);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-4 flex-shrink-0">
        <Button
          onClick={() => setShowAiAssist(false)}
          className={`flex-1 ${
            !showAiAssist
              ? "bg-purple-600 text-white"
              : "bg-stone-800 text-stone-300 hover:bg-stone-700"
          }`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat
        </Button>
        <Button
          onClick={() => setShowAiAssist(true)}
          className={`flex-1 ${
            showAiAssist
              ? "bg-purple-600 text-white"
              : "bg-stone-800 text-stone-300 hover:bg-stone-700"
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Assist
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {showAiAssist ? (
          <AiAssistPanel editorInstance={editorInstance} language={language} />
        ) : (
          <ChatComponent ydoc={ydoc} />
        )}
      </div>
    </div>
  );
}
