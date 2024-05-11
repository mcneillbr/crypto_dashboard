"use client";
import React from "react";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main
      role="main"
      style={{ minHeight: "78vh" }}
      className="flex-grow w-full sm:w-2/3 md:w-3/4 pt-1 px-2 bg-gray-100 dark:bg-gray-900 mx-auto"
    >
      {children}
    </main>
  );
}
