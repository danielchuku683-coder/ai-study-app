"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

type Message = {
    role: "user" | "assistant"
    content: string
}

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
            const res = await fetch("https://ai-study-app-tb06.onrender.com/api/ai_questions/history", {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (Array.isArray(data)) setHistory(data)
        }
        loadHistory()
    }, [])

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
            
            // Step 1: Get AI Response
            const res = await fetch("https://ai-study-app-tb06.onrender.com/api/ai_questions/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ question: currentQuestion })
            })
            const data = await res.json()
            setMessages(prev => [...prev, { role: "assistant", content: data.result }])

            // Step 2: Save (Silent)
            fetch("https://ai-study-app-tb06.onrender.com/api/ai_questions", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ question: currentQuestion, answer: data.result })
            })
        } catch (err) {
            setMessages(prev => [...prev, { role: "assistant", content: "Connection lost. Try again." }])
        }
        setLoading(false)
    }

    return (
        <div className="flex h-[88vh] overflow-hidden bg-slate-50 dark:bg-slate-900">
            {/* Sidebar toggle for mobile */}
            <div className={`fixed inset-0 z-40 bg-black/40 md:hidden ${showSidebar ? "block" : "hidden"}`} onClick={() => setShowSidebar(false)} />
            
            <aside className={`fixed md:relative z-50 w-64 h-full bg-white dark:bg-slate-800 border-r transition-all ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                <div className="p-4">
                    <button onClick={() => setMessages([])} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl mb-4 transition-transform active:scale-95">
                        + New Chat
                    </button>
                    <div className="overflow-y-auto h-[60vh] space-y-2">
                        {history.map((h, i) => (
                            <div key={i} className="p-3 text-xs border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer truncate">
                                {h.question}
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col relative">
                <header className="p-4 border-b flex items-center md:hidden">
                    <button onClick={() => setShowSidebar(true)} className="text-xl mr-3">☰</button>
                    <h1 className="font-bold">Ask AI</h1>
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${m.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white dark:bg-slate-800 border rounded-bl-none"}`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                <div className="p-4 border-t bg-white dark:bg-slate-900">
                    <div className="flex gap-2 max-w-3xl mx-auto">
                        <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} className="flex-1 border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-100 dark:bg-slate-800" placeholder="Ask anything..." />
                        <button onClick={sendMessage} className="bg-green-600 text-white px-6 rounded-full font-bold">Send</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function Ask() {
    return (
        <Suspense fallback={<div className="p-20 text-center">Loading AI...</div>}>
            <ChatComponent />
        </Suspense>
    )
}