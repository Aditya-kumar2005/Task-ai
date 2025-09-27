
'use client';

import { ListTodo, Languages, LogOut, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { locale, setLocale, t } = useLanguage();
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth(); // Get auth state and logout function

  const toggleLanguage = () => {
    setLocale(prevLocale => (prevLocale === 'en' ? 'hi' : 'en'));
  };

  const getInitials = (email?: string) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <header className="py-4 md:py-6 border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between gap-2">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <ListTodo className="h-7 w-7 md:h-8 md:w-8 text-primary group-hover:animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-primary group-hover:text-primary/80 transition-colors">
            {t('appTitle')}
          </h1>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="outline" size="sm" onClick={toggleLanguage} className="h-9 px-3 text-xs md:text-sm">
            <Languages className="mr-1 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
            {locale === 'en' ? t('switchToHindi') : t('switchToEnglish')}
          </Button>

          {!authLoading && (
            <>
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full">
                      <Avatar className="h-9 w-9 md:h-10 md:w-10">
                        {/* Placeholder for user avatar image if available */}
                        {/* <AvatarImage src={user.avatarUrl} alt={user.name} /> */}
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Logged in as</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Add more items like Profile, Settings here */}
                    {/* <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm" className="text-xs md:text-sm">
                    <Link href="/login">
                      <LogIn className="mr-1 md:mr-2 h-4 w-4" /> Login
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm">
                    <Link href="/signup">
                     <UserPlus className="mr-1 md:mr-2 h-4 w-4" /> Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
          {authLoading && (
            <div className="h-9 w-20 animate-pulse bg-muted rounded-md"></div>
          )}
        </div>
      </div>
    </header>
  );
}
