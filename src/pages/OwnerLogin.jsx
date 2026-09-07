import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2, Lock, Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { OWNER_EMAIL_DEFAULT } from "@/lib/installLedger";
import { useOwner } from "@/lib/OwnerContext";

export default function OwnerLogin() {
  const navigate = useNavigate();
  const { login, isOwner } = useOwner();
  const [email, setEmail] = useState(OWNER_EMAIL_DEFAULT);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      subtitle="See every device that installed The Truth"
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
        <p className="text-xs text-white/80 text-center">
          Use the password you saved as PLATFORM_OWNER_PASSWORD. On this computer only, if that is not set, use{" "}
          <span className="font-semibold text-white">owner-local</span>.
        </p>
      </form>
    </AuthLayout>
  );
}
