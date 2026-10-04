"use client";

import React, { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

/**
 * Apple Liquid Glass Card: Subtle translucent surface over black canvas
 */
export function GlassCard({
  children,
  className = "",
  hover = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`liquid-glass-card rounded-xl p-6 ${
        hover ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Apple Liquid Glass Panel
 */
export function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`liquid-glass-panel rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Tactile Monochrome Buttons with Liquid Glass feel
 */
interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function GlassButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: GlassButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-2.5 text-sm rounded-lg",
  };

  const variantClasses = {
    primary:
      "bg-white text-black font-semibold hover:bg-zinc-200 active:bg-zinc-300 shadow-sm",
    secondary:
      "liquid-glass-control text-white border border-white/10 hover:border-white/20 active:bg-white/10",
    ghost:
      "text-[#a1a1aa] hover:text-white hover:bg-white/[0.06]",
    danger:
      "bg-zinc-900 text-zinc-300 border border-white/10 hover:text-white hover:border-red-500/30",
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30 select-none cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Liquid Glass Input
 */
interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function GlassInput({
  label,
  error,
  className = "",
  id,
  ...props
}: GlassInputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium uppercase tracking-wider text-[#a1a1aa] mb-1.5 select-none">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`liquid-glass-input block w-full rounded-lg px-3 py-2 text-sm focus:outline-none ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-zinc-400 font-medium">{error}</p>}
    </div>
  );
}

/**
 * Liquid Glass Textarea
 */
interface GlassTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function GlassTextarea({
  label,
  error,
  className = "",
  id,
  ...props
}: GlassTextareaProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium uppercase tracking-wider text-[#a1a1aa] mb-1.5 select-none">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`liquid-glass-input block w-full rounded-lg px-3 py-2 text-sm resize-y leading-relaxed focus:outline-none ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-zinc-400 font-medium">{error}</p>}
    </div>
  );
}

/**
 * Apple Liquid Glass Modal
 */
export function GlassModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-xl",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        className={`relative w-full ${maxWidth} liquid-glass border border-white/12 rounded-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          {title && <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>}
          <button
            onClick={onClose}
            className="text-[#a1a1aa] hover:text-white text-xs font-medium px-2.5 py-1 rounded-md hover:bg-white/[0.08] transition-colors ml-auto cursor-pointer"
            aria-label="Close"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
