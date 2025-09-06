"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { toast } from "sonner";
import { verifyOtpForLogin } from "../../../services/user.service";

function OtpForm() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const phoneParam = searchParams.get("phone");
    if (phoneParam) {
      setPhone(phoneParam);
    } else {
      router.push("/login");
    }
  }, [searchParams, router]);

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("otp", otp);
      
      const response = await verifyOtpForLogin(formData);
      
      if (response.data?.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login successful!");
        router.push("/my-profile");
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Verify OTP</CardTitle>
          <p className="text-center text-sm text-gray-600">
            Enter the OTP sent to {phone}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleOtpVerification} className="space-y-4">
            <div>
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
          
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push("/login")}
              className="text-sm"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OtpForm />
    </Suspense>
  );
}
