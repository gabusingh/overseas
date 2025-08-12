"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { toast } from "sonner";
import { loginUsingPassword, loginUsingOtp } from "../../../services/user.service";

export default function LoginPage() {
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("password", password);
      
      const response = await loginUsingPassword(formData);
      
      if (response.data?.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login successful!");
        router.push("/my-profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("phone", phone);
      
      await loginUsingOtp(formData);
      toast.success("OTP sent successfully!");
      router.push(`/otp-verification?phone=${phone}`);
    } catch (error) {
      console.error("OTP request error:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={isOtpMode ? handleOtpRequest : handlePasswordLogin} className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            {!isOtpMode && (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isOtpMode ? "Send OTP" : "Sign In"}
            </Button>
          </form>
          
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsOtpMode(!isOtpMode)}
              className="text-sm"
            >
              {isOtpMode ? "Use password instead" : "Use OTP instead"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
