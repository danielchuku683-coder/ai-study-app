"use client"

import { useState } from "react"

export default function Quiz(){

const [notes,setNotes] = useState("")
const [quiz,setQuiz] = useState("")

const generateQuiz = async ()=>{

const token = localStorage.getItem("token")

const res = await fetch(
"http://localhost:5000/api/quizzes/generate",
{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({ notes })
})

const data = await res.json()

setQuiz(data.quiz)

}

return (
<div className="p-10 max-w-3xl mx-auto">

<h1 className="text-3xl font-bold mb-6">Generate Quiz 🧠</h1>

<textarea
placeholder="Paste your notes..."
value={notes}
onChange={(e) => setNotes(e.target.value)}
className="w-full h-40 p-4 border rounded-lg mb-4"
/>

<button
onClick={generateQuiz}
className="bg-purple-600 text-white px-6 py-2 rounded-lg"
>
Generate Quiz
</button>

{quiz && (
<div className="mt-6 p-4 bg-gray-100 rounded-lg">
<h2 className="font-semibold mb-2">Quiz:</h2>
<p>{quiz}</p>
</div>
)}

</div>
)


}
