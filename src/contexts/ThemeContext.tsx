
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import supabase from '@/lib/supabase';

type ThemeType = 'light' | 'dark' | 'comfort' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  resolvedTheme: 'light' | 'dark' | 'comfort';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark' | 'comfort'>('light');
  const { i18n } = useTranslation();
  const [userId, setUserId] = useState<string | null>(null);
  
  // Get the current user ID on mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user?.id || null);
    };
    
    getCurrentUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id || null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Helper function to determine and apply the correct theme
  const applyTheme = (newTheme: ThemeType) => {
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'comfort');

    // Apply the new theme
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
      setResolvedTheme(systemTheme);
    } else {
      document.documentElement.classList.add(newTheme);
      setResolvedTheme(newTheme as 'light' | 'dark' | 'comfort');
    }
  };

  // Initialize theme based on localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType || 'system';
    setThemeState(savedTheme);
    applyTheme(savedTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Fetch user's theme preference when user changes
  useEffect(() => {
    const fetchUserTheme = async () => {
      if (userId) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('theme')
            .eq('id', userId)
            .single();

          if (error) {
            console.error('Error fetching user theme preference:', error);
            return;
          }

          if (data && data.theme) {
            const userTheme = data.theme as ThemeType;
            setThemeState(userTheme);
            applyTheme(userTheme);
            localStorage.setItem('theme', userTheme);
          }
        } catch (error) {
          console.error('Error fetching user theme:', error);
        }
      }
    };

    fetchUserTheme();
  }, [userId, i18n.language]);

  // Function to set the theme
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Update user's theme preference in the database if logged in
    if (userId) {
      try {
        await supabase
          .from('profiles')
          .update({ theme: newTheme })
          .eq('id', userId);
      } catch (error) {
        console.error('Error updating user theme preference:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
