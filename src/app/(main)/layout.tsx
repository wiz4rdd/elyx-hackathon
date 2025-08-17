"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MessageSquare, Bot, User, PanelLeft } from "lucide-react"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
             <Bot className="w-8 h-8 text-primary"/>
             <div className="flex flex-col">
                <h2 className="font-headline text-lg font-semibold">Elyx Visualizer</h2>
                <p className="text-sm text-muted-foreground -mt-1">Member Journey</p>
             </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard"}
                tooltip={{ children: "Dashboard" }}
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/chat"}
                tooltip={{ children: "Chat Simulation" }}
              >
                <Link href="/chat">
                  <MessageSquare />
                  <span>Chat Simulation</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/40x40.png" alt="Rohan Patel" data-ai-hint="man portrait" />
              <AvatarFallback>RP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">Rohan Patel</p>
              <p className="text-xs text-muted-foreground">Member</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10 md:hidden">
            <div className="flex items-center gap-2">
                <Bot className="w-7 h-7 text-primary"/>
                <h2 className="font-headline text-base font-semibold">Elyx Visualizer</h2>
            </div>
            <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
