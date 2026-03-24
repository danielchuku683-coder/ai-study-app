"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const login = async () => {

        const res = await fetch("https://ai-study-app-tb06.onrender.com/api/auth/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ email,
                password
             })
        })



        const data = await res.json()

        if(!res.ok){
            alert(data.error)
            return
        }

        localStorage.setItem("token",data.token)

        router.push("/dashboard")
    }
return (
<div className="min-h-screen flex">

{/* LEFT */}
<div className="hidden md:flex w-1/2 bg-blue-600 text-white items-center justify-center">
<div className="text-center px-10">
<h1 className="text-4xl font-bold mb-4">AI Study Assistant</h1>
<p className="opacity-90">
Learn smarter. Ask anything. Get instant answers.
</p>
</div>
</div>

{/* RIGHT */}
<div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">

<div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

<h2 className="text-2xl font-bold mb-6 text-center">
Welcome Back 👋
</h2>

<input
type="email"
placeholder="Email"
onChange={(e) => setEmail(e.target.value)}
className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
/>

<input
type="password"
placeholder="password"
onChange={(e) => setPassword(e.target.value)}
className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"/>

<button
onClick={login}
className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
>
Login
</button>

<p className="text-center mt-6 text-sm">
Don’t have an account?{" "}
<a href="/register" className="text-blue-600 font-medium">
Sign up
</a>
</p>

</div>

</div>
</div>
)

}