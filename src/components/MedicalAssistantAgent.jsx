import React, { useMemo, useState } from "react";
import { useConversation } from "@elevenlabs/react";

const DEFAULT_AGENT_ID = "agent_2601kj1apm99fbm983n8krtj6zp8";

export default function MedicalAssistantAgent() {
  const [textInput, setTextInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    []
  );

  const conversation = useConversation({
    onConnect: () => {
      setErrorMessage("");
      console.log("Medical Assistant connected");
    },
    onDisconnect: () => console.log("Medical Assistant disconnected"),
    onMessage: (message) => console.log("Medical Assistant message:", message),
    onError: (error) => {
      const message = error?.message || "Unknown ElevenLabs error";
      setErrorMessage(message);
      console.error("Medical Assistant error:", error);
    },
    onModeChange: (mode) => console.log("Medical Assistant mode:", mode),
  });

  const startConversation = async () => {
    try {
      setErrorMessage("");
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const response = await fetch(
        `${apiBaseUrl}/api/elevenlabs/token?agentId=${DEFAULT_AGENT_ID}`
      );

      if (!response.ok) {
        let details = "";
        try {
          const json = await response.json();
          details = json?.error || json?.details || "";
        } catch {
          details = "";
        }
        throw new Error(details || "Unable to create ElevenLabs conversation token");
      }

      const { token } = await response.json();

      try {
        await conversation.startSession({
          conversationToken: token,
          connectionType: "webrtc",
        });
      } catch (webrtcError) {
        console.warn("WebRTC start failed, trying websocket fallback", webrtcError);
        await conversation.startSession({
          conversationToken: token,
          connectionType: "websocket",
        });
      }
    } catch (error) {
      setErrorMessage(error?.message || "Failed to start session");
      console.error("Failed to start Medical Assistant session:", error);
    }
  };

  const sendText = () => {
    const text = textInput.trim();
    if (!text || conversation.status !== "connected") return;

    conversation.sendUserMessage(text);
    setTextInput("");
  };

  return (
    <div className="fixed right-3 bottom-3 z-50 w-[320px] rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur">
      <p className="text-sm font-semibold text-white">Medical Assistant</p>
      <p className="text-xs text-slate-400">Agent: {DEFAULT_AGENT_ID}</p>

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={startConversation}
          disabled={conversation.status === "connected" || conversation.status === "connecting"}
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={() => conversation.endSession()}
          disabled={conversation.status !== "connected"}
          className="rounded-md bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          Stop
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-300">Status: {conversation.status}</p>
      <p className="text-xs text-slate-300">
        Agent is {conversation.isSpeaking ? "speaking" : "listening"}
      </p>
      {!!errorMessage && (
        <p className="mt-1 text-xs text-red-300">Error: {errorMessage}</p>
      )}

      <div className="mt-2 flex gap-2">
        <input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Send a text message"
          className="h-8 w-full rounded-md border border-slate-700 bg-slate-800 px-2 text-xs text-white placeholder:text-slate-400"
        />
        <button
          onClick={sendText}
          disabled={conversation.status !== "connected"}
          className="rounded-md bg-sky-600 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}