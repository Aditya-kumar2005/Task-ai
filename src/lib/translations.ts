
import type { Locale, Translations } from '@/types';

export const translations: Record<Locale, Translations> = {
  en: {
    appTitle: 'TaskAI',
    createTaskButton: 'Create Task & Get AI Subtask Suggestions',
    noTasksYetHeading: 'No tasks yet!',
    noTasksYetDescription: 'Create your first task to get started.',
    switchToHindi: 'हिंदी में बदलें',
    switchToEnglish: 'Switch to English',
    siteDescription: 'Manage your tasks efficiently with AI-powered subtask suggestions.',
    footerText: 'TaskAI - Your Intelligent Task Manager',
  },
  hi: {
    appTitle: 'टास्कAI',
    createTaskButton: 'कार्य बनाएं और AI उपकार्य सुझाव पाएं',
    noTasksYetHeading: 'अभी कोई कार्य नहीं है!',
    noTasksYetDescription: 'शुरू करने के लिए अपना पहला कार्य बनाएं।',
    switchToHindi: 'हिंदी में बदलें',
    switchToEnglish: 'Switch to English',
    siteDescription: 'AI-संचालित उपकार्य सुझावों के साथ अपने कार्यों को कुशलतापूर्वक प्रबंधित करें।',
    footerText: 'टास्कAI - आपका इंटेलिजेंट टास्क मैनेजर',
  },
};

export const defaultLocale: Locale = 'en';
