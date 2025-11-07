"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoIosMenu } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { Button } from "@/components/elements/button";
import { Logo } from "@/components/logo";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { LocaleSwitcher } from "../locale-switcher";

type Props = {
  leftNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  rightNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  logo: any;
  locale: string;
};

export const MobileNavbar = ({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });

  useEffect(() => {
    setMounted(true);
    if (open) {
      document.body.style.overflow = "hidden";
      setIsClosing(false);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 500);
  };

  const mobileMenu =
    (open || isClosing) && mounted
      ? createPortal(
          <div
            className="fixed inset-0 w-screen h-screen flex flex-col items-start justify-start space-y-10 pt-5 text-xl"
            style={{
              backgroundColor: "#000000",
              zIndex: 99999,
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: isClosing ? 0 : 1,
              transition: "opacity 0.5s ease-in-out",
              transform: isClosing ? "scale(0.95)" : "scale(1)",
            }}
          >
            <div className="flex items-center justify-between w-full px-5">
              <Logo locale={locale} image={logo?.image} />
              <div className="flex items-center space-x-2">
                <LocaleSwitcher currentLocale={locale} />
                <IoIosClose
                  className="h-8 w-8 text-white transition-transform hover:scale-110"
                  onClick={handleClose}
                />
              </div>
            </div>
            <div
              className="flex flex-col items-start justify-start gap-[14px] px-8"
              style={{
                transform: isClosing ? "translateX(-30px)" : "translateX(0)",
                opacity: isClosing ? 0 : 1,
                transition:
                  "transform 0.6s ease-out, opacity 0.5s ease-in-out",
                transitionDelay: isClosing ? "0s" : "0.2s",
              }}
            >
              {leftNavbarItems.map((navItem: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    transform: isClosing ? "translateX(-20px)" : "translateX(0)",
                    opacity: isClosing ? 0 : 1,
                    transition:
                      "transform 0.4s ease-out, opacity 0.4s ease-in-out",
                    transitionDelay: isClosing
                      ? `${idx * 50}ms`
                      : `${300 + idx * 120}ms`,
                  }}
                >
                  {navItem.children && navItem.children.length > 0 ? (
                    <>
                      {navItem.children.map(
                        (childNavItem: any, childIdx: number) => (
                          <Link
                            key={`child-${childIdx}`}
                            href={`/${locale}${childNavItem.URL}`}
                            onClick={handleClose}
                            className="relative max-w-[15rem] text-left text-2xl transition-colors hover:text-gray-300"
                          >
                            <span className="block text-white">
                              {childNavItem.text}
                            </span>
                          </Link>
                        )
                      )}
                    </>
                  ) : (
                    <Link
                      key={`nav-${idx}`}
                      href={`/${locale}${navItem.URL}`}
                      onClick={handleClose}
                      className="relative transition-colors hover:text-gray-300"
                    >
                      <span className="block text-[26px] text-white">
                        {navItem.text}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div
              className="flex flex-row w-full items-start gap-2.5 px-8 py-4"
              style={{
                transform: isClosing ? "translateY(30px)" : "translateY(0)",
                opacity: isClosing ? 0 : 1,
                transition:
                  "transform 0.5s ease-out, opacity 0.4s ease-in-out",
                transitionDelay: isClosing ? "0s" : "0.4s",
              }}
            >
              {rightNavbarItems.map((item, index) => (
                <Button
                  key={item.text}
                  variant={
                    index === rightNavbarItems.length - 1
                      ? "primary"
                      : "simple"
                  }
                  as={Link}
                  href={`/${locale}${item.URL}`}
                >
                  {item.text}
                </Button>
              ))}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div
      className={cn(
        "flex justify-between items-center w-full rounded-full px-2.5 py-1.5 transition duration-200 backdrop-blur-sm bg-black/20"
      )}
    >
      <Logo image={logo?.image} />
      <IoIosMenu
        className="text-gray-800 h-6 w-6 drop-shadow-lg"
        onClick={() => setOpen(!open)}
      />
      {mobileMenu}
    </div>
  );
};
