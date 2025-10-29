//With reference to https://dev.to/akormous/building-a-shared-code-editor-using-nodejs-websocket-and-crdt-4l0f for binding editor to yjs

/**
 * AI Assistance Disclosure:
 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2024-10-28
 * Purpose: Added props interface and callbacks to expose editor instance and language for AI assistant
 * Author Review: Callback integration and useEffect dependencies validated
 */
"use client";
import * as Y from "yjs";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, CircleUser } from "lucide-react";
import {
  initialiseCollabWebsocket,
  registerCursorUpdateHandler,
  registerEditorUpdateHandler,
} from "./CollabWebSocket";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

interface CodingComponentProps {
  onEditorMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onLanguageChange?: (language: string) => void;
}

export default function CodingComponent({
  onEditorMount,
  onLanguageChange,
}: CodingComponentProps) {
  const [codeContent, setCodeContent] = useState<string>("");
  const [selectedLanguage, setSeletedLanguage] = useState<string>("JavaScript");
  const router = useRouter();
  const [editorInstance, setEditorInstance] =
    useState<monaco.editor.IStandaloneCodeEditor>();
  const { user } = useUser();
  const user_id: string = user?.username || "1";

  const session_id = "123"; //HARDCODED FOR TESTING

  // Notify parent when language changes
  useEffect(() => {
    if (onLanguageChange) {
      onLanguageChange(selectedLanguage);
    }
  }, [selectedLanguage, onLanguageChange]);

  function setInitialContent(value: string | undefined) {
    if (value != undefined) {
      setCodeContent(value);
    }
  }

  function handleEditorMount(editor: monaco.editor.IStandaloneCodeEditor) {
    setEditorInstance(editor);
    // Notify parent component
    if (onEditorMount) {
      onEditorMount(editor);
    }
  }

  useEffect(() => {
    if (!editorInstance) {
      return;
    }
    const ydoc: Y.Doc = new Y.Doc();
    const yText: Y.Text = ydoc.getText("monaco");
    const binding: MonacoBinding = new MonacoBinding(
      yText,
      editorInstance.getModel()!,
      new Set([editorInstance]),
    );

    const cursorCollections: Record<
      string,
      monaco.editor.IEditorDecorationsCollection
    > = {};
    const clientWS: WebSocket = initialiseCollabWebsocket(
      user_id,
      session_id,
      ydoc,
      editorInstance,
      cursorCollections,
      () => {
        router.replace("/match");
      },
    );
    registerCursorUpdateHandler(
      user_id,
      editorInstance,
      cursorCollections,
      clientWS,
    );
    registerEditorUpdateHandler(ydoc, clientWS);

    return () => {
      console.log("remove client websocket, binding and ydoc");
      clientWS.close();
      ydoc.destroy();
      binding.destroy();
    };
  }, [editorInstance]);

  return (
    <div className="mt-5">
      <div className="flex justify-between mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex justify-between">
            <Button className="w-40 bg-white text-black hover:bg-gray-500">
              {selectedLanguage} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-10" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => setSeletedLanguage("JavaScript")}
              >
                Javascript
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeletedLanguage("Python")}>
                Python
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeletedLanguage("C")}>
                C
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeletedLanguage("C++")}>
                C++
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeletedLanguage("Java")}>
                Java
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Editor
        height="85vh"
        theme="vs-dark"
        language={selectedLanguage.toLowerCase()}
        onChange={(value) => setInitialContent(value)}
        options={{ scrollBeyondLastLine: false }}
        onMount={handleEditorMount}
      ></Editor>
    </div>
  );
}
