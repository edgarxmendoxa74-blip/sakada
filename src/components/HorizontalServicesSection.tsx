"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import FreelancerCard from "@/components/FreelancerCard";
import { type Freelancer } from "@/lib/types";

interface HorizontalServicesSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: LucideIcon;
  iconColor?: string;
  items: Freelancer[];
  onBook: (freelancer: Freelancer) => void;
}

export default function HorizontalServicesSection({
  title,
  subtitle,
  badge,
  icon: Icon,
  iconColor = "text-brand-orange bg-orange-50",
  items,
  onBook,
}: HorizontalServicesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollState, { passive: true });
      window.addEventListener("resize", updateScrollState);
      return () => {
        el.removeEventListener("scroll", updateScrollState);
        window.removeEventListener("resize", updateScrollState);
      };
    }
  }, [items, updateScrollState]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = Math.max(container.clientWidth * 0.75, 260);
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl p-2 shadow-xs ${iconColor}`}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-black tracking-tight text-gray-900 sm:text-2xl">
                {title}
              </h3>
              {badge && (
                <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs sm:text-sm font-bold text-gray-600">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="truncate text-xs text-gray-500 sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Top Desktop/Header Scroll Buttons */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-xs transition hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-xs transition hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Carousel Container with Touch-friendly Floating Arrows for Mobile & Desktop */}
      <div className="relative group">
        {/* Mobile/Overlay Left Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            className="absolute -left-2.5 sm:-left-3.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-md border border-gray-200 backdrop-blur-xs transition hover:bg-white active:scale-90"
          >
            <ChevronLeft className="h-5 w-5 text-brand-navy" />
          </button>
        )}

        {/* Mobile/Overlay Right Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            className="absolute -right-2.5 sm:-right-3.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-md border border-gray-200 backdrop-blur-xs transition hover:bg-white active:scale-90 animate-pulse hover:animate-none"
          >
            <ChevronRight className="h-5 w-5 text-brand-orange font-bold" />
          </button>
        )}

        {/* Horizontal Card Row - Optimized width for Mobile View (82vw / max 295px) */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-3 pt-1 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((freelancer) => (
            <div
              key={freelancer.id}
              className="w-[82vw] max-w-[295px] shrink-0 snap-start sm:w-[320px] sm:max-w-none"
            >
              <FreelancerCard freelancer={freelancer} onBook={onBook} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
