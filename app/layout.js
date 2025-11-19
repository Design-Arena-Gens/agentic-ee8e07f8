export const metadata = {
  title: "Albania Goals Composer",
  description: "Upload goal clips and generate a combined video"
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <img src="/albania.svg" alt="Albania" className="logo" />
            <div>
              <h1>Albania - All Goals Video</h1>
              <p className="sub">Compose your own highlight reel</p>
            </div>
          </header>
          <main>{children}</main>
          <footer className="footer">Built for instant composing in your browser</footer>
        </div>
      </body>
    </html>
  );
}
