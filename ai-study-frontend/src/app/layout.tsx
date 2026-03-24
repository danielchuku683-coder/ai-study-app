import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            {/* We use style here to force the background and text to use your 
               variables from globals.css. This covers the whole app.
            */}
            <body 
                style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }} 
                className="transition-colors duration-300"
            >
                {children}
            </body>
        </html>
    )
}