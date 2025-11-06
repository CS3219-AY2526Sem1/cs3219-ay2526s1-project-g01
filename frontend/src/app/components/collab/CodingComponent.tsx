//With reference to https://dev.to/akormous/building-a-shared-code-editor-using-nodejs-websocket-and-crdt-4l0f for binding editor to yjs
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
import { ChevronDown, CircleUser } from "lucide-react";
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
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { toast } from "sonner";

export default function CodingComponent({
  isOpen,
  closeDialog,
  openDialog,
  onLeave,
}: {
  isOpen: boolean;
  closeDialog: () => void;
  openDialog: () => void;
  onLeave: () => void;
}) {
  const { isConnected, setIsConnected } = useWebSocketContext();

  const [codeContent, setCodeContent] = useState<string>("");
  const [showDisconnectAlert, setshowDisconnectAlert] =
    useState<boolean>(false);
  const [selectedLanguage, setSeletedLanguage] = useState<string>("JavaScript");
  const router = useRouter();
  // const [editorInstance, setEditorInstance] =
  //   useState<monaco.editor.IStandaloneCodeEditor>();
  const { user } = useUser();
  const user_id: string = user?.id || "0";
  const user_name: string = user?.username || "Unknown";
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editorReady, setEditorReady] = useState(false);

  const ydocRef = useRef<Y.Doc | null>(null);
  const yTextRef = useRef<Y.Text | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  function setInitialContent(value: string | undefined) {
    if (value != undefined) {
      setCodeContent(value);
    }
  }

  function handleEditorMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    setEditorReady(true);
    console.log("test");
  }

  function handleEditorUnmount(
    userId: string,
    cursorCollections: Record<
      string,
      monaco.editor.IEditorDecorationsCollection
    >
  ) {
    const cursorDecorator: monaco.editor.IEditorDecorationsCollection =
      cursorCollections[userId];
    console.log("handleEditorUnmount called ");
    if (cursorDecorator) {
      cursorDecorator.clear();
      console.log("this shud not appear ");
    }
    delete cursorCollections[userId];
  }

  //Sets up local editor state, socket event listenr and syncrhonise editor state with backend ydoc version
  useEffect(() => {
    if (!editorReady || !isConnected || !editorRef.current) {
      return;
    }
    const editorInstance = editorRef.current;
    const clientWS: ReconnectingWebSocket = editorWebSocketManager.getSocket()!;
    let isOnline = true;
    openDialog();
    if (!ydocRef.current) {
      console.log("my ydoc is being resetted even without navigating away");
      const ydoc = new Y.Doc();
      const yText = ydoc.getText("monaco");
      const binding = new MonacoBinding(
        yText,
        editorInstance.getModel()!,
        new Set([editorInstance])
      );
      ydocRef.current = ydoc;
      yTextRef.current = yText;
      bindingRef.current = binding;
      isOnline = false;
    }

    const ydoc = ydocRef.current!;

    const cursorCollections: Record<
      string,
      monaco.editor.IEditorDecorationsCollection
    > = {};

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
      () => setIsConnected(false)
    );

    registerCursorUpdateHandler(
      user_id,
      editorInstance,
      cursorCollections,
      clientWS,
      user_name,
      isConnected
    );
    registerEditorUpdateHandler(ydoc, clientWS);

    //add cursor decorator
    initEditor(user_id, cursorCollections, editorInstance);

    //send initial editor state
    sendEditorState(user_id, ydoc, clientWS);

    setTimeout(() => {
      closeDialog();
      if (isOnline) {
        toast.success("You are back online!!!");
      }
    }, 2000);

    return () => {
      handleEditorUnmount(user_id, cursorCollections);
    };
  }, [editorReady, isConnected]);

  useEffect(() => {
    return () => {
      console.log("remove client binding and ydoc");

      bindingRef.current?.destroy();
      ydocRef.current?.destroy();
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
