//With reference to https://dev.to/akormous/building-a-shared-code-editor-using-nodejs-websocket-and-crdt-4l0f for binding editor to yjs
/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: GPT 5.0), date: 2025-11-07
 * Purpose: To understand why there is a ydoc sync issue when a new line is entered between users with different operating systems.
 * Author Review: I validated correctness of the explanation provided and the necessary fix

 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2024-10-28
 * Purpose: Added props interface and callbacks to expose editor instance and language for AI assistant
 * Author Review: Callback integration and useEffect dependencies validated
 */

/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-08
 * Purpose: Modified to accept shared Yjs document instead of creating new one
 * Author Review: Yjs document sharing and binding validated
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
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useConnectionContext } from "@/contexts/ConnectionContext";
import { useRouter } from "next/navigation";
import ReconnectingWebSocket from "reconnecting-websocket";
import DisconnectAlertDialog from "@/components/ui/alert-dialog";
import { editorWebSocketManager } from "@/services/editorSocketManager";
import LoadingDialog from "@/components/ui/loading-dialog";
import {
  configureCollabWebsocket,
  initEditor,
  sendEditorState,
  registerCursorUpdateHandler,
  registerEditorUpdateHandler,
} from "@/services/editorSyncHandlers";
import { toast } from "sonner";

interface CodingComponentProps {
  ydoc: Y.Doc | null;
  isOpen: boolean;
  closeDialog: () => void;
  openDialog: () => void;
  onLeave: () => void;
  onEditorMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onLanguageChange?: (language: string) => void;
}

export default function CodingComponent({
  ydoc,
  isOpen,
  closeDialog,
  openDialog,
  onLeave,
  onEditorMount,
  onLanguageChange,
}: CodingComponentProps) {
  const [codeContent, setCodeContent] = useState<string>("");
  const [selectedLanguage, setSeletedLanguage] = useState<string>("JavaScript");
  const router = useRouter();

  const { user } = useUser();
  const user_id: string = user?.id || "0";
  const user_name: string = user?.username || "Unknown";
  const { isConnected, setIsConnected } = useConnectionContext();

  const yTextRef = useRef<Y.Text | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const cursorCollectionsRef = useRef<Record<
    string,
    monaco.editor.IEditorDecorationsCollection
  > | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const isInitialConnectionRef = useRef(true);

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
    editorRef.current = editor;
    setEditorReady(true);
    // Notify parent component
    if (onEditorMount) {
      onEditorMount(editor);
    }
  }

  function handleEditorUnmount(
    userId: string,
    cursorCollections: Record<
      string,
      monaco.editor.IEditorDecorationsCollection
    >,
  ) {
    const cursorDecorator: monaco.editor.IEditorDecorationsCollection =
      cursorCollections[userId];
    if (cursorDecorator) {
      cursorDecorator.clear();
    }
    delete cursorCollections[userId];
  }

  // Sets up local editor state, socket event listener and synchronise editor state with backend ydoc version
  // This useEffect runs again when user connects to wifi after losing internet connection
  useEffect(() => {
    if (!editorReady || !isConnected || !editorRef.current || !ydoc) {
      return;
    }

    const editorInstance = editorRef.current;
    const isOnline = !isInitialConnectionRef.current;
    openDialog();

    // On initial connection, set up variables
    if (
      !yTextRef.current ||
      !bindingRef.current ||
      !cursorCollectionsRef.current
    ) {
      const yText = ydoc.getText("monaco");
      editorInstance.getModel()?.setEOL(monaco.editor.EndOfLineSequence.LF);
      const binding = new MonacoBinding(
        yText,
        editorInstance.getModel()!,
        new Set([editorInstance]),
      );
      const cursorCollections: Record<
        string,
        monaco.editor.IEditorDecorationsCollection
      > = {};

      yTextRef.current = yText;
      bindingRef.current = binding;
      cursorCollectionsRef.current = cursorCollections;
      isInitialConnectionRef.current = false;
    }

    const clientWS: ReconnectingWebSocket = editorWebSocketManager.getSocket()!;
    const cursorCollections: Record<
      string,
      monaco.editor.IEditorDecorationsCollection
    > = cursorCollectionsRef.current;

    handleEditorUnmount(user_id, cursorCollections);

    // Set up message event listener on socket
    configureCollabWebsocket(
      user_id,
      ydoc,
      editorInstance,
      cursorCollections,
      clientWS,
      () => {
        router.replace("/match");
      },
      () => setIsConnected(false),
    );

    registerCursorUpdateHandler(
      user_id,
      editorInstance,
      cursorCollections,
      clientWS,
      user_name,
    );

    registerEditorUpdateHandler(ydoc, clientWS);

    // Add cursor decorator
    initEditor(user_id, cursorCollections, editorInstance);

    // Send initial editor state
    sendEditorState(user_id, ydoc, clientWS);

    setTimeout(() => {
      closeDialog();
      if (isOnline) {
        toast.success("You are back online!!!");
      }
    }, 5000);

    return () => {
      handleEditorUnmount(user_id, cursorCollections);
    };
  }, [editorReady, isConnected, ydoc]);

  // Clean up binding only (ydoc is managed by parent)
  useEffect(() => {
    return () => {
      console.log("remove client binding");
      bindingRef.current?.destroy();
      bindingRef.current = null;
      yTextRef.current = null;
      cursorCollectionsRef.current = null;
    };
  }, []);

  return (
    <>
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
                <DropdownMenuItem
                  onClick={() => setSeletedLanguage("Pseudo Code")}
                >
                  Pseudo Code
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
      <LoadingDialog
        open={isOpen}
        title={"Setting up editor...."}
        description={"Preparing your cursor!"}
      />
    </>
  );
}
