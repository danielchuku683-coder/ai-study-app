"use client";

import { useState, useEffect } from "react";
import useDarkMode from "@/hooks/useDarkMode";

export default function ProfilePage() {
const [name, setName] = useState("");
const [image, setImage] = useState<string | null>(null);
const { dark, toggleDark } = useDarkMode();

// LOAD SAVED DATA
useEffect(() => {
const savedName = localStorage.getItem("name");
const savedImage = localStorage.getItem("image");

if (savedName) setName(savedName);
if (savedImage) setImage(savedImage);
}, []);

// SAVE NAME
const saveName = () => {
localStorage.setItem("name", name);
alert("Name saved");
};

// HANDLE IMAGE
const handleImage = (e: any) => {
const file = e.target.files[0];
if (file) {
const url = URL.createObjectURL(file);
setImage(url);
localStorage.setItem("image", url);
}
};

// LOGOUT
const logout = () => {
localStorage.removeItem("token");
window.location.href = "/login";
};

// DELETE ACCOUNT
const deleteAccount = async () => {
const confirmDelete = confirm("Delete account?");
if (!confirmDelete) return;

await fetch("http://localhost:5000/api/auth/delete", {
method: "DELETE",
});

localStorage.clear();
window.location.href = "/register";
};

return (
<div className="max-w-md mx-auto p-4 space-y-6">

{/* IMAGE */}
<div className="flex flex-col items-center">
<div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
{image && (
<img src={image} className="w-full h-full object-cover" />
)}
</div>

<input type="file" onChange={handleImage} className="mt-2" />
</div>

{/* NAME */}
<div>
<label>Name</label>
<input
value={name}
onChange={(e) => setName(e.target.value)}
className="w-full p-3 border rounded-lg dark:bg-gray-800"
/>
<button
onClick={saveName}
className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
>
Save
</button>
</div>

{/* DARK MODE */}
<div className="flex justify-between items-center">
<span>Dark Mode</span>
<button
onClick={toggleDark}
className="bg-gray-300 px-4 py-2 rounded"
>
{dark ? "🌙 ON" : "☀️ OFF"}
</button>
</div>

{/* LOGOUT */}
<button
onClick={logout}
className="w-full bg-blue-500 text-white py-3 rounded-lg"
>
Logout
</button>

{/* DELETE */}
<button
onClick={deleteAccount}
className="w-full bg-red-500 text-white py-3 rounded-lg"
>
Delete Account
</button>

</div>
);
}
