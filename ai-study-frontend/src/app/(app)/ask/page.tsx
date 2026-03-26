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

// Load history once on start
useEffect(() => {
const loadHistory = async () => {
try {
const token = localStorage.getItem("token")
const res = await fetch("https://ai-study-app-tb06.onrender.com/api/ai_questions/history", {
headers: { Authorization: `Bearer ${token}` }
})
const data = await res.json()
if (Array.isArray(data)) setHistory(data)
} catch (e) { console.log("History fetch failed") }
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

// 1. GET THE AI RESPONSE FIRST (The most important part)
const res = await fetch("https://ai-study-app-tb06.onrender.com/api/ai_questions/ask", {
method: "POST",
headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
body: JSON.stringify({ question: currentQuestion })
})

if (!res.ok) throw new Error("AI failed")
const data = await res.json()

// Show AI answer immediately
setMessages(prev => [...prev, { role: "assistant", content: data.result }])

// 2. BACKGROUND SAVE (This won't stop the AI if it fails)
fetch("https://ai-study-app-tb06.onrender.com/api/ai_questions", {
method: "POST",
headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
body: JSON.stringify({
question: currentQuestion,
answer: data.result
})
}).then(() => {
// Update sidebar history silently
setHistory(prev => [{ question: currentQuestion, answer: data.result }, ...prev])
}).catch(e => console.log("Database save failed, but AI is fine"))

} catch (err) {
setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting. Please try again." }])
} finally {
setLoading(false)
}
}

return (
<div className="flex h-[88vh] overflow-hidden bg-slate-50 dark:bg-slate-900">
<div className={`fixed inset-0 z-40 bg-black/40 md:hidden ${showSidebar ? "block" : "hidden"}`} onClick={() => setShowSidebar(false)} />

<aside className={`fixed md:relative z-50 w-64 h-full bg-white dark:bg-slate-800 border-r transition-all ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
<div className="p-4 flex flex-col h-full">
<button onClick={() => { setMessages([]); setShowSidebar(false); }} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl mb-4 shadow-sm active:scale-95">
+ New Chat
</button>
<p className="text-xs font-bold text-slate-400 mb-2 px-2 uppercase tracking-wider">History</p>
<div className="overflow-y-auto flex-1 space-y-2 pr-1">
{history.map((h, i) => (
<div key={i} onClick={() => setMessages([{role: 'user', content: h.question}, {role: 'assistant', content: h.answer}])}
className="p-3 text-xs border rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer truncate transition-colors bg-white dark:bg-slate-800 shadow-sm">
{h.question}
</div>
))}
</div>
</div>
</aside>

<main className="flex-1 flex flex-col bg-white dark:bg-slate-950">
<header className="p-4 border-b flex items-center md:hidden bg-white dark:bg-slate-900">
<button onClick={() => setShowSidebar(true)} className="text-xl mr-3">☰</button>
<h1 className="font-bold">Ask AI</h1>
</header>

<div className="flex-1 overflow-y-auto p-4 space-y-4">
{messages.length === 0 && (
<div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-10">
<div className="text-4xl mb-4">🤖</div>
<p className="text-sm">Ask me anything about your studies!</p>
</div>
)}
{messages.map((m, i) => (
<div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
<div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${m.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-100 dark:bg-slate-800 dark:text-white border dark:border-slate-700 rounded-tl-none"}`}>
{m.content}
</div>
</div>
))}
{loading && (
<div className="flex justify-start">
<div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none animate-pulse text-sm text-slate-500">AI is thinking...</div>
</div>
)}
<div ref={bottomRef} />
</div>

<div className="p-4 border-t bg-white dark:bg-slate-900">
<div className="flex gap-2 max-w-4xl mx-auto items-end">
<textarea
rows={1}
value={question}
onChange={e => setQuestion(e.target.value)}
onKeyDown={e => { if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
className="flex-1 border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 resize-none max-h-32"
placeholder="Ask anything..."
/>
<button onClick={sendMessage} disabled={loading} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all">
Send
</button>
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

