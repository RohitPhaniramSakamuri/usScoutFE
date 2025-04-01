"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    // icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 left-0 w-full mx-auto flex items-center justify-between border border-white/[0.2] bg-[#1A1A1C] shadow-lg pr-4 pl-8 py-2 z-[5000] lato-font mb-18",
          className
        )}
      >
        {/* Centered Navigation Links */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-4">
          {navItems.map((navItem, idx) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className="relative text-white flex space-x-1 hover:text-gray-300 lato-font transition-colors"
            >
              <span className="hidden sm:block text-xl mr-2 ml-2">{navItem.name}</span>
            </Link>
          ))}
        </div>

        {/* Right Section - Login Button */}
        <div className="ml-auto">
          <button className="border text-sm font-medium relative bg-[#4E4E50] border-white rounded-md text-white px-4 py-2 rounded-full">
            <span>Login</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingNav;
