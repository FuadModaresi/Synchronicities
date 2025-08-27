
"use client";

import { usePathname, Link } from "@/navigation";
import { cn } from "@/lib/utils";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  LayoutDashboard,
  Sparkles,
  Settings,
  HelpCircle,
  Wind,
} from "lucide-react";
import { useTranslations } from "next-intl";

export function SidebarNav() {
  const pathname = usePathname();
  const t = useTranslations('Sidebar');
  const { setOpenMobile, isMobile } = useSidebar();

  const isActive = (path: string) => pathname === path;

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="font-headline text-2xl font-bold">{t('title')}</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/")}
              tooltip={{ children: t('eventEntry') }}
              onClick={handleLinkClick}
            >
              <Link href="/">
                <Home />
                <span>{t('eventEntry')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard")}
              tooltip={{ children: t('dashboard') }}
              onClick={handleLinkClick}
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>{t('dashboard')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/zen-room")}
              tooltip={{ children: t('zenRoom') }}
              onClick={handleLinkClick}
            >
              <Link href="/zen-room">
                <Wind />
                <span>{t('zenRoom')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
                asChild 
                isActive={isActive('/help')}
                tooltip={{ children: t('help') }}
                onClick={handleLinkClick}
            >
              <Link href="/help">
                <HelpCircle />
                <span>{t('help')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isActive('/settings')}
                tooltip={{ children: t('settings') }}
                onClick={handleLinkClick}
            >
              <Link href="/settings">
                <Settings />
                <span>{t('settings')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
