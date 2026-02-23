"use client";

import { useState, useEffect } from "react";

const SESSION_KEY = "pg_unlocked";

export default function PasswordGate({ password, children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === "1") setUnlocked(true);
    setHydrated(true);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (input === password) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  }

  if (!hydrated) return null;
  if (unlocked) return children;

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-[22px] font-semibold tracking-tight text-[#1a1a1a]">
          Password protected
        </h1>
        <p className="text-[14px] font-medium text-[#656565]">
          Enter the password to view this case study.
        </p>
      </div>

      <form className="flex w-full max-w-[320px] flex-col gap-3" onSubmit={handleSubmit}>
        <input
          autoComplete="current-password"
          autoFocus
          className={[
            "w-full rounded-[10px] border bg-white px-4 py-3 text-[14px] font-medium text-[#1a1a1a] outline-none transition-colors placeholder:text-[#b0b0b0]",
            error
              ? "border-red-300 focus:border-red-400"
              : "border-[#e0e0e0] focus:border-[#a0a0a0]",
          ].join(" ")}
          placeholder="Password"
          type="password"
          value={input}
          onChange={e => {
            setInput(e.target.value);
            if (error) setError(false);
          }}
        />
        {error && (
          <p className="text-[13px] font-medium text-red-500">
            Incorrect password. Please try again.
          </p>
        )}
        <button
          className="w-full rounded-[10px] bg-[#1a1a1a] px-4 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-80"
          type="submit"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
