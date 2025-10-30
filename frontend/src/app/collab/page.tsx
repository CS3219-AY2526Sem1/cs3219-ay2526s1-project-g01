/**
 * AI Assistance Disclosure:
 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2024-10-28
 * Purpose: Enhanced collab page with toggle between peer chat and AI assistant panel
 * Author Review: State management and component integration validated
 */

"use client";
import { useState } from "react";
import ChatComponent from "../components/collab/ChatComponent";
import CodingComponentWrapper from "../components/collab/CodingComponentWrapper";
import QuestionComponent from "../components/collab/QuestionComponent";
import SessionHeader from "../components/collab/SessionHeader";
import AiAssistPanel from "../components/collab/AiAssistPanel";
import * as monaco from "monaco-editor";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles } from "lucide-react";

export default function CollabPage() {
  const [showAiAssist, setShowAiAssist] = useState(false);
  const [editorInstance, setEditorInstance] =
    useState<monaco.editor.IStandaloneCodeEditor>();
  const [language, setLanguage] = useState<string>("javascript");

  return (
    <main className="bg-stone-900 h-screen flex flex-col items-center">
      <SessionHeader />

      <div className="flex flex-1 w-full bg-black ">
        <div className="flex-1 p-5">
          <QuestionComponent />
        </div>

        <div className="flex-[2]">
          <CodingComponentWrapper
            onEditorMount={setEditorInstance}
            onLanguageChange={setLanguage}
          />
        </div>

        <div className="flex-1 p-5 min-h-0 overflow-hidden">
          {/* Toggle between Chat and AI Assist */}
          <div className="h-full min-h-0 flex flex-col">
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-4">
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
                <AiAssistPanel
                  editorInstance={editorInstance}
                  language={language}
                />
              ) : (
                <ChatComponent />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
