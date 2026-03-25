"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Dashboard() {
    const router = useRouter()
    const [question, setQuestion] = useState("")

    // THE FUNCTION MUST BE HERE (Inside Dashboard, before return)
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim()) {
            router.push(`/ask?query=${encodeURIComponent(question)}`);
        }
    };

    return (
        <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }} className="min-h-screen p-6 pb-24">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-lg mb-8">
                <h1 className="text-3xl font-bold">🤖 AI Study Assistant</h1>
                <p className="mt-2 opacity-90">Smarter studying starts here</p>
            </div>

            {/* SEARCH BAR SECTION */}
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask anything... (e.g. Explain photosynthesis)"
                        style={{ 
                            backgroundColor: "var(--card)", 
                            color: "var(--text)", 
                            borderColor: "var(--input)" 
                        }}
                        className="w-full p-5 pr-20 rounded-2xl border shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                    />
                    <button 
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 px-4 rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                        Enter
                    </button>
                </form>
            </div>

            {/* FEATURE GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <Link href="/ask">
                    <div style={{ backgroundColor: "var(--card)", color: "var(--text)", borderColor: "var(--input)" }} className="p-6 rounded-2xl border shadow-sm text-center cursor-pointer hover:scale-105 transition">
                        <div className="text-4xl mb-3">💬</div>
                        <h2 className="font-bold text-xl">Ask AI</h2>
                        <p className="opacity-70">Chat with AI instantly</p>
                    </div>
                </Link>

                <Link href="/summarize">
                    <div style={{ backgroundColor: "var(--card)", color: "var(--text)", borderColor: "var(--input)" }} className="p-6 rounded-2xl border shadow-sm text-center cursor-pointer hover:scale-105 transition">
                        <div className="text-4xl mb-3">📝</div>
                        <h2 className="font-bold text-xl">Summarize</h2>
                        <p className="opacity-70">Turn notes into summaries</p>
                    </div>
                </Link>

                <Link href="/quiz">
                    <div style={{ backgroundColor: "var(--card)", color: "var(--text)", borderColor: "var(--input)" }} className="p-6 rounded-2xl border shadow-sm text-center cursor-pointer hover:scale-105 transition">
                        <div className="text-4xl mb-3">🧠</div>
                        <h2 className="font-bold text-xl">Quiz</h2>
                        <p className="opacity-70">Test your knowledge</p>
                    </div>
                </Link>

                <Link href="/upload">
                    <div style={{ backgroundColor: "var(--card)", color: "var(--text)", borderColor: "var(--input)" }} className="p-6 rounded-2xl border shadow-sm text-center cursor-pointer hover:scale-105 transition">
                        <div className="text-4xl mb-3">📤</div>
                        <h2 className="font-bold text-xl">Upload</h2>
                        <p className="opacity-70">Upload assignments</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}