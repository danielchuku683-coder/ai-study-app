"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
export default function Register() {

const router = useRouter()

const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")

const [emailError, setEmailError] = useState("")
const [passwordError, setPasswordError] =useState("")

const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const isStrongPassword = (password: string) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
}

const register = async () => {

if (!name || !email || !password) {
alert("Please fill all fields")
return
}

if (emailError || passwordError){
    alert("Fix error before continuing")
    return
}

const res = await fetch("http://localhost:5000/api/auth/register", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ name, email, password })
})

const data = await res.json()

if (!res.ok) {
alert(data.error || "Something went wrong")
return
}

alert("Account created successfully 🎉")
router.push("/login")
}

return (
<div className="min-h-screen flex">

{/* LEFT */}
<div className="hidden md:flex w-1/2 bg-purple-600 text-white items-center justify-center">
<div className="text-center px-10">
<h1 className="text-4xl font-bold mb-4">Join AI Study 🚀</h1>
<p>Create your account and start learning smarter.</p>
</div>
</div>

{/* RIGHT */}
<div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">

<div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

<h2 className="text-2xl font-bold mb-6 text-center">
Create Account ✨
</h2>

<input
type="text"
placeholder="Your name"
autoComplete="off"
onChange={(e) => setName(e.target.value)}
className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500"
/>

<input
type="email"
placeholder="Your email"
autoComplete="email"
onChange={(e) => {
    const value = e.target.value
    setEmail(value)

    if (!isValidEmail(value)) {
        setEmailError("Invalid address")
    } else {
        setEmailError("")
    }
}}
className={`w-full bolder p-3 rounded-lg mb-2 ${
    emailError ? "border-red-500" : ""
}`}
/>

{emailError && (
    <p className="text-red-500 text-sm mb-2">{emailError}</p>
)}

{/* ✅ PASSWORD INPUT */}
<input
type="password"
placeholder="Password"
autoComplete="new-password"
onChange={(e) => {
    const value = e.target.value
    setPassword(value)

    if (!isStrongPassword(value)) {
        setPasswordError("Password must be 8+ chars, include uppercase & number")
    }else {
        setPasswordError("")
    }
}}
className={`w-full border p-3 rounded-lg mb-2 ${
    passwordError ? "border-red-500" : ""
}`}
/>

{passwordError && (
    <p className="text-red-500 text-sm mb-2">{passwordError}</p>
)}

<button
onClick={register}
className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
>
Sign Up
</button>

<p className="text-center mt-6 text-sm">
Already have an account?{" "}
<a href="/login" className="text-purple-600 font-medium">
Login
</a>
</p>

</div>

</div>
</div>
)
}
//}
