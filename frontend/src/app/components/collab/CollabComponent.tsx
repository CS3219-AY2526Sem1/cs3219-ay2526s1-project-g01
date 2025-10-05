"use client";

import ChatComponent from "./ChatComponent";
import QuestionComponent from "./QuestionComponent";
import SessionHeader from "./SessionHeader";
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
import socketCommunication from "./SocketConnection";

export default function CollabPage() {
    const [selectedLanguage, setSeletedLanguage] = useState<string>("JavaScript");
    const [chatMessages, setChatMessages] = useState<string[]>([]);

    const [editorInstance, setEditorInstance] =
        useState<monaco.editor.IStandaloneCodeEditor>();

    const user_id = String(Math.floor(Math.random() * 10000));
    const session_id = "123"; //HARDCODED FOR TESTING

    function handleEditorMount(editor: monaco.editor.IStandaloneCodeEditor) {
        setEditorInstance(editor);
    }

    useEffect(() => {
        if (!editorInstance) {
            return;
        }
        const ydoc: Y.Doc = new Y.Doc();
        const yText: Y.Text = ydoc.getText("monaco");
        const yArray: Y.Array<string> = ydoc.getArray("chat");
        const binding: MonacoBinding = new MonacoBinding(
            yText,
            editorInstance.getModel()!,
            new Set([editorInstance]),
        );

        const clientWS: WebSocket = socketCommunication(user_id, session_id, ydoc);
        return () => {
            console.log("remove client websocket, binding and ydoc");
            clientWS.close();
            ydoc.destroy();
            binding.destroy();
        };
    }, [editorInstance]);

    return (
        <main className="bg-stone-900 h-screen flex flex-col items-center">
            <SessionHeader />

            <div className="flex flex-1 w-full bg-stone-800 ">
                <div className="flex-1 p-5">
                    <QuestionComponent />
                </div>

                <div className="flex-[2]">
                    {/* <CodingComponentWrapper /> */}
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
                                        <DropdownMenuItem
                                            onClick={() => setSeletedLanguage("Python")}
                                        >
                                            Python
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSeletedLanguage("C")}>
                                            C
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSeletedLanguage("C++")}>
                                            C++
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setSeletedLanguage("Java")}
                                        >
                                            Java
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className="flex justify-center items-center">
                                <div className="text-white mr-3">derrickwong8909@gmail.com</div>
                                <CircleUser className="text-white mr-2" size="25" />
                            </div>
                        </div>

                        <Editor
                            height="85vh"
                            theme="vs-dark"
                            language={selectedLanguage.toLowerCase()}
                            options={{ scrollBeyondLastLine: false }}
                            onMount={handleEditorMount}
                        ></Editor>
                    </div>
                </div>

                <div className="flex-1 p-5">
                    <ChatComponent
                        messages={chatMessages}
                        onSend={(msg: string) => {
                            // Push new message to Y.Array
                            console.log("Sending message: ", msg);
                        }}
                    />
                </div>
            </div>
        </main>
    );
}
