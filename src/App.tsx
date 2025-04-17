
import React, { useEffect } from "react";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { FloorPlanEditor } from "@/components/FloorPlanEditor";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { isRTL } from "@/i18n/config";

function App() {
  const { t, i18n } = useTranslation();
  
  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = isRTL() ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <DrawingProvider>
        <div className="min-h-screen flex flex-col">
          <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">{t('app.title')}</h1>
            <LanguageSwitcher />
          </header>
          <main className="flex-1 overflow-hidden">
            <FloorPlanEditor />
          </main>
        </div>
        <Toaster />
      </DrawingProvider>
    </ThemeProvider>
  );
}

export default App;
