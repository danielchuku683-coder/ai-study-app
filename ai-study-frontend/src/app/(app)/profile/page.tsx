"use client";

import { useState, useEffect } from "react";
import useDarkMode from "@/hooks/useDarkMode";

export default function ProfilePage() {
    const [name, setName] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const { dark, toggleDark } = useDarkMode();

    // 1. THE CRITICAL FIX: Sync the CSS class with your 'dark' state
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [dark]);

    // LOAD SAVED DATA
    useEffect(() => {
        const savedName = localStorage.getItem("name");
        const savedImage = localStorage.getItem("image");
        if (savedName) setName(savedName);
        if (savedImage) setImage(savedImage);
    }, []);

    const saveName = () => {
        localStorage.setItem("name", name);
        alert("Name saved ✅");
    };

    const handleImage = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
            localStorage.setItem("image", url);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const deleteAccount = async () => {
        const confirmDelete = confirm("Are you sure? This cannot be undone.");
        if (!confirmDelete) return;
        await fetch("https://ai-study-app-tb06.onrender.com/api/auth/delete", {
            method: "DELETE",
        });
        localStorage.clear();
        window.location.href = "/register";
    };

    return (
    /* This outer div ensures the ENTIRE screen turns dark */
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }} className="transition-colors duration-300">
        
        <div className="max-w-md mx-auto p-6 space-y-6">
            
            {/* PROFILE IMAGE */}
            <div className="flex flex-col items-center pt-8">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500" 
                     style={{ backgroundColor: "var(--input)" }}>
                    {image && <img src={image} className="w-full h-full object-cover" alt="Profile" />}
                </div>
                <input type="file" onChange={handleImage} className="mt-4 text-xs opacity-70" />
            </div>

            {/* NAME INPUT */}
            <div className="space-y-2">
                <label className="block font-medium opacity-80">Display Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ backgroundColor: "var(--card)", color: "var(--text)", borderColor: "var(--input)" }}
                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={saveName}
                    className="w-full mt-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
                >
                    Save Name
                </button>
            </div>

            {/* DARK MODE TOGGLE - Styled to match your screenshot */}
            <div className="flex justify-between items-center p-4 rounded-xl border" 
                 style={{ backgroundColor: "var(--card)", borderColor: "var(--input)" }}>
                <span className="font-medium">Dark Mode</span>
                <button
                    onClick={toggleDark}
                    className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${
                        dark ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                >
                    {dark ? "🌙 ON" : "☀️ OFF"}
                </button>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 space-y-3">
                <button onClick={logout} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg">
                    Logout
                </button>
                <button onClick={deleteAccount} className="w-full text-red-500 text-sm font-medium hover:underline">
                    Delete Account
                </button>
            </div>
        </div>
    </div>
);
}