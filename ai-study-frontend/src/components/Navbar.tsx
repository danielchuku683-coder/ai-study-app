"use client"

import Link from "next/link"

export default function Navbar(){

    return(

        <div style={{
            display:"flex",
            gap:"20px",
            padding:"10px",
            background:"#eee"
        }}>

            <Link href="/dashboard">Dashboard</Link>
            <Link href="/summarize">Summarize</Link>
            <Link href="/quiz">Quiz</Link>
            <Link href="/ask">Ask</Link>
        </div>
    )
}