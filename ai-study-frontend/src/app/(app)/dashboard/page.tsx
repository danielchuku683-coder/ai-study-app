"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Dashboard() {

const router = useRouter()

const [question, setQuestion] = useState("")

const logout = () => {
localStorage.removeItem("token")
router.push("/login")
}

const deleteAccount = async () => {
    const email = prompt("Enter your email to confirm deletion")

    if(!email) return

    await fetch("https://ai-study-app-tb06.onrender.com/api/auth/delete",{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({ email })
    })
    localStorage.removeItem("token")

    router.push("/register")
}

return (

      <div className="min-h-screen bg-gray-50 p-6">



      {/* HEADER */}

      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white p-8 rounded-2*1 shadow-*1 mb-8">

        <h1 className="text-3xl font-bold">🤖 AI Study Assistant</h1>

        <p className="mt-2 opacity-90">Smarter studying starts here</p>

      </div>



      {/* SEARCH BAR */}

      <div className="max-w-5*1 mx-auto">

        <input

          type="text"

          placeholder="Ask anything... (e.g. Explain photosynthesis)"

          className="w-full p-5 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-lg"

        />

      </div>



      {/* FEATURES */}

      


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">

<Link href="/ask">
<div className="feature-card">
<div className="text-4xl mb-3">💬</div>
<h2>Ask AI</h2>
<p>Chat with AI instantly</p>
</div>
</Link>

<Link href="/summarize">
<div className="feature-card">
<div className="text-4xl mb-3">📝</div>
<h2>Summarize</h2>
<p>Turn notes into summaries</p>
</div>
</Link>

<Link href="/quiz">
<div className="feature-card">
<div className="text-4xl mb-3">🧠</div>
<h2>Quiz</h2>
<p>Test your knowledge</p>
</div>
</Link>

<Link href="/upload">
<div className="feature-card">
<div className="text-4xl mb-3">📤</div>
<h2>Upload</h2>
<p>Upload assignments</p>
</div>
</Link>

</div>




    </div>
)




}
<div className="bg-red-500 text-white p-10 text-3*1">
    TAILWIND TEST
</div>