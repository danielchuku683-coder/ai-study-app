"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"

type Message = {
    role: "user" | "assistant"
    content: string
}

export default function Ask() {
    const [messages, setMessages] = useState<Message[]>([])
    const [question, setQuestion] = useState("")
    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState<any[]>([])
    const [showSidebar, setShowSidebar] = useState(false) // Toggle for mobile
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const searchParams = useSearchParams()

    // 1. Load history ONCE when page loads
    useEffect(() => {
        const loadHistory = async () => {
            const token = localStorage.getItem("token")
            try {
                const res = await fetch("https://ai-study-app-tb06.onrender.com/api/ai_questions/history", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()
                if (data && Array.isArray(data)) {
                    setHistory(data)
                }
            } catch (err) {
                console.error("History failed", err)
            }
        }
        loadHistory()

        // Catch question from Dashboard
        const queryFromUrl = searchParams.get("query")
        if (queryFromUrl) {
            setQuestion(queryFromUrl)
        }
    }, [searchParams])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, loading])

    const sendMessage = async () => {
        if (!question.trim() || loading) return

        const userMessage: Message = { role: "user", content: question }
        setMessages(prev => [...prev, userMessage])
        const currentQuestion = question
        setQuestion("")
        setLoading(true)

        try {
            const token = localStorage.getItem("token")
            const res = await fetch("https://ai-study-app-tb06.onrender.com/api/ai_questions/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ question: currentQuestion })
            })

            const data = await res.json()
            const aiMessage: Message = { role: "assistant", content: data.result }
            setMessages(prev => [...prev, aiMessage])

            // SAVE TO DATABASE
            await fetch("https://ai-study-app-tb06.onrender.com/api/questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ question: currentQuestion, answer: data.result })
            })

            setHistory(prev => [{ question: currentQuestion, answer: data.result }, ...prev])
        } catch (err) {
            setMessages(prev => [...prev, { role: "assistant", content: "Check your connection and try again." }])
        }
        setLoading(false)
    }

    return (
        <div className="flex h-[85vh] overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
            
            {/* MOBILE SIDEBAR OVERLAY */}
            <div className={`fixed inset-0 z-50 bg-black/50 md:hidden transition-opacity ${showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setShowSidebar(false)} />

            {/* HISTORY SIDEBAR */}
            <div className={`fixed md:relative z-50 md:z-0 w-72 h-full border-r transition-transform duration-300 transform 
                ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
                style={{ backgroundColor: "var(--card)", borderColor: "var(--input)" }}>
                
                <div className="p-4">
                    <button onClick={() => { setMessages([]); setShowSidebar(false); }} 
                        className="w-full bg-green-600 text-white p-3 rounded-xl mb-6 font-bold shadow-md hover:bg-green-700">
                        + New Chat
                    </button>
                    <h2 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">Recent History</h2>
                    <div className="space-y-2 overflow-y-auto max-h-[60vh]">
                        {history.map((item, i) => (
                            <div key={i} onClick={() => { setMessages([{ role: "user", content: item.question }, { role: "assistant", content: item.answer }]); setShowSidebar(false); }}
                                className="p-3 rounded-xl cursor-pointer transition-colors hover:bg-black/5 text-sm line-clamp-2"
                                style={{ border: "1px solid var(--input)" }}>
                                {item.question}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* TOP NAV FOR MOBILE */}
                <div className="flex items-center p-4 border-b md:hidden" style={{ borderColor: "var(--input)" }}>
                    <button onClick={() => setShowSidebar(true)} className="text-2xl mr-4">📜</button>
                    <h1 className="text-lg font-bold">Ask AI</h1>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center p-10">
                            <span className="text-6xl mb-4">🤖</span>
                            <p>Ask me anything about your studies...</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                                msg.role === "user" 
                                ? "bg-blue-600 text-white rounded-tr-none" 
                                : "bg-gray-200 text-black dark:bg-slate-700 dark:text-white rounded-tl-none"}`}
                                style={msg.role !== "user" ? {backgroundColor: "var(--card)", border: "1px solid var(--input)"} : {}}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse text-sm">
                                AI is thinking...
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* INPUT AREA */}
                <div className="p-4 border-t" style={{ borderColor: "var(--input)" }}>
                    <div className="max-w-4xl mx-auto flex gap-2">
                        <input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type your question..."
                            style={{ backgroundColor: "var(--card)", color: "var(--text)", borderColor: "var(--input)" }}
                            className="flex-1 border rounded-2xl p-4 shadow-inner outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={sendMessage} disabled={loading}
                            className="bg-green-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50">
                            ✈️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}