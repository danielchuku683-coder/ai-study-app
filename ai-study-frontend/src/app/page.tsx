import Link from "next/link";

export default function Home() {
return (
<div className="container">
<div className="card">
<h1 className="title">AI Study App 🚀</h1>
<p className="subtitle">Learn smarter, faster</p>

<Link href="/register">
<button className="button">Sign Up</button>
</Link>
</div>
</div>
);
}