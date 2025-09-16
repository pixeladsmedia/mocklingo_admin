import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "./AdminSidebar"
import { AdminHeader } from "./AdminHeader"
import { ThemeProvider } from "@/components/providers/theme-provider"

export function AdminLayout({ children }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="mocklingo-admin-theme">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background relative">
          {/* Gradient Background */}
          <div className="fixed inset-0 bg-gradient-to-br from-mocklingo-dark via-secondary to-mocklingo-dark opacity-5 pointer-events-none" />
          
          <AdminSidebar />
          <div className="flex-1 flex flex-col relative z-10">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}
