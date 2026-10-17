"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";

type GoogleButtonText =
  | "signin_with"
  | "signup_with"
  | "continue_with"
  | "signin";

type GoogleLoginComponentProps = {
  text?: GoogleButtonText;
};

export default function GoogleLoginComponent({
  text = "continue_with",
}: GoogleLoginComponentProps) {
  const { googleLogin } = useAuth();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) return null;

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    const credential = credentialResponse.credential;
    if (!credential) return;

    googleLogin({ credential });
  };

  return (
    <div>
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
          theme="outline"
          text={text}
          size="large"
          shape="rectangular"
          logo_alignment="left"
          width="320"
          onSuccess={handleGoogleSuccess}
          onError={() => {
          }}

        />
      </div>
    </div>
  );
}