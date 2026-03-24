"use client"

import Link from "next/link"

export default function Sidebar() {
    return (

        <div className="w-60 h-screen bg-gray-900 text-white p-6">

            <h2 className="text-xl front-bold mb-8">
                AI Study
            </h2>

            <div className="flex flex-col gap-4">

                <Link href="/dashboard">
                <div className="hover:bg-gray-100 p-2 rounded">
                    Dashboard
                </div>
                </Link>

                <Link href="/summarize">
                <div className="hover:bg-gray-100 p-2 rounded">
                    Summarize
                </div>
                </Link>

                <Link href="/quiz">
                <div className="hover:bg-gray-100 p-2 rounded">
                    Quiz
                </div>
                </Link>

                <Link href="/ask">
                <div className="hover:bg-gray-100 p-2 rounded">
                    Ask AI
                </div>
                </Link>
            </div>
        </div>
    )
}