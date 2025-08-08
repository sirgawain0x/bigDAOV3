"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const EnvironmentCheck = () => {
  const [mounted, setMounted] = useState(false);
  const [serverConfig, setServerConfig] = useState<{adminKeyConfigured: boolean} | null>(null);
  
  useEffect(() => {
    setMounted(true);
    
    // Check server-side configuration
    fetch('/api/check-env')
      .then(res => res.json())
      .then(data => setServerConfig(data))
      .catch(err => console.error('Failed to check server config:', err));
  }, []);

  if (!mounted) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">Loading environment check...</div>
        </CardContent>
      </Card>
    );
  }

  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
  const authDomain = process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN;

  const getStatus = (value: string | undefined, name: string) => {
    if (!value) return { status: "Missing", color: "text-red-600" };
    if (value.length < 10) return { status: "Invalid", color: "text-red-600" };
    return { status: "Configured", color: "text-green-600" };
  };

  const clientIdStatus = getStatus(clientId, "Client ID");
  const authDomainStatus = getStatus(authDomain, "Auth Domain");

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Environment Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <strong>Client ID:</strong>{" "}
          <span className={clientIdStatus.color}>
            {clientIdStatus.status}
          </span>
        </div>
        <div className="text-sm">
          <strong>Auth Domain:</strong>{" "}
          <span className={authDomainStatus.color}>
            {authDomainStatus.status}
          </span>
        </div>
        <div className="text-sm">
          <strong>Admin Key:</strong>{" "}
          <span className={serverConfig?.adminKeyConfigured ? "text-green-600" : "text-red-600"}>
            {serverConfig === null ? "Checking..." : (serverConfig.adminKeyConfigured ? "Configured" : "Missing")}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Client-side variables must be &quot;Configured&quot; for proper functionality.
        </div>
      </CardContent>
    </Card>
  );
};
