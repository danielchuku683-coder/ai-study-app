"use client"

import { useEffect, useRef, useState } from "react"

type Message = {
role: "user" | "assistant"
content: string
}

export default function Ask() {
const [messages, setMessages] = useState<Message[]>([])
const [question, setQuestion] = useState("")
const [loading, setLoading] = useState(false)
const [history, setHistory] = useState<any[]>([])
const [currentChat, setCurrentChat] = useState<string | null>(null)
const bottomRef = useRef<HTMLDivElement | null>(null)





// Load chat history

useEffect(() => {

  const loadHistory = async () => {


    const token = localStorage.getItem("token")

    const res = await fetch("http://localhost:5000/api/ai_questions/history", {

      headers: {

        Authorization: `Bearer ${token}`

      }

    })

    const data = await res.json() || []

     setHistory(data)

     const formatted: Message[] = []

    data.forEach((item: any) => {

      formatted.push({ role: "user", content: item.question })

      formatted.push({ role: "assistant", content: item.answer })

    })

    setMessages(formatted)

  }

  loadHistory()

}, [])



// auto scroll to latest message
useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: "smooth" })
}, [messages, loading])

const sendMessage = async () => {
if (!question.trim() || loading) return

const userMessage: Message = { role: "user", content: question }

const newMessages = [...messages, userMessage]
setMessages(newMessages)
setQuestion("")
setLoading(true)

try {
const token = localStorage.getItem("token")

const res = await fetch(
"http://localhost:5000/api/ai_questions/ask",
{
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`
},
body: JSON.stringify({ question })
}
)

const data = await res.json()

const aiMessage: Message = {
role: "assistant",
content: data.result
}

setMessages([...newMessages, aiMessage])

await fetch("http://localhost:5000/api/questions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    question: question,
    answer: data.result
  })
})

// THIS LINE SAVES IT TO HISTORY
setHistory(prev => [
  { question, answer: data.result },
  ...prev
])
} catch (err) {
setMessages([
...newMessages,
{ role: "assistant", content: "Something went wrong." }
])
}

setLoading(false)
}

// send with Enter
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
if (e.key === "Enter") {
sendMessage()
}
}

const createNewChat = async () => {
  const token = localStorage.getItem("token")

  const res = await fetch("http://localhost:5000/api/chats", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json()
  setCurrentChat(data.id)
  setMessages([])
}

useEffect(() => {
  createNewChat
}
)




return (
<div className="flex h-[90vh]">

{/* History sidebar */}
<div className="w-64 border-r p-4 overflow-y-auto">

<button
onClick={createNewChat}
className="w-full bg-green-600 text-white p-2 rounded-lg mb-4 hover:bg-green-700"
>
+ New Chat
</button>

<h2 className="font-bold mb-4">History</h2>

{history.map((item, i) => (
<div
key={i}
className="p-2 rounded hover:bg-gray-200 cursor-pointer"
onClick={() =>
setMessages([
{ role: "user", content: item.question },
{ role: "assistant", content: item.answer }
])
}
>
{item.question?.slice(0, 30)}...
</div>
))}

</div>

{/* Chat area */}
<div className="flex-1 flex flex-col ">

<h1 className="text-3xl font-semibold mb-2">Ask AI</h1>

<div className="flex-1 overflow-y-auto space-y-4 mb-4">

{messages.map((msg, i) => (
<div
key={i}
className={`p-3 rounded-lg max-w-xl ${
msg.role === "user"
? "bg-blue-500 text-white ml-auto"
: "bg-gray-200 text-black"
}`}
>
{msg.content}
</div>
))}

{loading && (
<div className="bg-gray-200 p-3 rounded-lg w-fit">
AI is typing...
</div>
)}

<div ref={bottomRef} />

</div>

<div className="flex gap-2">

<input
value={question}
onChange={(e) => setQuestion(e.target.value)}
onKeyDown={handleKeyDown}
placeholder="Ask anything..."
className="flex-1 border rounded-full p-4 shadow-sm"
/>

<button
onClick={sendMessage}
className="bg-green-600 text-white px-6 rounded-full"
>
Send
</button>

</div>

</div>

</div>
)



}