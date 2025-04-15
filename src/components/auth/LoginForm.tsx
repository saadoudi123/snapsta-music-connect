
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signInWithEmail, loading } = useAuth();

  const loginSchema = z.object({
    email: z.string().email(t('auth.errors.invalidEmail')),
    password: z.string().min(6, t('auth.errors.shortPassword')),
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await signInWithEmail(values.email, values.password);
      toast({
        title: t('auth.loginSuccess'),
        description: t('auth.welcomeBack'),
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('errors.error'),
        description: t('auth.errors.loginFailed'),
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('auth.login')}
        </h1>
        <p className="text-muted-foreground">
          {t('auth.loginToAccount')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.email')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('auth.enterEmail')}
                    type="email"
                    autoComplete="email"
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.password')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={t('auth.enterPassword')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 pr-10 rounded-md"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-1 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300" 
            disabled={loading}
          >
            <LogIn className="mr-2 h-4 w-4 group-hover:animate-bounce" />
            {loading ? t('common.loading') : t('auth.login')}
          </Button>
        </form>
      </Form>

      <div className="text-center space-y-2">
        <div>
          <Link
            to="/auth/forgot-password"
            className="text-sm underline-offset-4 hover:underline text-primary transition-colors"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>
        <div>
          <Link
            to="/auth/signup"
            className="text-sm underline-offset-4 hover:underline text-primary transition-colors"
          >
            {t('auth.noAccount')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
