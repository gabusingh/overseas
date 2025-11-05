"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Wallet, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Receipt,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Lock
} from "lucide-react";

interface CheckoutItem {
  id: string;
  type: "course" | "job_posting" | "trade_test" | "premium_subscription";
  name: string;
  description?: string;
  price: number;
  currency: string;
  duration?: string;
  provider?: string;
  image?: string;
}

interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  company?: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "bank_transfer" | "digital_wallet";
  name: string;
  description: string;
  icon: React.ReactNode;
  processingFee: number;
  isAvailable: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "UAE",
    postalCode: "",
    company: ""
  });
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: ""
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    processingFee: 0,
    tax: 0,
    total: 0
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      type: "card",
      name: "Credit/Debit Card",
      description: "Visa, MasterCard, American Express",
      icon: <CreditCard className="w-5 h-5" />,
      processingFee: 2.5, // percentage
      isAvailable: true
    },
    {
      id: "bank_transfer",
      type: "bank_transfer",
      name: "Bank Transfer",
      description: "Direct bank transfer (3-5 business days)",
      icon: <Building className="w-5 h-5" />,
      processingFee: 0,
      isAvailable: true
    },
    {
      id: "digital_wallet",
      type: "digital_wallet",
      name: "Digital Wallet",
      description: "Apple Pay, Google Pay, PayPal",
      icon: <Wallet className="w-5 h-5" />,
      processingFee: 1.5, // percentage
      isAvailable: true
    }
  ];

  useEffect(() => {
    initializeCheckout();
  }, []);

  useEffect(() => {
    calculateOrderSummary();
  }, [checkoutItems, selectedPaymentMethod]);

  const initializeCheckout = async () => {
    setLoading(true);
    try {
      // Get checkout items from URL params or session storage
      const itemType = searchParams.get("type");
      const itemId = searchParams.get("id");
      
      // Mock checkout items - replace with actual API call
      const mockItems: CheckoutItem[] = [];
      
      if (itemType === "course" && itemId) {
        mockItems.push({
          id: itemId,
          type: "course",
          name: "Advanced Welding Techniques",
          description: "6-month comprehensive welding certification program",
          price: 2500,
          currency: "AED",
          duration: "6 months",
          provider: "Dubai Technical Institute",
          image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=150&fit=crop"
        });
      } else if (itemType === "job_posting") {
        mockItems.push({
          id: itemId || "1",
          type: "job_posting",
          name: "Premium Job Posting",
          description: "30-day premium job listing with enhanced visibility",
          price: 299,
          currency: "AED",
          duration: "30 days",
          provider: "Overseas.ai"
        });
      } else if (itemType === "trade_test") {
        mockItems.push({
          id: itemId || "1",
          type: "trade_test",
          name: "Welding Trade Test",
          description: "Professional welding skills assessment",
          price: 350,
          currency: "AED",
          provider: "Emirates Trade Testing Center"
        });
      } else {
        // Default premium subscription
        mockItems.push({
          id: "premium_1",
          type: "premium_subscription",
          name: "Premium Subscription",
          description: "30 days premium access with advanced features",
          price: 199,
          currency: "AED",
          duration: "30 days",
          provider: "Overseas.ai"
        });
      }

      setCheckoutItems(mockItems);
      setSelectedPaymentMethod("card"); // Default payment method
    } catch (error) {
      console.error("Error initializing checkout:", error);
      toast.error("Failed to load checkout information");
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderSummary = () => {
    const subtotal = checkoutItems.reduce((sum, item) => sum + item.price, 0);
    
    const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
    const processingFee = selectedMethod ? (subtotal * selectedMethod.processingFee) / 100 : 0;
    
    const tax = subtotal * 0.05; // 5% VAT in UAE
    const total = subtotal + processingFee + tax;

    setOrderSummary({
      subtotal,
      processingFee,
      tax,
      total
    });
  };

  const handleBillingAddressChange = (field: keyof BillingAddress, value: string) => {
    setBillingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardDetailsChange = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return false;
    }

    if (!billingAddress.firstName || !billingAddress.lastName || !billingAddress.email) {
      toast.error("Please fill in all required billing information");
      return false;
    }

    if (selectedPaymentMethod === "card") {
      if (!cardDetails.cardNumber || !cardDetails.expiryMonth || !cardDetails.expiryYear || !cardDetails.cvv) {
        toast.error("Please fill in all card details");
        return false;
      }
    }

    if (!agreedToTerms) {
      toast.error("Please accept the terms and conditions");
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    try {
      // Mock payment processing - replace with actual payment API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const orderId = `ORD-${Date.now()}`;
      
      toast.success("Payment processed successfully!");
      
      // Redirect to success page
      router.push(`/checkout/success?orderId=${orderId}&total=${orderSummary.total}&currency=${checkoutItems[0]?.currency || 'AED'}`);
      
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - Overseas.ai</title>
        <meta name="description" content="Secure checkout and payment processing" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-600 mt-1">Complete your purchase securely</p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center bg-blue-50 border border-green-200 rounded-lg p-3">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 text-sm font-medium">
                Secure checkout protected by 256-bit SSL encryption
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!method.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => method.isAvailable && setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`mr-3 ${selectedPaymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'}`}>
                            {method.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {method.processingFee > 0 && (
                            <p className="text-xs text-gray-500">+{method.processingFee}% fee</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Card Details (if card payment selected) */}
              {selectedPaymentMethod === "card" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Card Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        placeholder="John Doe"
                        value={cardDetails.cardholderName}
                        onChange={(e) => handleCardDetailsChange("cardholderName", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardDetailsChange("cardNumber", e.target.value)}
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryMonth">Month</Label>
                        <select
                          id="expiryMonth"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          value={cardDetails.expiryMonth}
                          onChange={(e) => handleCardDetailsChange("expiryMonth", e.target.value)}
                        >
                          <option value="">MM</option>
                          {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="expiryYear">Year</Label>
                        <select
                          id="expiryYear"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          value={cardDetails.expiryYear}
                          onChange={(e) => handleCardDetailsChange("expiryYear", e.target.value)}
                        >
                          <option value="">YYYY</option>
                          {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                            <option key={year} value={year.toString()}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardDetailsChange("cvv", e.target.value)}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Billing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={billingAddress.firstName}
                        onChange={(e) => handleBillingAddressChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={billingAddress.lastName}
                        onChange={(e) => handleBillingAddressChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={billingAddress.email}
                      onChange={(e) => handleBillingAddressChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+971 50 123 4567"
                      value={billingAddress.phone}
                      onChange={(e) => handleBillingAddressChange("phone", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      placeholder="Company Name"
                      value={billingAddress.company}
                      onChange={(e) => handleBillingAddressChange("company", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={billingAddress.address}
                      onChange={(e) => handleBillingAddressChange("address", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Dubai"
                        value={billingAddress.city}
                        onChange={(e) => handleBillingAddressChange("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Emirate</Label>
                      <Input
                        id="state"
                        placeholder="Dubai"
                        value={billingAddress.state}
                        onChange={(e) => handleBillingAddressChange("state", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <select
                        id="country"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        value={billingAddress.country}
                        onChange={(e) => handleBillingAddressChange("country", e.target.value)}
                      >
                        <option value="UAE">United Arab Emirates</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Oman">Oman</option>
                        <option value="Bahrain">Bahrain</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        placeholder="00000"
                        value={billingAddress.postalCode}
                        onChange={(e) => handleBillingAddressChange("postalCode", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                      I agree to the{" "}
                      <button
                        type="button"
                        className="text-blue-600 underline"
                        onClick={() => window.open("/terms-condition", "_blank")}
                      >
                        Terms and Conditions
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        className="text-blue-600 underline"
                        onClick={() => window.open("/privacy-policy", "_blank")}
                      >
                        Privacy Policy
                      </button>
                      . I understand that my payment will be processed securely and I will receive confirmation via email.
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="w-5 h-5 mr-2" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="border-b pb-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-24 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          {item.provider && (
                            <p className="text-xs text-gray-500">{item.provider}</p>
                          )}
                          {item.duration && (
                            <Badge variant="outline" className="text-xs">
                              {item.duration}
                            </Badge>
                          )}
                        </div>
                        <p className="font-semibold text-gray-900">
                          {item.currency} {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  {/* Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>AED {orderSummary.subtotal.toFixed(2)}</span>
                    </div>
                    {orderSummary.processingFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Processing Fee</span>
                        <span>AED {orderSummary.processingFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">VAT (5%)</span>
                      <span>AED {orderSummary.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>AED {orderSummary.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#17487f] hover:bg-blue-700"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Complete Payment
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
                      <Shield className="w-3 h-3 mr-1" />
                      Secured by SSL encryption
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
