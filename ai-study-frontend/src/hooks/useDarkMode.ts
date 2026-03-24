import { useEffect, useState } from "react";

export default function useDarkMode() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("darkMode");
        if (saved === "true") {
            document.documentElement.classList.add("dark");
            setDark(true)
        }
    }, []);

    const toggleDark = () => {
        const newMode = !dark;
        setDark(newMode);
        if (newMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("darkMode", newMode.toString());
    };
    return { dark, toggleDark };
}