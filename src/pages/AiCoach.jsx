import { useState, useEffect, useRef } from "react";
import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { Sparkles, Key, MessageSquare, Send, BrainCircuit, RefreshCw, ChevronRight, HelpCircle, CheckCircle } from "lucide-react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";

const AiCoach = () => {
    useUser();
    const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_key") || "");
    const [settingsTab, setSettingsTab] = useState("connection");
    const [tempKey, setTempKey] = useState(localStorage.getItem("gemini_key") || "");
    const [audit, setAudit] = useState(localStorage.getItem("ai_audit") || "");
    const [auditLoading, setAuditLoading] = useState(false);

    // Chat states
    const [chatHistory, setChatHistory] = useState([
        {
            sender: "ai",
            text: "Hello! I am your SmartSave AI Financial Coach. Click 'Generate AI Saving Audit' to analyze this month's transactions, or ask me any question about your budget!"
        }
    ]);
    const [userMessage, setUserMessage] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const presetPrompts = [
        "How can I reduce my highest expenses?",
        "What is the best way to start a 50/30/20 budget?",
        "Help me save \u20B910,000 in three months."
    ];

    // Auto scroll chat to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, chatLoading]);

    // Save Gemini Key
    const handleSaveKey = () => {
        if (!tempKey.trim()) {
            toast.error("Please enter a valid API key");
            return;
        }
        localStorage.setItem("gemini_key", tempKey.trim());
        setApiKey(tempKey.trim());
        toast.success("Gemini API Key saved successfully!");
    }

    const handleClearKey = () => {
        localStorage.removeItem("gemini_key");
        setTempKey("");
        setApiKey("");
        toast.success("Gemini API Key removed.");
    }

    // Generate Audit
    const handleGenerateAudit = async () => {
        setAuditLoading(true);
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.GET_AI_ADVICE, {
                prompt: "Provide an automated financial cash flow audit and a highly customized saving recommendation summary.",
                geminiKey: apiKey
            });

            if (response.data && response.data.success) {
                setAudit(response.data.response);
                localStorage.setItem("ai_audit", response.data.response);
                toast.success("AI Saving Audit generated!");
            } else {
                toast.error(response.data?.message || "Failed to generate audit");
            }
        } catch (error) {
            console.error("AI Audit error:", error);
            toast.error(error.response?.data?.message || "Internal server error occurred.");
        } finally {
            setAuditLoading(false);
        }
    }

    // Send chat message
    const handleSendMessage = async (msgText) => {
        const textToSend = msgText || userMessage;
        if (!textToSend.trim()) return;

        // Append user message
        const newUserMsg = { sender: "user", text: textToSend };
        setChatHistory(prev => [...prev, newUserMsg]);
        setUserMessage("");
        setChatLoading(true);

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.GET_AI_ADVICE, {
                prompt: textToSend,
                geminiKey: apiKey
            });

            if (response.data && response.data.success) {
                setChatHistory(prev => [...prev, { sender: "ai", text: response.data.response }]);
            } else {
                setChatHistory(prev => [...prev, { sender: "ai", text: `⚠️ Error: ${response.data?.message || "Failed to contact Gemini API."}` }]);
            }
        } catch (error) {
            console.error("AI Coach Chat error:", error);
            setChatHistory(prev => [...prev, { sender: "ai", text: "⚠️ Error: Connection failed. Please check your Gemini key and internet connection." }]);
        } finally {
            setChatLoading(false);
        }
    }

    // Custom Markdown formatter to render stunning blocks without dependency overhead
    const renderStyledText = (rawText) => {
        if (!rawText) return null;

        const lines = rawText.split("\n");
        return lines.map((line, idx) => {
            let processedLine = line;

            // Handle Headings (###)
            if (processedLine.startsWith("###")) {
                return (
                    <h5 key={idx} className="text-sm sm:text-base font-extrabold text-purple-700 dark:text-purple-400 mt-5 mb-2 pb-1 border-b border-purple-500/10 tracking-tight flex items-center gap-1.5">
                        <Sparkles size={14} className="text-purple-500 shrink-0" />
                        {processedLine.replace("###", "").trim()}
                    </h5>
                );
            }
            if (processedLine.startsWith("##") || processedLine.startsWith("#")) {
                return (
                    <h4 key={idx} className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white mt-6 mb-3 tracking-tight">
                        {processedLine.replace(/^#+\s*/, "").trim()}
                    </h4>
                );
            }

            // Handle Bullet points (- or *)
            if (processedLine.trim().startsWith("- ") || processedLine.trim().startsWith("* ")) {
                const cleanLine = processedLine.replace(/^[\s\-\*]+\s*/, "").trim();
                return (
                    <li key={idx} className="list-none flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 my-1.5 pl-2 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0 shadow-sm" />
                        <span dangerouslySetInnerHTML={{ __html: parseBoldText(cleanLine) }} />
                    </li>
                );
            }

            // Handle numbered lists (1., 2.)
            const numMatch = processedLine.trim().match(/^(\d+)\.\s(.*)/);
            if (numMatch) {
                const number = numMatch[1];
                const content = numMatch[2];
                return (
                    <div key={idx} className="flex items-start gap-3 my-2.5 pl-1 leading-relaxed text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        <span className="w-5 h-5 flex items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                            {number}
                        </span>
                        <span dangerouslySetInnerHTML={{ __html: parseBoldText(content) }} />
                    </div>
                );
            }

            // Empty lines
            if (!processedLine.trim()) return <div key={idx} className="h-2" />;

            // Normal text
            return (
                <p key={idx} className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 my-1 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: parseBoldText(processedLine) }}
                />
            );
        });
    }

    // Helper regex to replace **bold** with high-contrast colored text
    const parseBoldText = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>');
    }

    return (
        <Dashboard activeMenu="AI Coach">
            <div className="my-6 max-w-[1400px] mx-auto space-y-6">
                {/* Header Container */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/5 p-5 rounded-2xl shadow-sm backdrop-blur-md">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                            <BrainCircuit className="text-purple-600 dark:text-purple-400 w-7 h-7" />
                            AI Saving Coach
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                            Synthesize current-month transactions with Vectorless RAG to uncover smart saving trends.
                        </p>
                    </div>
                    {apiKey ? (
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 self-start sm:self-auto shadow-sm select-none">
                            <CheckCircle size={14} />
                            <span>AI Engine Connected</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2 self-start sm:self-auto shadow-sm select-none animate-pulse">
                            <Key size={14} />
                            <span>API Key Required</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: API Setup and Audit Result (Spans 7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* API Config Card */}
                        <div className="card">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100/50 dark:border-white/5 pb-3 mb-4 gap-2">
                                <div className="flex items-center gap-2">
                                    <Key className="text-purple-500" size={18} />
                                    <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">AI Settings</h4>
                                </div>
                                <div className="flex bg-gray-100/60 dark:bg-white/5 p-1 rounded-xl border border-gray-200/10 dark:border-white/5 select-none self-start sm:self-auto">
                                    <button
                                        onClick={() => setSettingsTab("connection")}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 ${settingsTab === "connection"
                                                ? "bg-white dark:bg-white/10 text-purple-600 dark:text-purple-400 shadow-sm border border-purple-500/10"
                                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                            }`}
                                    >
                                        <Key size={12} />
                                        <span>Connection</span>
                                    </button>
                                    <button
                                        onClick={() => setSettingsTab("docs")}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 ${settingsTab === "docs"
                                                ? "bg-white dark:bg-white/10 text-purple-600 dark:text-purple-400 shadow-sm border border-purple-500/10"
                                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                            }`}
                                    >
                                        <HelpCircle size={12} />
                                        <span>Documentation</span>
                                    </button>
                                </div>
                            </div>

                            {settingsTab === "connection" && (
                                <div className="space-y-4 animate-fade-in">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        Configure your Google AI Engine access key below. Once saved, your key resides securely in your local browser storage and is never sent to any third-party analytics trackers.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <input
                                                type="password"
                                                placeholder="Paste your Google AI Studio API Key..."
                                                value={tempKey}
                                                onChange={(e) => setTempKey(e.target.value)}
                                                className="w-full text-xs sm:text-sm bg-white/40 dark:bg-white/5 border border-gray-200/20 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 pr-10 text-gray-800 dark:text-gray-100"
                                            />
                                            {apiKey && (
                                                <div className="absolute right-3.5 top-3.5 w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
                                            )}
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                onClick={handleSaveKey}
                                                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl cursor-pointer shadow-md transition-all duration-300 active:scale-95"
                                            >
                                                Save Key
                                            </button>
                                            {apiKey && (
                                                <button
                                                    onClick={handleClearKey}
                                                    className="px-4 py-3 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 font-semibold text-xs sm:text-sm rounded-xl cursor-pointer transition-all duration-300 active:scale-95"
                                                >
                                                    Disconnect
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {settingsTab === "docs" && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="p-4.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                        <p className="font-bold text-gray-900 dark:text-white mb-3 text-xs sm:text-sm flex items-center gap-1.5">
                                            <Sparkles size={14} className="text-purple-500 shrink-0" />
                                            How to obtain a free Gemini API Key:
                                        </p>
                                        <ol className="space-y-2.5 list-decimal list-inside pl-0.5 text-[11px] sm:text-xs">
                                            <li className="marker:text-purple-500 font-medium">
                                                Navigate to <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline font-bold inline-flex items-center gap-0.5">Google AI Studio <ChevronRight size={10} className="inline shrink-0" /></a> and authenticate with your standard Google Account.
                                            </li>
                                            <li className="marker:text-purple-500 font-medium">
                                                Click the **"Get API key"** or **"Create API Key"** button.
                                            </li>
                                            <li className="marker:text-purple-500 font-medium">
                                                If you want to create a new API key, click **"Create API key"** (or you can copy an existing API key from your list).
                                            </li>
                                            <li className="marker:text-purple-500 font-medium">
                                                **Copy** the generated key hash (a string starting with `AIzaSy...`).
                                            </li>
                                            <li className="marker:text-purple-500 font-medium">
                                                Switch back to the **"Connection"** tab above, paste the copied key into the password field, and click **"Save Key"**!
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[11px] sm:text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                        <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                                            <HelpCircle size={14} />
                                        </div>
                                        <p className="leading-snug">
                                            <strong>Pro Tip:</strong> Google Gemini 1.5 Flash offers a completely free tier. No subscription or billing info is required to obtain your key!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Automated Saving Audit Card */}
                        <div className="card min-h-[460px] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between border-b border-gray-100/50 dark:border-white/5 pb-3 mb-5">
                                    <div className="flex items-center gap-2">
                                        <BrainCircuit className="text-indigo-500" size={18} />
                                        <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Active Saving Audit</h4>
                                    </div>
                                    <button
                                        disabled={!apiKey || auditLoading}
                                        onClick={handleGenerateAudit}
                                        className="card-btn flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                                    >
                                        <RefreshCw size={13} className={auditLoading ? "animate-spin" : ""} />
                                        <span>{audit ? "Regenerate" : "Generate Audit"}</span>
                                    </button>
                                </div>

                                {!apiKey ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shadow-inner">
                                            <Key size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">AI Audit Locked</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[280px] mx-auto mt-1 leading-relaxed">
                                                Please configure and save your Gemini API Key in the settings card above to query the model.
                                            </p>
                                        </div>
                                    </div>
                                ) : auditLoading ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                                        {/* Glowing pulsing AI processing block */}
                                        <div className="relative flex items-center justify-center">
                                            <div className="absolute w-20 h-20 rounded-full bg-purple-500/20 animate-ping" />
                                            <div className="absolute w-14 h-14 rounded-full bg-indigo-500/30 animate-pulse" />
                                            <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg border border-white/20 text-white">
                                                <BrainCircuit className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Synthesizing Monthly Cash Flows...</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[320px] mx-auto mt-1 leading-relaxed">
                                                Querying transactional databases, analyzing category-wise spending patterns, and compiling recommendations.
                                            </p>
                                        </div>
                                    </div>
                                ) : audit ? (
                                    <div className="space-y-1 bg-white/30 dark:bg-white/2 border border-gray-200/10 dark:border-white/5 p-5 rounded-2xl max-h-[500px] overflow-y-auto custom-scrollbar animate-slide-up">
                                        {renderStyledText(audit)}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-inner">
                                            <HelpCircle size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No active audit loaded</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[280px] mx-auto mt-1 leading-relaxed">
                                                Click the "Generate Audit" button above to run an AI audit on your cash transactions.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Q&A Financial Coach Chat (Spans 5 Cols) */}
                    <div className="lg:col-span-5">
                        <div className="card h-[692px] flex flex-col justify-between p-5 relative overflow-hidden">

                            {/* Chat Header */}
                            <div className="flex items-center gap-2.5 border-b border-gray-100/50 dark:border-white/5 pb-3.5 mb-4 shrink-0">
                                <div className="w-9 h-9 flex items-center justify-center bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight leading-4">AI Advisor Chat</h4>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Budgets, saving calculators, financial queries</span>
                                </div>
                            </div>

                            {/* Chat History Flow Container */}
                            <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 custom-scrollbar mb-4">
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex items-start gap-2.5 max-w-[90%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>

                                        {/* Sender Avatar */}
                                        <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${msg.sender === "user"
                                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-white/20 shadow-sm"
                                                : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                                            }`}>
                                            {msg.sender === "user" ? "ME" : "AI"}
                                        </div>

                                        {/* Chat bubble body */}
                                        <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed border shadow-sm ${msg.sender === "user"
                                                ? "bg-purple-600 text-white border-purple-500/20 rounded-tr-none font-medium"
                                                : "bg-white/50 dark:bg-white/5 text-gray-800 dark:text-gray-200 border-gray-150/40 dark:border-white/5 rounded-tl-none"
                                            }`}>
                                            {msg.sender === "ai" ? (
                                                <div className="space-y-1">{renderStyledText(msg.text)}</div>
                                            ) : (
                                                <p className="whitespace-pre-line">{msg.text}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Typing state loading indicator */}
                                {chatLoading && (
                                    <div className="flex items-start gap-2.5 mr-auto max-w-[90%]">
                                        <div className="w-7.5 h-7.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 text-xs font-bold">
                                            AI
                                        </div>
                                        <div className="p-4 bg-white/50 dark:bg-white/5 border border-gray-150/40 dark:border-white/5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 min-w-[70px] justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Preset prompt helper suggestions */}
                            {chatHistory.length === 1 && (
                                <div className="space-y-2 shrink-0 mb-4 animate-slide-up">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block ml-0.5">Quick Questions:</p>
                                    <div className="flex flex-col gap-1.5">
                                        {presetPrompts.map((prompt, idx) => (
                                            <button
                                                key={idx}
                                                disabled={!apiKey || chatLoading}
                                                onClick={() => handleSendMessage(prompt)}
                                                className="w-full text-left text-xs bg-indigo-500/5 hover:bg-indigo-500/10 dark:hover:bg-purple-500/10 border border-indigo-500/10 hover:border-indigo-500/35 rounded-xl px-4 py-2.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-purple-300 font-semibold flex items-center justify-between cursor-pointer transition-all duration-300 active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
                                            >
                                                <span>{prompt}</span>
                                                <ChevronRight size={13} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Chat input box */}
                            <div className="shrink-0 pt-2 border-t border-gray-150/40 dark:border-white/5">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }}
                                    className="flex gap-2"
                                >
                                    <input
                                        type="text"
                                        disabled={!apiKey || chatLoading}
                                        value={userMessage}
                                        onChange={(e) => setUserMessage(e.target.value)}
                                        placeholder={apiKey ? "Ask my budgeting coach..." : "Configure API Key to start chat..."}
                                        className="flex-1 text-xs sm:text-sm bg-white/40 dark:bg-white/5 border border-gray-200/20 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 text-gray-800 dark:text-gray-100 disabled:opacity-60"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!apiKey || chatLoading || !userMessage.trim()}
                                        className="w-11 h-11 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.99] transition-all duration-300 disabled:opacity-55 disabled:hover:-translate-y-0 disabled:hover:shadow-md"
                                    >
                                        <Send size={15} />
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}

export default AiCoach;
