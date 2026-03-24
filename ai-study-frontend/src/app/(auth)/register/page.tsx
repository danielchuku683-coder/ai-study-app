"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register() {
    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    // 1. Added loading state
    const [isLoading, setIsLoading] = useState(false)

    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

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

        if (emailError || passwordError) {
            alert("Fix error before continuing")
            return
        }

        setIsLoading(true) // 2. Start loading

        try {
            const res = await fetch("https://ai-study-app-tb06.onrender.com/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || "Something went wrong")
                setIsLoading(false) // 3. Stop loading on error
                return
            }

            alert("Account created successfully 🎉")
            router.push("/login")
            
        } catch (error) {
            console.error("Registration error:", error)
            alert("Network error. Please try again.")
            setIsLoading(false) // 4. Stop loading on crash
        }
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
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        Create Account ✨
                    </h2>

                    <input
                        type="text"
                        placeholder="Your name"
                        autoComplete="off"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 text-black"
                    />

                    <input
                        type="email"
                        placeholder="Your email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                            const value = e.target.value
                            setEmail(value)
                            if (!isValidEmail(value)) {
                                setEmailError("Invalid address")
                            } else {
                                setEmailError("")
                            }
                        }}
                        className={`w-full border p-3 rounded-lg mb-2 text-black ${
                            emailError ? "border-red-500" : ""
                        }`}
                    />

                    {emailError && (
                        <p className="text-red-500 text-sm mb-2">{emailError}</p>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                            const value = e.target.value
                            setPassword(value)
                            if (!isStrongPassword(value)) {
                                setPasswordError("Password must be 8+ chars, include uppercase & number")
                            } else {
                                setPasswordError("")
                            }
                        }}
                        className={`w-full border p-3 rounded-lg mb-2 text-black ${
                            passwordError ? "border-red-500" : ""
                        }`}
                    />

                    {passwordError && (
                        <p className="text-red-500 text-sm mb-2">{passwordError}</p>
                    )}

                    <button
                        onClick={register}
                        disabled={isLoading} // 5. Disable while loading
                        className={`w-full py-3 rounded-lg transition text-white font-bold flex items-center justify-center ${
                            isLoading 
                            ? "bg-purple-400 cursor-not-allowed" 
                            : "bg-purple-600 hover:bg-purple-700"
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </button>

                    <p className="text-center mt-6 text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/login" className="text-purple-600 font-medium hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}