"use client"

import { useEffect, useRef, useState, Suspense } from "react" // Added Suspense
import { useSearchParams } from "next/navigation"

type Message = {
    role: "user" | "assistant"
    content: string
}

// Separate the Chat logic so we can wrap it in Suspense
function ChatComponent() {
    const [messages, setMessages] = useState<Message[]>([])
    const [question, setQuestion] = useState("")
    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState<any[]>([])
    const [showSidebar, setShowSidebar] = useState(false)
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const searchParams = useSearchParams()

    useEffect(() => {
        const loadHistory = async () => {
            const token = localStorage.getItem("token")
            try {
                const res = await fetch("https://ai-study-app-tb06.onrender.com/api/ai_questions/history", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()
                if (data && Array.isArray(data)) setHistory(data)
            } catch (err) {
                console.error("History failed", err)
            }
        }
        loadHistory()

        const queryFromUrl = searchParams.get("query")
        if (queryFromUrl) setQuestion(queryFromUrl)
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
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ question: currentQuestion })
            })
            const data = await res.json()
            const aiMessage: Message = { role: "assistant", content: data.result }
            setMessages(prev => [...prev, aiMessage])

            await fetch("https://ai-study-app-tb06.onrender.com/api/questions", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ question: currentQuestion, answer: data.result })
            })
            setHistory(prev => [{ question: currentQuestion, answer: data.result }, ...prev])
        } catch (err) {
            setMessages(prev => [...prev, { role: "assistant", content: "Error: Please check your connection." }])
        }
        setLoading(false)
    }

    return (
        <div className="flex h-[88vh] overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
            {/* Sidebar Overlay */}
            <div className={`fixed inset-0 z-50 bg-black/50 md:hidden transition-opacity ${showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setShowSidebar(false)} />

            {/* Sidebar */}
            <div className={`fixed md:relative z-50 w-72 h-full border-r transition-transform duration-300 ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`} style={{ backgroundColor: "var(--card)", borderColor: "var(--input)" }}>
                <div className="p-4">
                    <button onClick={() => { setMessages([]); setShowSidebar(false); }} className="w-full bg-green-600 text-white p-3 rounded-xl mb-6 font-bold">
                        + New Chat
                    </button>
                    <div className="space-y-2 overflow-y-auto max-h-[70vh]">
                        {history.map((item, i) => (
                            <div key={i} onClick={() => { setMessages([{ role: "user", content: item.question }, { role: "assistant", content: item.answer }]); setShowSidebar(false); }} className="p-3 rounded-xl border border-transparent hover:border-blue-500 cursor-pointer text-sm line-clamp-2">
                                {item.question}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center p-4 border-b md:hidden" style={{ borderColor: "var(--input)" }}>
                    <button onClick={() => setShowSidebar(true)} className="text-2xl mr-4">📜</button>
                    <h1 className="font-bold">Ask AI</h1>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-800"}`} style={msg.role !== "user" ? {backgroundColor: "var(--card)", color: "var(--text)", border: "1px solid var(--input)"} : {}}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
                <div className="p-4 border-t" style={{ borderColor: "var(--input)" }}>
                    <div className="max-w-4xl mx-auto flex gap-2">
                        <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Ask anything..." style={{ backgroundColor: "var(--card)", color: "var(--text)", borderColor: "var(--input)" }} className="flex-1 border rounded-2xl p-4 outline-none" />
                        <button onClick={sendMessage} className="bg-green-600 text-white px-6 rounded-2xl font-bold">Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// 4. THIS IS THE EXPORT THAT FIXES THE VERCEL ERROR
export default function Ask() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading Chat...</div>}>
            <ChatComponent />
        </Suspense>
    )
}