/**
 * AI Assistance Disclosure:
 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2024-10-28
 * Purpose: React component for AI assistant chat interface with markdown rendering and code context
 * Author Review: UI/UX patterns validated, accessibility features reviewed
 */

"use client";
import { useState, useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import { sendAiChatMessage, ChatMessage } from "@/services/aiServiceApi";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Sparkles, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AiAssistPanelProps {
  editorInstance?: monaco.editor.IStandaloneCodeEditor;
  language?: string;
}

export default function AiAssistPanel({
  editorInstance,
  language = "javascript",
}: AiAssistPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message to chat
    const newUserMessage: ChatMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Get current code from editor (if available)
      const code = editorInstance?.getValue() || "";

      // Send to AI service
      const response = await sendAiChatMessage({
        code: code,
        language: language,
        message: userMessage,
        conversationHistory: messages,
      });

      if (response.success && response.data) {
        // Add AI response to chat
        const aiMessage: ChatMessage = {
          role: "assistant",
          content: response.data.response,
          timestamp: response.data.timestamp,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Add error message
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: `Sorry, I encountered an error: ${response.error}`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-stone-900">
      {/* Header */}
      <div className="p-4 border-b border-stone-700 flex items-center gap-2 flex-shrink-0">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-stone-400 text-center px-4">
            <Sparkles className="w-12 h-12 mb-4 text-purple-400" />
            <p className="text-lg font-medium mb-2">AI Code Assistant</p>
            <p className="text-sm">
              Ask me anything about your code! I can help you:
            </p>
            <ul className="text-sm mt-2 space-y-1 text-left">
              <li>• Explain what your code does</li>
              <li>• Debug issues and suggest fixes</li>
              <li>• Optimize your solution</li>
              <li>• Understand algorithms</li>
            </ul>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-stone-800 text-stone-100"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="relative group">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          code(props) {
                            const { children, className, ...rest } = props;
                            const match = /language-(\w+)/.exec(
                              className || "",
                            );
                            return match ? (
                              <code
                                className="block bg-stone-900 p-2 rounded overflow-x-auto"
                                {...rest}
                              >
                                {children}
                              </code>
                            ) : (
                              <code
                                className="bg-stone-900 px-1 py-0.5 rounded text-purple-300"
                                {...rest}
                              >
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                    <button
                      onClick={() => copyToClipboard(msg.content, index)}
                      className="absolute top-1 right-1 p-1 rounded bg-stone-700 hover:bg-stone-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy response"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-stone-300" />
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
                <p className="text-xs mt-1 opacity-60">
                  {new Date(msg.timestamp || "").toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-800 rounded-lg p-3">
              <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-stone-700 flex-shrink-0">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your code... (Shift+Enter for new line)"
            className="flex-1 bg-stone-800 text-white rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={2}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-stone-500 mt-2">
          Code from the editor is automatically included with your questions
        </p>
      </div>
    </div>
  );
}
