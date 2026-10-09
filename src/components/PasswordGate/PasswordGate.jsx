"use client";

import { useActionState, useState } from "react";
import { unlockCaseStudies } from "@/app/case-studies/actions";

/**
 * The locked state of a password-protected case study. The page decides on the
 * server whether to render this or the detail (see src/lib/caseStudyAccess.js),
 * so the password and the gated content never reach a locked visitor.
 */
export default function PasswordGate() {
  const [state, formAction, pending] = useActionState(unlockCaseStudies, { error: false });
  // Hide the error once they start typing again; a new submission brings a new state.
  const [dismissedState, setDismissedState] = useState(null);
  const error = state.error && dismissedState !== state;

  return (
    <div className="flex flex-col items-center justify-center gap-8 rounded-[16px] bg-[#e2e6e7] px-5 py-20">
      <div className="flex max-w-[440px] flex-col items-center gap-2 text-center">
        <h2 className="font-ppmondwest text-[32px] leading-[1.25] text-[#484848]">
          The rest is password protected
        </h2>
        <p className="text-[14px] font-medium leading-[1.5] text-[#656565]">
          The screens and detail are for work that isn&apos;t public yet. If you&apos;re hiring and
          don&apos;t have the password,{" "}
          <a
            href="mailto:callumharrod1994@hotmail.co.uk?subject=Portfolio%20password"
            className="text-[#484848] underline underline-offset-2 hover:text-[#1a1a1a]"
          >
            email me
          </a>{" "}
          and I&apos;ll send it over.
        </p>
      </div>

      <form className="flex w-full max-w-[320px] flex-col gap-3" action={formAction}>
        <label htmlFor="case-study-password" className="sr-only">
          Password
        </label>
        <input
          id="case-study-password"
          name="password"
          autoComplete="current-password"
          aria-invalid={error || undefined}
          aria-describedby={error ? "case-study-password-error" : undefined}
          className={[
            "w-full rounded-[10px] border bg-white px-4 py-3 text-[14px] font-medium text-[#1a1a1a] outline-none transition-colors placeholder:text-[#b0b0b0]",
            error
              ? "border-red-300 focus:border-red-400"
              : "border-[#e0e0e0] focus:border-[#a0a0a0]",
          ].join(" ")}
          placeholder="Password"
          type="password"
          required
          onChange={() => {
            if (error) setDismissedState(state);
          }}
        />
        {error && (
          <p id="case-study-password-error" className="text-[13px] font-medium text-red-500">
            Incorrect password. Please try again.
          </p>
        )}
        <button
          className="w-full rounded-[10px] bg-[#1a1a1a] px-4 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-60"
          type="submit"
          disabled={pending}
        >
          {pending ? "Unlocking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}
