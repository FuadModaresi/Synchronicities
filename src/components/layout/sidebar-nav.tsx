"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  LayoutDashboard,
  Sparkles,
  Settings,
  HelpCircle,
} from "lucide-react";

export function SidebarNav() {
  const t = useTranslations('Sidebar');
  const locale = useLocale();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === `/${locale}${path}`;

  return (
    <>
      <SidebarHeader>
        <Link href={`/${locale}`} className="flex items-center gap-2">
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
            >
              <Link href={`/${locale}`}>
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
            >
              <Link href={`/${locale}/dashboard`}>
                <LayoutDashboard />
                <span>{t('dashboard')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <HelpCircle />
              <span>{t('help')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings />
              <span>{t('settings')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
