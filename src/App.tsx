
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Suspense, useEffect } from "react";
import i18n from "./i18n";

// Layouts
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";

// Auth Pages
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import OTPForm from "./components/auth/OTPForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";

// Main Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import Music from "./pages/Music";

// Component for MusicPlayer
import MusicPlayer from "./components/music/MusicPlayer";

// Conditional music player component
const ConditionalMusicPlayer = () => {
  const location = useLocation();
  // Don't show music player on auth pages
  const isAuthPage = location.pathname.startsWith('/auth');
  
  if (isAuthPage) {
    return null;
  }
  
  return <MusicPlayer />;
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize language direction based on current language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Set language based on user's browser settings or geolocation
    const setLanguageFromBrowser = () => {
      const browserLang = navigator.language.split('-')[0];
      if (['en', 'ar', 'ru'].includes(browserLang)) {
        i18n.changeLanguage(browserLang);
      }
    };
    
    // Try to set language from browser
    setLanguageFromBrowser();
    
    // Listen for language changes
    window.addEventListener('languagechange', setLanguageFromBrowser);
    
    return () => {
      window.removeEventListener('languagechange', setLanguageFromBrowser);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <AuthProvider>
              <ThemeProvider>
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<LoginForm />} />
                    <Route path="signup" element={<SignupForm />} />
                    <Route path="otp" element={<OTPForm />} />
                    <Route path="forgot-password" element={<ForgotPasswordForm />} />
                  </Route>

                  {/* Main Routes */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Index />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="music" element={<Music />} />
                    {/* Add other routes here */}
                  </Route>

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* Conditional Music Player (Global component) */}
                <ConditionalMusicPlayer />
              </ThemeProvider>
            </AuthProvider>
          </BrowserRouter>
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
