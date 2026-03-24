import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                {/* This tiny script prevents the "white flash" when you refresh the page */}
                <script dangerouslySetInnerHTML={{
                    __html: `
                        if (localStorage.getItem('dark') === 'true') {
                            document.documentElement.classList.add('dark');
                        }
                    `,
                }} />
            </head>
            <body 
                style={{ 
                    backgroundColor: "var(--bg)", 
                    color: "var(--text)", 
                    minHeight: "100vh",
                    margin: 0 
                }}
            >
                {children}
            </body>
        </html>
    )
}