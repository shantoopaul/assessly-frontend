"use client";

import { GoogleLogin } from "@react-oauth/google";

type GoogleButtonText =
  | "signin_with"
  | "signup_with"
  | "continue_with"
  | "signin";

type GoogleLoginButtonProps = {
  onCredential: (credential: string) => void;
  text?: GoogleButtonText;
  className?: string;
};

export function GoogleLoginButton({
  onCredential,
  text = "continue_with",
  className,
}: GoogleLoginButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) return null;

  return (
    <div className={className}>
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

      <div className="mt-4 flex w-full justify-center">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              onCredential(credentialResponse.credential);
            }
          }}
          onError={() => {
            console.error("Google sign-in popup was cancelled or failed");
          }}
          text={text}
          theme="outline"
          size="large"
          shape="rectangular"
          logo_alignment="left"
          width="320"
        />
      </div>
    </div>
  );
}