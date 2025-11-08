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
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
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

interface CodingComponentProps {
  ydoc: Y.Doc | null;
  isOpen: boolean;
  closeDialog: () => void;
  onLeave: () => void;
  onEditorMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onLanguageChange?: (language: string) => void;
}

export default function CodingComponent({
  ydoc,
  isOpen,
  closeDialog,
  onLeave,
  onEditorMount,
  onLanguageChange,
}: CodingComponentProps) {
  const [codeContent, setCodeContent] = useState<string>("");
  const [showDisconnectAlert, setshowDisconnectAlert] =
    useState<boolean>(false);
  const [selectedLanguage, setSeletedLanguage] = useState<string>("JavaScript");
  const router = useRouter();
  const [editorInstance, setEditorInstance] =
    useState<monaco.editor.IStandaloneCodeEditor>();
  const { user } = useUser();
  const user_id: string = user?.id || "0";
  const user_name: string = user?.username || "Unknown";

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

  //Sets up local editor state, socket event listener and synchronise editor state with backend ydoc version
  useEffect(() => {
    if (!editorInstance || !ydoc) {
      return;
    }

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
    const clientWS: ReconnectingWebSocket = editorWebSocketManager.getSocket()!;

    //set up message event listener on socket
    configureCollabWebsocket(
      user_id,
      ydoc,
      editorInstance,
      cursorCollections,
      clientWS,
      () => {
        router.replace("/match");
      },
      () => setshowDisconnectAlert(true),
    );

    registerCursorUpdateHandler(
      user_id,
      editorInstance,
      cursorCollections,
      clientWS,
      user_name,
    );

    registerEditorUpdateHandler(ydoc, clientWS);

    //add cursor decorator
    initEditor(user_id, cursorCollections, editorInstance);

    //send initial editor state
    sendEditorState(user_id, ydoc, clientWS);

    setTimeout(() => {
      closeDialog();
    }, 2000);

    return () => {
      console.log("remove client binding");
      handleEditorUnmount(user_id, cursorCollections);
      // Don't destroy ydoc here - it's managed by parent
      binding.destroy();
    };
  }, [editorInstance, ydoc]);

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
        <DisconnectAlertDialog
          open={showDisconnectAlert}
          onAccept={() => setshowDisconnectAlert(false)}
          onReject={() => onLeave()}
          buttonOneTitle="Continue"
          buttonTwoTitle="Leave"
          title="Your partner has disconnected"
          description="Do you want to continue working alone or exit the session? Note that if you disconnect or refresh the page, you will not be able to join back the session."
        />
      </div>
      <LoadingDialog
        open={isOpen}
        title={"Setting up editor...."}
        description={"Preparing your cursor!"}
      />
    </>
  );
}
