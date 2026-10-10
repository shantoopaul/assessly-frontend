"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

import type {
  GoogleButtonOptions,
  GoogleButtonText,
  GoogleCredentialResponse,
  GoogleIdConfiguration,
} from "@/types/auth";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_SCRIPT_ID = "google-identity-services";
const GOOGLE_BUTTON_WIDTH = 320;

type GoogleLoginButtonProps = {
  onCredential: (credential: string) => void;
  text?: GoogleButtonText;
  className?: string;
};

type ScriptState = "idle" | "loaded" | "error";

export function GoogleLoginButton({
  onCredential,
  text = "continue_with",
  className,
}: GoogleLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const credentialHandlerRef = useRef(onCredential);
  const [scriptState, setScriptState] = useState<ScriptState>("idle");

  useEffect(() => {
    credentialHandlerRef.current = onCredential;
  }, [onCredential]);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const renderButton = useCallback(() => {
	const container = containerRef.current;
	const accountsId = window.google?.accounts?.id;
  
	if (!clientId || !container || !accountsId) return;
  
	const config: GoogleIdConfiguration = {
	  client_id: clientId,
	  callback: (response: GoogleCredentialResponse) => {
		if (response.credential) {
		  credentialHandlerRef.current(response.credential);
		}
	  },
	  auto_select: false,
	  cancel_on_tap_outside: true,
	};
  
	accountsId.initialize(config);
  
	const options: GoogleButtonOptions = {
	  type: "standard",
	  theme: "outline",
	  size: "large",
	  text,
	  shape: "rectangular",
	  logo_alignment: "left",
	  width: GOOGLE_BUTTON_WIDTH,
	};
  
	accountsId.renderButton(container, options);
  }, [clientId, text]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      setScriptState("loaded");
    }
  }, []);

  useEffect(() => {
    if (scriptState === "loaded") renderButton();
  }, [scriptState, renderButton]);

  if (!clientId) return null;

  return (
    <div className={className}>
      <Script
        id={GOOGLE_SCRIPT_ID}
        src={GOOGLE_SCRIPT_SRC}
        strategy="afterInteractive"
        onLoad={() => setScriptState("loaded")}
        onError={() => setScriptState("error")}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {scriptState === "error" ? (
        <p className="mt-4 text-center text-xs text-destructive">
          Google Sign-In is currently unavailable. Please use email instead.
        </p>
      ) : (
        <div className="mt-4 flex w-full justify-center">
          <div ref={containerRef} />
        </div>
      )}
    </div>
  );
}