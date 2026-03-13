"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CalendarDays,
  Image as ImageIcon,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, shortcut: "⌘1" },
  { id: "members", label: "Membres", icon: Users, shortcut: "⌘2" },
  { id: "contributions", label: "Cotisations", icon: DollarSign, shortcut: "⌘3" },
  { id: "events", label: "Événements", icon: CalendarDays, shortcut: "⌘4" },
  { id: "gallery", label: "Galerie", icon: ImageIcon, shortcut: "⌘5" },
  { id: "announcements", label: "Annonces", icon: Megaphone, shortcut: "⌘6" },
  { id: "settings", label: "Paramètres", icon: Settings, shortcut: "⌘7" },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    window.location.href = "/login"
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-[#0A0A0A] border-r border-white/[0.06] z-40 flex flex-col transition-all duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo section */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <div className="w-10 h-10 shrink-0 relative group">
          <img
            src="/logos/eagles-logo.png"
            alt="Eagles Logo"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 rounded-full bg-[#D45902]/0 group-hover:bg-[#D45902]/10 transition-all duration-500" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-white leading-tight truncate">
              Club Eagles
            </h1>
            <p className="text-[10px] text-[#A0A0A0] truncate">
              Management System
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        {!collapsed && (
          <div className="mb-3 px-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#606060]">
              Navigation
            </span>
          </div>
        )}
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                    isActive
                      ? "bg-[#D45902] text-white shadow-lg shadow-[#D45902]/20"
                      : "text-[#A0A0A0] hover:bg-white/[0.04] hover:text-white"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full" />
                  )}
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-left">{item.label}</span>
                      <span className="text-[10px] text-[#606060] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.shortcut}
                      </span>
                    </>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User section */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D45902] to-[#F97316] flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Admin Eagles</p>
              <p className="text-[10px] text-[#606060] truncate">admin@eagles.com</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[#606060] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
              title="Se déconnecter"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Collapse button */}
      <div className="border-t border-white/[0.06] p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-[#606060] hover:bg-white/[0.04] hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-xs">Réduire</span>}
        </button>
      </div>
    </aside>
  )
}
