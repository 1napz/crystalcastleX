import React, { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (text: string, file?: File) => void;
}

const EMOJIS = ["😀", "😂", "❤️", "🔥", "👍", "🎉", "🙌", "✨", "😍", "🤔", "😎", "🚀"];

const UltimateChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`; // max \~6 lines
  }, [input]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Revoke previous URL if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed && !selectedFile) return;

    onSend(trimmed, selectedFile || undefined);

    // Reset
    setInput("");
    removeFile();
    setShowEmojis(false);

    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojis(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Image Preview */}
      {previewUrl && (
        <div className="mb-3 relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-40 rounded-xl border border-gray-200 shadow-sm object-cover"
          />
          <button
            onClick={removeFile}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition"
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="relative flex items-end gap-2 bg-white border border-gray-300 rounded-2xl shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojis((v) => !v)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
          title="Emoji"
        >
          😊
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Shift + Enter for new line)"
          rows={1}
          className="flex-1 resize-none border-0 focus:ring-0 focus:outline-none text-sm py-2.5 px-1 max-h-40 overflow-y-auto bg-transparent"
        />

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
          title="Upload image"
        >
          📎
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() && !selectedFile}
          className={`p-2.5 rounded-full transition ${
            input.trim() || selectedFile
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          title="Send"
        >
          ➤
        </button>
      </div>

      {/* Emoji Picker */}
      {showEmojis && (
        <div className="mt-2 p-3 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-wrap gap-2 max-w-xs">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => insertEmoji(emoji)}
              className="text-xl hover:scale-125 transition-transform p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UltimateChatInput;
