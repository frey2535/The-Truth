import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2, Lock, Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { googleSignInOriginHint, resolveGoogleClientId } from "@/lib/googleIdentity";
import { OWNER_EMAIL_DEFAULT } from "@/lib/installLedger";
import { useOwner } from "@/lib/OwnerContext";

export default function OwnerLogin() {
  const navigate = useNavigate();
  const { login, isOwner } = useOwner();
  const [email, setEmail] = useState(OWNER_EMAIL_DEFAULT);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    resolveGoogleClientId()
      .then((id) => {
        if (!cancelled) setGoogleReady(Boolean(id));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (isOwner) return <Navigate to="/owner/downloads" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/owner/downloads", { replace: true });
    } catch (err) {
      setError(err.message || "Owner sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      variant="dark"
      icon={KeyRound}
      title="Platform owner"
      subtitle={`Sign in as ${OWNER_EMAIL_DEFAULT} to use the app as owner and see every install`}
      footer={
        <>
          Regular readers use{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {error ? (
        <div className="mb-4 p-3 rounded-lg bg-red-950/70 text-red-100 text-sm">{error}</div>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <div className="space-y-2">
          <Label htmlFor="owner-email" className="text-white">
            Owner email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" aria-hidden="true" />
            <Input
              id="owner-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 text-white border-white/40 placeholder:text-white/50"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-password" className="text-white">
            Owner password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" aria-hidden="true" />
            <Input
              id="owner-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12 text-white border-white/40 placeholder:text-white/50"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium bg-[#f3e9c8] text-[#2b2620] hover:bg-white" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "View downloads"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 text-sm font-medium bg-white/10 text-white border-white/40 hover:bg-white/20"
          disabled={loading || !googleReady}
          onClick={async () => {
            setError("");
            setLoading(true);
            try {
              await base44.auth.loginWithProvider("google", "/owner/downloads");
            } catch (err) {
              const hint = googleSignInOriginHint();
              setError([err.message || "Google sign-in is not available", hint].filter(Boolean).join(" "));
              setLoading(false);
            }
          }}
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <GoogleIcon className="w-5 h-5 mr-2" />}
          Continue with Google
        </Button>
        <p className="text-xs text-white/80 text-center">
          Use <span className="font-semibold text-white">{OWNER_EMAIL_DEFAULT}</span> with Google, or the
          password saved as PLATFORM_OWNER_PASSWORD. On this computer only, if that is not set, use{" "}
          <span className="font-semibold text-white">owner-local</span>.
        </p>
      </form>
    </AuthLayout>
  );
}
