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
const res = await fetch("https://ai-study-app-tb06.onrender.com/api/ai_questions/ask", {
method: "POST",
headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
body: JSON.stringify({ question: currentQuestion })
})

if (!res.ok) throw new Error("AI failed")
const data = await res.json()
setMessages(prev => [...prev, { role: "assistant", content: data.result }])

// Background Save
fetch("https://ai-study-app-tb06.onrender.com/api/ai_questions", {
method: "POST",
headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
body: JSON.stringify({ question: currentQuestion, answer: data.result })
}).catch(e => console.log("DB save ignored"))

} catch (err) {
setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Try again." }])
} finally {
setLoading(false)
}
}

return (
<div className="flex h-[88vh] overflow-hidden bg-white">
{/* Sidebar toggle for mobile */}
<div className={`fixed inset-0 z-40 bg-black/40 md:hidden ${showSidebar ? "block" : "hidden"}`} onClick={() => setShowSidebar(false)} />

<aside className={`fixed md:relative z-50 w-64 h-full bg-slate-50 border-r transition-all ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
<div className="p-4 flex flex-col h-full">
<button onClick={() => { setMessages([]); setShowSidebar(false); }} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl mb-4 active:scale-95">
+ New Chat
</button>
<div className="overflow-y-auto flex-1 space-y-2">
{history.map((h, i) => (
<div key={i} className="p-3 text-xs border bg-white rounded-xl truncate cursor-pointer hover:bg-slate-100">
{h.question}
</div>
))}
</div>
</div>
</aside>

<main className="flex-1 flex flex-col bg-slate-50">
<header className="p-4 border-b flex items-center md:hidden bg-white">
<button onClick={() => setShowSidebar(true)} className="text-xl mr-3">☰</button>
<h1 className="font-bold text-black">Ask AI</h1>
</header>

<div className="flex-1 overflow-y-auto p-4 space-y-4">
{messages.map((m, i) => (
<div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
<div className={`max-w-[85%] p-4 rounded-2xl shadow-sm border ${
m.role === "user"
? "bg-white text-black border-slate-200 rounded-tr-none"
: "bg-slate-200 text-black border-transparent rounded-tl-none"
}`}>
{m.content}
</div>
</div>
))}
<div ref={bottomRef} />
</div>

<div className="p-4 border-t bg-white">
<div className="flex gap-2 max-w-4xl mx-auto items-end">
<textarea
rows={1}
value={question}
onChange={e => setQuestion(e.target.value)}
onKeyDown={e => { if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
className="flex-1 border border-slate-300 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black placeholder:text-slate-400"
placeholder="Type your message here..."
/>
<button onClick={sendMessage} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold transition-all">
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

