"use client";

import Editor from "@monaco-editor/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, CircleUser } from "lucide-react";

export default function CodingComponent() {
  const [codeContent, setCodeContent] = useState<string>("");
  const [selectedLanguage, setSeletedLanguage] = useState<string>("JavaScript");

  function setInitialContent(value: string | undefined) {
    if (value != undefined) {
      setCodeContent(value);
    }
  }

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
        <div className="flex justify-center items-center">
          <div className="text-white mr-3">derrickwong8909@gmail.com</div>
          <CircleUser className="text-white mr-2" size="25" />
        </div>
      </div>
      <Editor
        height="85vh"
        theme="vs-dark"
        language={selectedLanguage.toLowerCase()}
        onChange={(value) => setInitialContent(value)}
        options={{ scrollBeyondLastLine: false }}
      ></Editor>
    </div>
  );
}
