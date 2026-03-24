import Link from "next/link";
import Sidebar from "@/components/Sidebar";
export default function AppLayout({ children }: { children: React.ReactNode }) {
return (
<div className="flex flex-col md:flex-row">

{/* Sidebar (desktop only) */}
<div className="hidden md:block">
<Sidebar/>
</div>

{/* Mobile Top Bar */}
<div className="md:hidden p-4 bg-white shadow">
<h1 className="text-lg font-bold">AI Study</h1>
</div>

{/* Main Content */}
<div className="flex-1 p-4 md:p-10 bg-gray-100 min-h-screen pb-20">
{children}
</div>

{/* 👇 THIS IS WHERE YOUR BOTTOM NAV GOES */}
<div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 md:hidden text-sm">

<Link href="/dashboard" className="flex flex-col items-center">
🏠
<span>Home</span>
</Link>

<Link href="/quiz" className="flex flex-col items-center">
🧠
<span>Quizzes</span>
</Link>

<Link href="/upload" className="flex flex-col items-center">
⬆️
<span>Upload</span>
</Link>

<Link href="/profile" className="flex flex-col items-center">
👤
<span>Profile</span>
</Link>

</div>

</div>
);
}
