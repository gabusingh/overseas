'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, RefreshCw, CreditCard, AlertTriangle, MessageCircle, ArrowLeft } from 'lucide-react';

interface FailureDetails {
  errorCode?: string;
  errorMessage?: string;
  transactionId?: string;
  amount?: string;
  currency?: string;
  planName?: string;
  reason?: string;
}

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const [failureDetails, setFailureDetails] = useState<FailureDetails>({});
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Extract failure details from URL parameters
    setFailureDetails({
      errorCode: searchParams.get('error_code') || 'PAYMENT_DECLINED',
      errorMessage: searchParams.get('error_message') || 'Payment was declined by your bank',
      transactionId: searchParams.get('transaction_id') || undefined,
      amount: searchParams.get('amount') || '29.99',
      currency: searchParams.get('currency') || 'USD',
      planName: searchParams.get('plan_name') || 'Premium Plan',
      reason: searchParams.get('reason') || 'card_declined'
    });
  }, [searchParams]);

  const handleRetryPayment = async () => {
    setIsRetrying(true);
    
    // Simulate retry logic - redirect to checkout with same parameters
    setTimeout(() => {
      window.location.href = `/checkout?retry=true&plan=${failureDetails.planName}&amount=${failureDetails.amount}`;
    }, 1000);
  };

  const getErrorMessage = (errorCode?: string) => {
    switch (errorCode) {
      case 'INSUFFICIENT_FUNDS':
        return 'Your card has insufficient funds for this transaction.';
      case 'CARD_DECLINED':
        return 'Your card was declined. Please try a different payment method.';
      case 'EXPIRED_CARD':
        return 'Your card has expired. Please use a different card.';
      case 'INVALID_CVC':
        return 'The security code (CVC) you entered is invalid.';
      case 'PROCESSING_ERROR':
        return 'There was a temporary processing error. Please try again.';
      default:
        return failureDetails.errorMessage || 'Your payment could not be processed at this time.';
    }
  };

  const getRetryAdvice = (errorCode?: string) => {
    switch (errorCode) {
      case 'INSUFFICIENT_FUNDS':
        return 'Please check your account balance or try a different card.';
      case 'CARD_DECLINED':
        return 'Contact your bank or try an alternative payment method.';
      case 'EXPIRED_CARD':
        return 'Please update your card information and try again.';
      case 'INVALID_CVC':
        return 'Double-check your security code and try again.';
      default:
        return 'Please try again in a few minutes or contact support.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Failure Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Failed</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We were unable to process your payment. Don't worry, you haven't been charged.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Error Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  Payment Error Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Error Alert */}
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>{getErrorMessage(failureDetails.errorCode)}</strong>
                    <br />
                    <span className="text-sm mt-2 block">
                      {getRetryAdvice(failureDetails.errorCode)}
                    </span>
                  </AlertDescription>
                </Alert>

                {/* Transaction Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">
                      Plan
                    </label>
                    <p className="text-lg text-gray-800">{failureDetails.planName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">
                      Amount
                    </label>
                    <p className="text-lg font-semibold text-gray-800">
                      {failureDetails.currency} {failureDetails.amount}
                    </p>
                  </div>
                  {failureDetails.errorCode && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Error Code
                      </label>
                      <p className="text-sm font-mono text-red-600 bg-red-50 px-2 py-1 rounded">
                        {failureDetails.errorCode}
                      </p>
                    </div>
                  )}
                  {failureDetails.transactionId && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Transaction ID
                      </label>
                      <p className="text-sm font-mono text-gray-600">
                        {failureDetails.transactionId}
                      </p>
                    </div>
                  )}
                </div>

                {/* Common Solutions */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Common Solutions</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">
                        Check that your card details are entered correctly
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">
                        Ensure your card has sufficient funds
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">
                        Contact your bank to authorize the transaction
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">
                        Try using a different card or payment method
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Retry Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Try Again</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleRetryPayment}
                  disabled={isRetrying}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isRetrying ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  {isRetrying ? 'Redirecting...' : 'Retry Payment'}
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/pricing">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Choose Different Plan
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <p className="text-gray-600 mb-4">We accept:</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-blue-50 rounded-full text-blue-700 text-xs">
                      Visa
                    </div>
                    <div className="px-3 py-1 bg-blue-50 rounded-full text-blue-700 text-xs">
                      Mastercard
                    </div>
                    <div className="px-3 py-1 bg-blue-50 rounded-full text-blue-700 text-xs">
                      American Express
                    </div>
                    <div className="px-3 py-1 bg-blue-50 rounded-full text-blue-700 text-xs">
                      PayPal
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is ready to help resolve any payment issues.
                </p>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/contact-us">Contact Support</Link>
                  </Button>
                  <div className="text-center">
                    <a 
                      href="mailto:payments@overseas.ai" 
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      payments@overseas.ai
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailed() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}

