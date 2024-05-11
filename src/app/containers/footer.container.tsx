"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="space-y-4 py-4 bg-zinc-800 flex flex-col flex-nowrap items-center mt-auto">
      <div>
        <ul
          role="none"
          className="text-sm text-slate-500 flex flex-row flex-nowrap py-1"
        >
          <li
            role="menuitem"
            className="cursor-not-allowed text-left underline mx-4"
          >
            Cookies
          </li>
          <li
            role="menuitem"
            className="cursor-not-allowed text-left underline mx-4"
          >
            Legal
          </li>
          <li
            role="menuitem"
            className="cursor-not-allowed text-left underline mx-4"
          >
            Community Participation Guidelines
          </li>
        </ul>
      </div>
    </footer>
  );
}
