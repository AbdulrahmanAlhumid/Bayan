import { useEffect, useState } from "react";
import { BayanUI } from "./BayanUI";
import { analyzeDocument, DEFAULT_PROMPT, sendChatMessage } from "./bayanService";
import { clearHistory, getHistory, saveHistory } from "./bayanStorage";

function createHistoryEntry(result, sourceName) {
  return {
    id: Date.now(),
    date: new Date().toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: new Date().toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    sourceName: sourceName || "نص مُدخل",
    result,
  };
}

export default function BayanPage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("dark");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    (async () => {
      setHistory(await getHistory());
    })();
  }, []);

  useEffect(() => {
    document.body.style.background = theme === "light" ? "#f7f1e4" : "#0d1117";
  }, [theme]);

  const persistHistory = async (nextHistory) => {
    setHistory(nextHistory);
    await saveHistory(nextHistory);
  };

  const handleFile = (file) => {
    if (!file) return;

    const allowed = ["application/pdf", "text/plain"];
    if (!allowed.includes(file.type)) {
      setError("يُدعم فقط ملفات PDF و TXT حالياً");
      return;
    }

    setError("");
    const reader = new FileReader();

    if (file.type === "application/pdf") {
      reader.onload = (event) => {
        const base64 = event.target.result.split(",")[1];
        setUploadedFile({ name: file.name, type: "pdf", base64 });
        setInputText("");
      };
      reader.readAsDataURL(file);
      return;
    }

    reader.onload = (event) => {
      setUploadedFile({ name: file.name, type: "txt", text: event.target.result });
      setInputText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setInputText("");
  };

  const handleAnalyze = async () => {
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const parsed = await analyzeDocument({ inputText, uploadedFile, prompt });
      setResult(parsed);

      const nextHistory = [createHistoryEntry(parsed, uploadedFile?.name || null), ...history].slice(0, 20);
      await persistHistory(nextHistory);
    } catch (err) {
      setError(`خطأ: ${err.message || "يرجى المحاولة مجدداً."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setInputText("");
    setError("");
    setUploadedFile(null);
  };

  const handleDeleteHistory = async (id) => {
    const nextHistory = history.filter((item) => item.id !== id);
    await persistHistory(nextHistory);
  };

  const handleClearHistory = async () => {
    setHistory([]);
    await clearHistory();
  };

  const handleSelectHistory = (selectedResult) => {
    setResult(selectedResult);
    setShowHistory(false);
  };

  const handleSendChatMessage = async ({ messages, result: chatResult, originalText }) => {
    return sendChatMessage({
      messages,
      result: chatResult,
      originalText,
    });
  };

  return (
    <BayanUI
      inputText={inputText}
      result={result}
      loading={loading}
      error={error}
      theme={theme}
      prompt={prompt}
      showPromptEditor={showPromptEditor}
      uploadedFile={uploadedFile}
      isDragging={isDragging}
      history={history}
      showHistory={showHistory}
      onThemeChange={setTheme}
      onPromptChange={setPrompt}
      onResetPrompt={() => setPrompt(DEFAULT_PROMPT)}
      onTogglePromptEditor={() => setShowPromptEditor((value) => !value)}
      onOpenHistory={() => setShowHistory(true)}
      onCloseHistory={() => setShowHistory(false)}
      onSelectHistory={handleSelectHistory}
      onDeleteHistory={handleDeleteHistory}
      onClearHistory={handleClearHistory}
      onInputTextChange={setInputText}
      onDragStateChange={setIsDragging}
      onHandleFile={handleFile}
      onRemoveFile={handleRemoveFile}
      onAnalyze={handleAnalyze}
      onReset={handleReset}
      onChatSend={handleSendChatMessage}
    />
  );
}
