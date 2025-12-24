'use client';

import { Menu, Bell, User, Settings, LogOut } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle, Avatar, DropdownMenu, DropdownItem, DropdownDivider } from '@/components/ui';
import { Breadcrumb } from './Breadcrumb';
import Link from 'next/link';

export function Header() {
  const { toggleMobile } = useSidebarStore();
  const { profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 sm:px-6 bg-[var(--surface)] border-b border-[var(--border)]">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobile}
          className="p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--background)] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Breadcrumb />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />

        <button className="relative p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--background)]">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--danger)] rounded-full" />
        </button>

        <DropdownMenu
          trigger={
            <button className="flex items-center gap-2 p-1 rounded-md hover:bg-[var(--background)] transition-colors">
              <Avatar
                src={profile?.avatar_url}
                name={profile?.full_name || 'User'}
                size="sm"
              />
              <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)]">
                {profile?.full_name || 'User'}
              </span>
            </button>
          }
        >
          <div className="px-3 py-2 border-b border-[var(--border)]">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">{profile?.email}</p>
          </div>
          <Link href="/settings">
            <DropdownItem>
              <User className="h-4 w-4" />
              My Profile
            </DropdownItem>
          </Link>
          <Link href="/settings">
            <DropdownItem>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownItem>
          </Link>
          <DropdownDivider />
          <DropdownItem variant="danger" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownItem>
        </DropdownMenu>
      </div>
    </header>
  );
}
