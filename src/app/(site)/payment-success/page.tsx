'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Mail, CreditCard, Calendar, User } from 'lucide-react';

interface PaymentDetails {
  transactionId: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  date: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  planDuration: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get payment details from URL params or API
    const transactionId = searchParams.get('transaction_id');
    const sessionId = searchParams.get('session_id');
    
    if (transactionId || sessionId) {
      // Simulate API call to get payment details
      setTimeout(() => {
        setPaymentDetails({
          transactionId: transactionId || 'TXN_' + Date.now(),
          amount: searchParams.get('amount') || '29.99',
          currency: searchParams.get('currency') || 'USD',
          paymentMethod: searchParams.get('payment_method') || 'Credit Card',
          date: new Date().toLocaleDateString(),
          customerName: searchParams.get('customer_name') || 'John Doe',
          customerEmail: searchParams.get('customer_email') || 'john@example.com',
          planName: searchParams.get('plan_name') || 'Premium Plan',
          planDuration: searchParams.get('plan_duration') || '1 Month'
        });
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Processing payment confirmation...</p>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Payment Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the payment details.</p>
            <Link href="/">
              <Button className="w-full">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for your payment. Your transaction has been processed successfully.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-6 h-6 mr-2" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transaction Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">
                      Transaction ID
                    </label>
                    <p className="text-lg font-mono text-gray-800">
                      {paymentDetails.transactionId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">
                      Payment Date
                    </label>
                    <p className="text-lg text-gray-800 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {paymentDetails.date}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">
                      Amount Paid
                    </label>
                    <p className="text-2xl font-bold text-green-600">
                      {paymentDetails.currency} {paymentDetails.amount}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">
                      Payment Method
                    </label>
                    <Badge variant="outline" className="text-sm">
                      {paymentDetails.paymentMethod}
                    </Badge>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Name
                      </label>
                      <p className="text-gray-800">{paymentDetails.customerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Email
                      </label>
                      <p className="text-gray-800">{paymentDetails.customerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Plan Details</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {paymentDetails.planName}
                    </h4>
                    <p className="text-blue-600">Duration: {paymentDetails.planDuration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href="/my-profile">
                    <User className="w-4 h-4 mr-2" />
                    View My Profile
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Receipt
                </Button>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Check your email for payment confirmation</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Your premium features are now active</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Start exploring enhanced job opportunities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions about your payment or account, we're here to help.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact-us">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

