'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Wallet,
  Smartphone,
  Building
} from 'lucide-react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  applications: number;
  validity: string;
  features: string[];
  popular?: boolean;
  discount?: string;
}

interface PaymentFormProps {
  onSuccess?: (paymentData: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
  selectedPlan?: PaymentPlan;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
}

const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 99,
    originalPrice: 149,
    currency: 'INR',
    applications: 10,
    validity: '30 days',
    features: [
      '10 Job Applications',
      'Profile Verification',
      'Basic Support',
      '100% Refund on Rejection*'
    ],
    discount: '33% OFF'
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 299,
    originalPrice: 499,
    currency: 'INR',
    applications: 50,
    validity: '90 days',
    features: [
      '50 Job Applications',
      'Priority Profile Review',
      'Premium Support',
      'Interview Preparation',
      '100% Refund on Rejection*'
    ],
    popular: true,
    discount: '40% OFF'
  },
  {
    id: 'pro',
    name: 'Professional Plan',
    price: 599,
    originalPrice: 999,
    currency: 'INR',
    applications: 100,
    validity: '180 days',
    features: [
      '100 Job Applications',
      'Dedicated Account Manager',
      '24/7 Premium Support',
      'CV Enhancement Service',
      'Interview Guarantee*',
      '100% Refund on Rejection*'
    ],
    discount: '40% OFF'
  }
];

export default function PaymentForm({
  onSuccess,
  onError,
  onClose,
  selectedPlan: propSelectedPlan,
  userEmail = '',
  userPhone = '',
  userName = ''
}: PaymentFormProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>(
    propSelectedPlan || PAYMENT_PLANS[0]
  );
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: userEmail,
    phone: userPhone,
    name: userName,
    acceptTerms: false
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Valid phone number is required');
      return false;
    }
    if (!formData.acceptTerms) {
      setError('Please accept terms and conditions');
      return false;
    }
    return true;
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    setError('');

    try {
      // Create order on backend (simulate for now)
      const orderData = {
        amount: selectedPlan.price * 100, // Convert to paise
        currency: selectedPlan.currency,
        receipt: `order_${Date.now()}`,
        notes: {
          plan_id: selectedPlan.id,
          plan_name: selectedPlan.name,
          user_email: formData.email,
          user_phone: formData.phone
        }
      };

      // In real implementation, call your backend to create Razorpay order
      // const response = await fetch('/api/create-payment-order', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });
      // const order = await response.json();

      // Simulate order creation
      const order = {
        id: `order_${Date.now()}`,
        amount: orderData.amount,
        currency: orderData.currency,
        receipt: orderData.receipt
      };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_key',
        amount: order.amount,
        currency: order.currency,
        name: 'Overseas.ai',
        description: `${selectedPlan.name} - ${selectedPlan.applications} Applications`,
        image: '/logo.png',
        order_id: order.id,
        handler: function (response: any) {
          // Payment successful
          const paymentData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            plan: selectedPlan,
            user: formData
          };

          // Verify payment on backend
          // verifyPayment(paymentData);
          
          // For now, simulate success
          setTimeout(() => {
            onSuccess?.(paymentData);
            router.push(`/payment-success?transaction_id=${response.razorpay_payment_id}&amount=${selectedPlan.price}&plan_name=${selectedPlan.name}`);
          }, 1000);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        notes: orderData.notes,
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        
        razorpay.on('payment.failed', function (response: any) {
          setError(`Payment failed: ${response.error.description}`);
          setIsProcessing(false);
          onError?.(response.error);
          router.push(`/payment-failed?error_code=${response.error.code}&error_message=${response.error.description}&amount=${selectedPlan.price}`);
        });

        razorpay.open();
      } else {
        throw new Error('Razorpay SDK not loaded');
      }
    } catch (error: any) {
      setError(error.message || 'Payment initialization failed');
      setIsProcessing(false);
      onError?.(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
        <p className="text-gray-600">Unlock unlimited job opportunities with our premium plans</p>
      </div>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {PAYMENT_PLANS.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative cursor-pointer transition-all duration-300 ${
              selectedPlan.id === plan.id 
                ? 'ring-2 ring-blue-500 shadow-lg transform scale-105' 
                : 'hover:shadow-md'
            } ${plan.popular ? 'border-blue-200' : ''}`}
            onClick={() => setSelectedPlan(plan)}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                Most Popular
              </Badge>
            )}
            {plan.discount && (
              <Badge variant="destructive" className="absolute -top-3 -right-3">
                {plan.discount}
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-blue-600">₹{plan.price}</span>
                  {plan.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">₹{plan.originalPrice}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Valid for {plan.validity}</p>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-gray-900">
                  {plan.applications} Job Applications
                </div>
              </div>
              
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          {/* Payment Methods */}
          <div>
            <Label className="text-base font-semibold mb-4 block">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="w-4 h-4" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer">
                    <Building className="w-4 h-4" />
                    Net Banking
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="w-4 h-4" />
                    UPI
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{selectedPlan.name}</span>
                <span>₹{selectedPlan.price}</span>
              </div>
              {selectedPlan.originalPrice && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Discount</span>
                  <span className="text-green-600">
                    -₹{selectedPlan.originalPrice - selectedPlan.price}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{selectedPlan.price}</span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={formData.acceptTerms}
              onChange={(e) => handleFormChange('acceptTerms', e.target.checked)}
              className="mt-1"
            />
            <Label htmlFor="terms" className="text-sm cursor-pointer">
              I agree to the{' '}
              <a href="/terms-condition" className="text-blue-600 hover:underline">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </Label>
          </div>

          {/* Error Message */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Payment Button */}
          <Button 
            onClick={handleRazorpayPayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Pay ₹{selectedPlan.price} Securely
              </>
            )}
          </Button>

          {/* Security Note */}
          <div className="text-center text-sm text-gray-600 mt-4">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secured by Razorpay • 256-bit SSL encryption</span>
            </div>
            <p className="mt-2">
              * Refund applicable only on job application rejections as per our refund policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
