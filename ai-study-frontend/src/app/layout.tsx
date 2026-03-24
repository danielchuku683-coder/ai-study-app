
import "./globals.css"
//import Navbar from "../components/Navbar"


export default function RootLayout({ children }: { children: React.ReactNode }) {

    const showSidebar = 
    typeof window !== "undefined" && 
    !window.location.pathname.includes("login") &&
    !window.location.pathname.includes("register")
return (
<html lang="en">
<body className="bg-white dark:bg-gray-900 text-black dark:text-white">
{children}
</body>
</html>
)
}