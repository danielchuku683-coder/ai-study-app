"use client"

import { useState } from "react"

export default function Summarize() {
const [notes, setNotes] = useState("")
const [result, setResult] = useState("")
const [loading, setLoading] = useState(false)

const summarize = async () => {
if (!notes) return alert("Enter notes first")

setLoading(true)

try {
const token = localStorage.getItem("token")

const res = await fetch(
"http://localhost:5000/api/notes/summarize",
{
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`
},
body: JSON.stringify({ notes }) // ✅ FIXED
}
)

const data = await res.json()
setResult(data.summary)

} catch (err) {
alert("Error summarizing")
}

setLoading(false)
}

return (
<div className="p-10 max-w-3xl mx-auto">

<h1 className="text-3xl font-bold mb-6">Summarize Notes 📝</h1>

<textarea
placeholder="Paste your notes here..."
value={notes}
onChange={(e) => setNotes(e.target.value)}
className="w-full h-40 p-4 border rounded-lg mb-4"
/>

<button
onClick={summarize}
className="bg-blue-600 text-white px-6 py-2 rounded-lg"
>
{loading ? "Summarizing..." : "Summarize"}
</button>

{result && (
<div className="mt-6 p-4 bg-gray-100 rounded-lg">
<h2 className="font-semibold mb-2">Summary:</h2>
<p>{result}</p>
</div>
)}

</div>
)
}
