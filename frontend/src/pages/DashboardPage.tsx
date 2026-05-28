import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40 p-6">
      <header className="mb-8 flex items-center justify-between">
        <span className="text-lg font-semibold">react-auth-boilerplate</span>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Sign out
        </Button>
      </header>

      <main className="mx-auto w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.name} 👋</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between rounded-md border px-4 py-2">
              <span className="font-medium text-foreground">ID</span>
              <span className="font-mono">{user?.id}</span>
            </div>
            <div className="flex justify-between rounded-md border px-4 py-2">
              <span className="font-medium text-foreground">Email</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between rounded-md border px-4 py-2">
              <span className="font-medium text-foreground">Member since</span>
              <span>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-GB")
                  : "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            🚀 This page is protected by{" "}
            <code className="text-foreground">ProtectedRoute</code>.<br />
            Replace this content with your application.
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
