"use client"

import Image from 'next/image';
import Link from 'next/link';
import { EyeOff, Laptop, Loader2 } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

export default function LoginPage() {
  const {formData, handleInputChange, handleSubmit, isLoginLoading, isLoginError, loginError} = useAuth();

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#0a0a0b] text-white">
      {/* Left Side: Hero Image & Branding */}
      <div className="relative hidden w-1/2 md:flex flex-col justify-between p-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/bg1.jpeg" // Replace with your coastal town image
            alt="Coastal destination at sunset"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
            <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center">
               <span className="text-[10px] font-bold">W</span>
            </div>
          </div>
          <span className="text-xl font-semibold tracking-tight">Wanderly. final test</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Manage the worlds most extraordinary destinations.
          </h1>
          <p className="text-lg text-gray-200 opacity-90">
            Access your admin dashboard to orchestrate unforgettable journeys.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center p-8 md:p-24">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-gray-400">
              Please enter your details to sign in to your workspace.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                className="w-full rounded-xl border border-gray-800 bg-[#161618] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <Link href="#" className="text-sm text-blue-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type="password"
                  className="w-full rounded-xl border border-gray-800 bg-[#161618] px-4 py-3 pr-12 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <EyeOff size={18} />
                </button>
              </div>
            </div>

            <button 
              disabled={isLoginLoading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
              {isLoginLoading ? <Loader2 size={18} className="animate-spin" /> : "Sign in with Email"}
            </button>
          </form>

          {isLoginError && <p className="text-red-500 text-center text-sm">{loginError as string | null}</p>}

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0b] px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-[#161618] py-3 hover:bg-gray-800 transition-all">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                />
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-[#161618] py-3 hover:bg-gray-800 transition-all">
              <Laptop size={18} className="text-gray-400" />
              <span className="text-sm font-medium">SSO</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Dont have an account?{' '}
            <Link href="#" className="font-medium text-white hover:underline">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}