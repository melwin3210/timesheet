import { Providers } from './providers';
import "./globals.css";

export const metadata = {
  title: "Timesheet Management System",
  description: "Task assignment and timesheet tracking system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
