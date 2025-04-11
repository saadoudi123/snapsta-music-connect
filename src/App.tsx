
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize language direction based on current language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
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
                    {/* Add other routes here */}
                  </Route>

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ThemeProvider>
            </AuthProvider>
          </BrowserRouter>
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
