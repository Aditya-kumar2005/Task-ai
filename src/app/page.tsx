
'use client';

import { useEffect } from 'react'; // Import useEffect
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, LanguagesIcon, BrainCircuit, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth
import placeholderImages from '@/app/lib/placeholder-images.json';

export default function LandingPage() {
  const { t } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth(); // Get auth state
  const router = useRouter();
  const heroImage = placeholderImages.landingPage.hero;

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const features = [
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary mb-4" />,
      title: "AI-Powered Subtasks",
      description: "Let our smart AI break down your complex tasks into manageable subtasks automatically.",
      dataAiHint: "ai brain"
    },
    {
      icon: <Zap className="h-10 w-10 text-primary mb-4" />,
      title: "Detailed Action Steps",
      description: "Get concise, AI-generated detailed steps for any task to guide you through completion.",
      dataAiHint: "lightning speed"
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary mb-4" />,
      title: "Priority & Due Dates",
      description: "Organize your workload effectively with task priorities and due date tracking.",
      dataAiHint: "checklist calendar"
    },
    {
      icon: <LanguagesIcon className="h-10 w-10 text-primary mb-4" />,
      title: "Multilingual Support",
      description: "Switch between English and Hindi for a more personalized experience.",
      dataAiHint: "language translation"
    }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your experience...</p>
      </div>
    );
  }

  // If user is authenticated, they will be redirected by useEffect. 
  // If they are not authenticated, the landing page will render.
  // We add this check to avoid rendering the landing page briefly before redirect.
  if (isAuthenticated) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 text-primary">
              {t('appTitle')} - Your Intelligent Task Manager
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Elevate your productivity with TaskAI. Effortlessly manage your tasks, get smart suggestions, and achieve your goals faster.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/signup">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Login</Link>
              </Button>
            </div>
             <div className="mt-16">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                width={heroImage.width}
                height={heroImage.height}
                className="rounded-lg shadow-xl mx-auto"
                data-ai-hint={heroImage.hint}
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-headline">
              Why Choose TaskAI?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-card p-8 rounded-xl shadow-lg text-center flex flex-col items-center hover:shadow-2xl transition-shadow duration-300">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-3 font-headline">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-headline">
              Ready to Supercharge Your Productivity?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of users who are already managing their tasks smarter, not harder.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/signup">
                Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        {t('footerText')} © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
