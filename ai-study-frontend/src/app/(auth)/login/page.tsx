"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false) // 1. Added loading state
    const router = useRouter()

    const login = async () => {
        setIsLoading(true) // 2. Start loading

        try {
            const res = await fetch("https://ai-study-app-tb06.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || "Login failed")
                setIsLoading(false) // 3. Stop loading on error
                return
            }

            localStorage.setItem("token", data.token)
            router.push("/dashboard")
            
        } catch (error) {
            console.error("Login error:", error)
            alert("Something went wrong. Please try again.")
            setIsLoading(false) // 4. Stop loading on crash
        }
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 text-black"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-3 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 text-black"
                    />

                    <button
                        onClick={login}
                        disabled={isLoading} // 5. Disable button while loading
                        className={`w-full py-3 rounded-lg transition text-white font-bold ${
                            isLoading 
                            ? "bg-blue-400 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            "Login"
                        )}
                    </button>

                    <p className="text-center mt-6 text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <a href="/register" className="text-blue-600 font-medium hover:underline">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}