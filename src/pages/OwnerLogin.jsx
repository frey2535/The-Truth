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
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="owner-email">Owner email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="owner-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-password">Owner password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="owner-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "View downloads"
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          On this computer, if no owner password is set, use <span className="font-medium text-[#2b2620]">owner-local</span>.
        </p>
      </form>
    </AuthLayout>
  );
}
