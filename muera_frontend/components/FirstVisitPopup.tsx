"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function FirstVisitPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("firstVisit");

  useEffect(() => {
    const hasVisited = localStorage.getItem("muera_has_visited");
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // 2 seconds delay
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("muera_has_visited", "true");
  };

  const handleCtaClick = () => {
    setIsOpen(false);
    localStorage.setItem("muera_has_visited", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-opacity">
      <div className="bg-[#1A1628] shadow-2xl max-w-4xl w-full flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-500 overflow-hidden rounded-xl md:rounded-none">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 text-[#F5F3EF]/60 hover:text-[#F5F3EF] transition-colors p-2 cursor-pointer"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[480px]">
          <Image
            src="/hero-suit.png"
            alt="MUERA Made-to-measure suit"
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1628] via-[#1A1628]/20 to-transparent md:hidden" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A1628]/20 to-[#1A1628] hidden md:block" />
        </div>

        <div className="w-full md:w-1/2 px-6 gap-y-2 md:gap-y-5 py-8 md:p-14 flex flex-col justify-center text-[#F5F3EF] z-10 relative">
          <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#C6A96B] mb-4">
            MUERA by Mueller Bespoke
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4 leading-tight text-[#F5F3EF]">
            {t("title")}
          </h2>
          <p className="text-[#F5F3EF]/70 mb-10 font-sans text-[15px] leading-relaxed">
            {t("description")}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              href="/configurator/studio"
              onClick={handleCtaClick}
              className="btn btn--primary-light w-full justify-center"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
