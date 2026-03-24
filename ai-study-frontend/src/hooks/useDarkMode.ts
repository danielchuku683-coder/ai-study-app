import { useEffect, useState } from "react";

export default function useDarkMode() {
    // Initial state set to false
    const [dark, setDark] = useState(false);

    // 1. Load the saved preference on mount
    useEffect(() => {
        const saved = localStorage.getItem("dark"); // Using "dark" to match ProfilePage
        if (saved === "true") {
            setDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    // 2. This ensures the HTML class always matches the state
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("dark", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("dark", "false");
        }
    }, [dark]);

    const toggleDark = () => {
        setDark((prev) => !prev);
    };

    return { dark, toggleDark };
}