"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

interface User {
  id: number;
  type: string;
  email: string;
  phone: string;
  name?: string;
}

export default function MyProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      router.push("/login");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">User Type</p>
              <Badge variant={user.type === "person" ? "default" : "secondary"}>
                {user.type}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-gray-900">{user.phone}</p>
            </div>
            
            {user.name && (
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-gray-900">{user.name}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/applied-jobs">View Applied Jobs</Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/saved-jobs">Saved Jobs</Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/my-documents">My Documents</Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/notifications">Notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
