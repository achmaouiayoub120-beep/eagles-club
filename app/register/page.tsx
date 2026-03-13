"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"
import { ThemeToggle } from "@/components/theme-toggle"
import { SuccessAnimation } from "@/components/success-animation"

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: "Faible", color: "bg-red-500" }
  if (score <= 2) return { score: 2, label: "Moyen", color: "bg-amber-500" }
  if (score <= 3) return { score: 3, label: "Bon", color: "bg-blue-500" }
  return { score: 4, label: "Fort", color: "bg-emerald-500" }
}

export default function RegisterPage() {
  const router = useRouter()

  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [shakeForm, setShakeForm] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const [emailTouched, setEmailTouched] = useState(false)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const emailError = emailTouched && email.length > 0 && !email.includes("@") ? "Adresse email invalide" : ""
  const strength = password.length > 0 ? getPasswordStrength(password) : null

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrorMsg("")

      if (!nom || !prenom || !email || !password || !confirmPassword) {
        setErrorMsg("Veuillez remplir tous les champs")
        setShakeForm(true)
        setTimeout(() => setShakeForm(false), 600)
        return
      }

      if (!email.includes("@")) {
        setErrorMsg("Veuillez entrer une adresse email valide")
        setShakeForm(true)
        setTimeout(() => setShakeForm(false), 600)
        return
      }

      if (password.length < 6) {
        setErrorMsg("Le mot de passe doit contenir au moins 6 caracteres")
        setShakeForm(true)
        setTimeout(() => setShakeForm(false), 600)
        return
      }

      if (password !== confirmPassword) {
        setErrorMsg("Les mots de passe ne correspondent pas")
        setShakeForm(true)
        setTimeout(() => setShakeForm(false), 600)
        return
      }

      setIsLoading(true)
      await new Promise((r) => setTimeout(r, 1500))
      setShowSuccess(true)
    },
    [nom, prenom, email, password, confirmPassword]
  )

  const handleSuccessComplete = useCallback(() => {
    router.push("/login")
  }, [router])

  return (
    <div className="flex min-h-screen relative">
      {showSuccess && <SuccessAnimation onComplete={handleSuccessComplete} />}

      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <AnimatedBackground />

        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>

        <div
          className={`relative z-10 flex flex-col items-center px-12 text-center transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative w-28 h-28 mb-8 drop-shadow-2xl">
            <Image src="/est-school-logo.png" alt="EST Logo" fill className="object-contain" priority />
          </div>

          <h1 className="text-4xl font-bold text-white mb-3 text-balance leading-tight">
            Rejoignez-nous
          </h1>
          <p className="text-lg text-white/80 max-w-md leading-relaxed">
            Creez votre compte et commencez a gerer vos clubs efficacement
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {["Inscription rapide", "Acces complet", "Support 24/7"].map((feat) => (
              <span
                key={feat}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white/90"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col min-h-screen bg-background relative">
        <div className="lg:hidden absolute top-4 right-4 z-10">
          <ThemeToggle className="bg-muted/50 text-foreground border-border hover:bg-muted" />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div
            className={`w-full max-w-md transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } ${shakeForm ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
          >
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="relative w-16 h-16">
                <Image src="/est-school-logo.png" alt="EST Logo" fill className="object-contain" priority />
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground text-balance">Creer un compte</h2>
              <p className="text-muted-foreground mt-2 text-base leading-relaxed">
                Remplissez les informations ci-dessous pour vous inscrire
              </p>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 animate-[fade-in_0.3s_ease-out]">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <p className="text-sm font-medium text-destructive">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-5" noValidate>
              {/* Name row */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="reg-nom" className="block text-sm font-medium text-foreground mb-2">
                    Nom
                  </label>
                  <input
                    id="reg-nom"
                    type="text"
                    autoComplete="family-name"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    disabled={isLoading}
                    placeholder="Votre nom"
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground text-base placeholder:text-muted-foreground/60 transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 hover:border-foreground/30"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="reg-prenom" className="block text-sm font-medium text-foreground mb-2">
                    Prenom
                  </label>
                  <input
                    id="reg-prenom"
                    type="text"
                    autoComplete="given-name"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    disabled={isLoading}
                    placeholder="Votre prenom"
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground text-base placeholder:text-muted-foreground/60 transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 hover:border-foreground/30"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-foreground mb-2">
                  Adresse email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  disabled={isLoading}
                  placeholder="votre.email@est.com"
                  aria-invalid={!!emailError}
                  className={`w-full h-12 px-4 rounded-xl border bg-card text-foreground text-base placeholder:text-muted-foreground/60 transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 ${
                    emailError ? "border-destructive ring-2 ring-destructive/20" : "border-border hover:border-foreground/30"
                  }`}
                />
                {emailError && (
                  <p className="mt-1.5 text-xs text-destructive animate-[fade-in_0.2s_ease-out]">{emailError}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-foreground mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Minimum 6 caracteres"
                    className="w-full h-12 px-4 pr-12 rounded-xl border border-border bg-card text-foreground text-base placeholder:text-muted-foreground/60 transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 hover:border-foreground/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                    aria-label={showPassword ? "Masquer" : "Afficher"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {strength && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                            level <= strength.score ? strength.color : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reg-confirm" className="block text-sm font-medium text-foreground mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Retapez le mot de passe"
                  className={`w-full h-12 px-4 rounded-xl border bg-card text-foreground text-base placeholder:text-muted-foreground/60 transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 ${
                    confirmPassword.length > 0 && confirmPassword !== password
                      ? "border-destructive ring-2 ring-destructive/20"
                      : "border-border hover:border-foreground/30"
                  }`}
                />
                {confirmPassword.length > 0 && confirmPassword !== password && (
                  <p className="mt-1.5 text-xs text-destructive animate-[fade-in_0.2s_ease-out]">
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full h-12 rounded-xl bg-foreground text-background font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-foreground/10 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-70 disabled:pointer-events-none overflow-hidden mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Inscription en cours...
                  </span>
                ) : (
                  "S'inscrire"
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">ou</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Google */}
              <button
                type="button"
                disabled={isLoading}
                className="w-full h-12 rounded-xl border border-border bg-card text-foreground font-medium text-base flex items-center justify-center gap-3 transition-all duration-300 hover:bg-muted hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {"S'inscrire avec Google"}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              {"Vous avez deja un compte ? "}
              <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4 transition-all">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <footer className="py-4 text-center border-t border-border">
          <p className="text-xs text-muted-foreground">
            {"EST Club Management System - Ecole Superieure de Technologie"}
          </p>
        </footer>
      </div>
    </div>
  )
}
