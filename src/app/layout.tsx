import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { AuthProvider } from '@/components/auth-provider'
import { WorkOrderProvider } from '@/contexts/WorkOrderContext'
import { CustomerProvider } from '@/contexts/CustomerContext'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ระบบจัดการงานซ่อม",
  description: "ระบบจัดการงานซ่อมสำหรับร้านคอมพิวเตอร์",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CustomerProvider>
              <WorkOrderProvider>
                {children}
                <Toaster />
              </WorkOrderProvider>
            </CustomerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 