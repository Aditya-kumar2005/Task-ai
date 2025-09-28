
'use client';

import { Suspense } from 'react';
import { SiteHeader } from '@/components/site-header';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardClient } from '@/components/dashboard-client';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Suspense fallback={
          <div className="space-y-8">
            <Skeleton className="h-[430px] w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        }>
          <DashboardClient />
        </Suspense>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        TaskAI - Your Intelligent Task Manager © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
