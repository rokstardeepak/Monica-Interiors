/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CONSULTATION_PACKAGES, COMPLEMENTARY_COLORS } from '../data';
import { 
  Calendar, Clock, User, Mail, Phone, Lock, CreditCard, Check, 
  ChevronRight, ArrowLeft, Loader2, Sparkles, Download, CheckCircle, Smartphone 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppointmentBookingProps {
  onClose: () => void;
  preSelectedPackageId?: string;
}

export default function AppointmentBooking({ onClose, preSelectedPackageId }: AppointmentBookingProps) {
  const [step, setStep] = useState(1);
  const [selectedPackId, setSelectedPackId] = useState(preSelectedPackageId || 'c2'); // default moodboard package
  
  // Schedule state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [spaceType, setSpaceType] = useState<'Residential' | 'Commercial'>('Residential');
  const [projectNotes, setProjectNotes] = useState('');

  // Credit Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardNameOnCard, setCardNameOnCard] = useState('');
  const [cardFocus, setCardFocus] = useState(false);

  // Applet Transaction states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentLogMsg, setPaymentLogMsg] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // Razorpay Integration States
  const [razorpayConfig, setRazorpayConfig] = useState<{ configured: boolean; keyId: string; googleMeetLink?: string }>({
    configured: false,
    keyId: "",
    googleMeetLink: ""
  });
  const [razorpayError, setRazorpayError] = useState<string | null>(null);
  const [showSimulatedRazorpayModal, setShowSimulatedRazorpayModal] = useState(false);
  const [simulatedCheckoutState, setSimulatedCheckoutState] = useState<'options' | 'card' | 'upi' | 'processing' | 'success'>('options');
  const [simulatedPaymentId, setSimulatedPaymentId] = useState('');
  const [simulatedOrderId, setSimulatedOrderId] = useState('');
  const [simulatedUPI, setSimulatedUPI] = useState('');

  // Fetch Razorpay credentials status from backend
  useEffect(() => {
    fetch('/api/razorpay/config')
      .then(res => res.json())
      .then(data => {
        setRazorpayConfig(data);
      })
      .catch(err => {
        console.error("Error fetching Razorpay configuration:", err);
      });
  }, []);

  // Helper to load external checkout script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Helper to generate elegant, unique, deterministic Google Meet links or retrieve customized link
  const generateMeetLink = (bookingId: string) => {
    if (razorpayConfig?.googleMeetLink && razorpayConfig.googleMeetLink.trim() !== "") {
      return razorpayConfig.googleMeetLink.trim();
    }
    const cleanId = (bookingId || '').replace(/[^a-zA-Z]/g, "").toLowerCase();
    const pad = (cleanId + "spacedesignmeet").slice(0, 10);
    return `https://meet.google.com/${pad.slice(0, 3)}-${pad.slice(3, 7)}-${pad.slice(7, 10)}`;
  };

  // Email Notification Dispatch States
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'simulated' | 'failed'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Trigger server-side secure email delivery
  const sendEmailNotification = async (details: any) => {
    setEmailStatus('sending');
    setEmailError(null);
    try {
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (data.simulated) {
          setEmailStatus('simulated');
        } else {
          setEmailStatus('sent');
        }
      } else {
        throw new Error(data.error || 'The mail server rejection block aborted delivery.');
      }
    } catch (err: any) {
      console.error('Email dispatch error:', err);
      setEmailStatus('failed');
      setEmailError(err.message || 'SMTP server connection timed out.');
    }
  };

  // Process standard/live checkout with Razorpay
  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setRazorpayError(null);
    setIsProcessingPayment(true);
    setPaymentLogMsg("Initiating secure payment gateway...");

    try {
      // 1. Create order on full-stack express server
      setPaymentLogMsg("Creating Razorpay Order on server...");
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPackage.price,
          packageName: selectedPackage.name,
        }),
      });

      if (!orderResponse.ok) {
        const errData = await orderResponse.json();
        throw new Error(errData.error || "Failed to create order on server");
      }

      const orderData = await orderResponse.json();

      // Trigger high-fidelity browser simulator if API keys aren't added yet
      if (orderData.simulated) {
        setSimulatedOrderId(orderData.orderId);
        setSimulatedPaymentId("pay_mock_" + Math.random().toString(36).substring(2, 11).toUpperCase());
        setIsProcessingPayment(false);
        setSimulatedCheckoutState('options');
        setShowSimulatedRazorpayModal(true);
        return;
      }

      // 2. Load standard Razorpay SDK script securely
      setPaymentLogMsg("Loading Razorpay security scripts...");
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay Checkout SDK could not be loaded. Please verify your connection.");
      }

      // 3. Initiate checkout process
      setPaymentLogMsg("Launching standard checkout display...");
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Monica Interiors",
        description: `${selectedPackage.name} Consultation`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          setIsProcessingPayment(true);
          setPaymentLogMsg("Verifying payment cryptography...");
          
          try {
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                simulated: false
              }),
            });

            if (!verifyResponse.ok) {
              const verifyErr = await verifyResponse.json();
              throw new Error(verifyErr.error || "Signature verification mismatch");
            }

            const verifyData = await verifyResponse.json();
             if (verifyData.verified) {
              const bId = response.razorpay_order_id || 'MR-' + Math.floor(1000 + Math.random() * 9000);
              const details = {
                bookingId: bId,
                packageName: selectedPackage.name,
                date: calendarDays.find(d => d.raw === selectedDate)?.formatted || selectedDate,
                time: selectedSlot,
                clientName: clientName || "Monica Client",
                clientEmail: clientEmail || "client@monicainteriors.com",
                clientPhone: clientPhone || "N/A",
                amountPaid: selectedPackage.price,
                meetLink: generateMeetLink(bId)
              };
              setBookingDetails(details);
              setIsProcessingPayment(false);
              setPaymentComplete(true);
              sendEmailNotification(details);
            }
          } catch (vErr: any) {
            console.error("Signature verify block failed:", vErr);
            setRazorpayError(vErr.message || "Failed signature authentication.");
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: clientName,
          email: clientEmail,
          contact: clientPhone,
        },
        theme: {
          color: "#3C2A21", // Elegant dark chocolate brand accent style
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            console.log("Payment flow cancelled by user.");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any){
        setRazorpayError(resp.error.description || "Razorpay secure payment transaction was declined.");
        setIsProcessingPayment(false);
      });
      setIsProcessingPayment(false); // remove overlay loader so widget displays safely
      rzp.open();

    } catch (paymentErr: any) {
      console.error("Razorpay workflow failed:", paymentErr);
      setRazorpayError(paymentErr?.message || "An unexpected error occurred during Razorpay loading.");
      setIsProcessingPayment(false);
    }
  };

  // Handler for internal high-fidelity sandbox mock successful flow
  const handleSimulatedRazorpaySuccess = () => {
    setSimulatedCheckoutState('processing');
    setTimeout(() => {
      setSimulatedCheckoutState('success');
      setTimeout(() => {
        setShowSimulatedRazorpayModal(false);
        const details = {
          bookingId: simulatedOrderId,
          packageName: selectedPackage.name,
          date: calendarDays.find(d => d.raw === selectedDate)?.formatted || selectedDate,
          time: selectedSlot,
          clientName: clientName || "Deepak Kumar",
          clientEmail: clientEmail || "agdeepak.singh@gmail.com",
          clientPhone: clientPhone || "N/A",
          amountPaid: selectedPackage.price,
          meetLink: generateMeetLink(simulatedOrderId)
        };
        setBookingDetails(details);
        setPaymentComplete(true);
        sendEmailNotification(details);
      }, 1200);
    }, 1500);
  };

  // Calendar dates generation (Next 10 work days)
  const getUpcomingDays = () => {
    const dates = [];
    const today = new Date();
    let count = 0;
    let index = 1;
    
    while (count < 10) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + index);
      // Skip Sundays (0)
      if (nextDay.getDay() !== 0) {
        dates.push({
          raw: nextDay.toISOString().split('T')[0],
          dayName: nextDay.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNum: nextDay.getDate(),
          monthName: nextDay.toLocaleDateString('en-US', { month: 'short' }),
          formatted: nextDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        });
        count++;
      }
      index++;
    }
    return dates;
  };

  const calendarDays = getUpcomingDays();

  // Slots
  const timslots = [
    { id: '10:00 AM', label: '10:00 AM', period: 'Morning', remaining: 2 },
    { id: '1:00 PM', label: '01:00 PM', period: 'Afternoon', remaining: 1 },
    { id: '3:30 PM', label: '03:30 PM', period: 'Afternoon', remaining: 3 },
    { id: '6:00 PM', label: '06:00 PM', period: 'Evening', remaining: 1 }
  ];

  useEffect(() => {
    if (calendarDays.length > 0 && !selectedDate) {
      setSelectedDate(calendarDays[0].raw);
    }
  }, []);

  const selectedPackage = CONSULTATION_PACKAGES.find((pkg) => pkg.id === selectedPackId) || CONSULTATION_PACKAGES[1];

  // Formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted.substring(0, 19));
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 2) {
      raw = raw.substring(0, 2) + '/' + raw.substring(2, 4);
    }
    setCardExpiry(raw.substring(0, 5));
  };

  // Detect card network
  const getCardNetwork = () => {
    const trimmed = cardNumber.replace(/\s/g, '');
    if (trimmed.startsWith('4')) return 'Visa';
    if (trimmed.startsWith('5')) return 'Mastercard';
    if (trimmed.startsWith('3')) return 'American Express';
    return 'Generic';
  };

  // Validations
  const validateStep2 = () => selectedDate && selectedSlot;
  const validateStep3 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return clientName.trim() !== '' && emailRegex.test(clientEmail) && clientPhone.trim().length >= 8;
  };
  const validateStep4 = () => {
    const num = cardNumber.replace(/\s/g, '');
    return num.length >= 13 && cardExpiry.length === 5 && cardCVC.length >= 3;
  };

  const handleNextStep = () => {
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(step + 1);
  };

  // Payment process simulation with dynamic logs
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) return;

    setIsProcessingPayment(true);
    
    const logs = [
      'Accessing secure end-to-end handshaking...',
      'Verifying seat quotas for ' + selectedDate + '...',
      'Securing payment token via TLS escrow gateway...',
      'Authorizing transaction with customer bank...',
      'Finalizing booking records & digital contract deed...'
    ];

    let currentLogIndex = 0;
    setPaymentLogMsg(logs[0]);

    const logTimer = setInterval(() => {
      currentLogIndex++;
      if (currentLogIndex < logs.length) {
        setPaymentLogMsg(logs[currentLogIndex]);
      } else {
        clearInterval(logTimer);
        
        // Success
        const randomBookingId = 'MR-' + Math.floor(1000 + Math.random() * 9000) + '-' + selectedDate.substring(8,10);
        setBookingDetails({
          bookingId: randomBookingId,
          packageName: selectedPackage.name,
          date: calendarDays.find(d => d.raw === selectedDate)?.formatted || selectedDate,
          time: selectedSlot,
          clientName: clientName,
          clientEmail: clientEmail,
          amountPaid: selectedPackage.price
        });
        
        setIsProcessingPayment(false);
        setPaymentComplete(true);
      }
    }, 900);
  };

  // Fast payment method (Google Pay)
  const handleGooglePay = () => {
    setCardNumber('4111 2222 3333 4444');
    setCardExpiry('08/29');
    setCardCVC('123');
    setCardNameOnCard(clientName || 'Monica Client');
    
    // Auto submit simulated
    setIsProcessingPayment(true);
    setPaymentLogMsg('Processing Google Pay Express Checkout...');
    setTimeout(() => {
      const randomBookingId = 'MR-GP-' + Math.floor(1000 + Math.random() * 9000);
      const details = {
        bookingId: randomBookingId,
        packageName: selectedPackage.name,
        date: calendarDays.find(d => d.raw === selectedDate)?.formatted || selectedDate,
        time: selectedSlot,
        clientName: clientName || 'Express Client',
        clientEmail: clientEmail || 'client@monicainteriors.com',
        clientPhone: clientPhone || 'N/A',
        amountPaid: selectedPackage.price,
        meetLink: generateMeetLink(randomBookingId)
      };
      setBookingDetails(details);
      setIsProcessingPayment(false);
      setPaymentComplete(true);
      sendEmailNotification(details);
    }, 1800);
  };

  // Dynamic ICS Event Generation & Download
  const handleDownloadCalendarEvent = () => {
    if (!bookingDetails) return;
    
    // Resolve date and times
    // Date pattern: 2026-06-05
    const dt = selectedDate.replace(/-/g, '');
    const startTimeStamp = dt + 'T100000Z'; // mock start
    const endTimeStamp = dt + 'T110000Z';   // mock end
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Monica Interiors//Monica Interiors Booking//EN',
      'BEGIN:VEVENT',
      'UID:' + bookingDetails.bookingId + '@monicainteriors.com',
      'DTSTAMP:' + dt + 'T000000Z',
      'DTSTART:' + startTimeStamp,
      'DTEND:' + endTimeStamp,
      'SUMMARY:' + bookingDetails.packageName + ' with Monica Interiors',
      'DESCRIPTION:Your premium interior design consultation. Live Google Meet Workspace URL: ' + (bookingDetails.meetLink || '') + ' - Ref ID: ' + bookingDetails.bookingId,
      'LOCATION:' + (bookingDetails.meetLink || 'Google Meet Client Workspace'),
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'monica_interiors_' + bookingDetails.bookingId + '.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#FAF8F5] text-[#3C2A21] w-full max-w-4xl min-h-[500px] border border-[#3C2A21]/15 shadow-2xl flex flex-col md:flex-row relative rounded-lg overflow-hidden"
        id="booking-portal-card"
      >
        {/* Right Close indicator */}
        {!isProcessingPayment && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-[#3C2A21] hover:text-[#BFA15F] font-sans text-xs uppercase tracking-widest bg-[#FAF8F5] border border-[#3C2A21]/10 rounded shadow-sm focus:outline-none"
            id="close-booking-portal"
          >
            Close ✕
          </button>
        )}

        {/* LEFT COMPASS: Invoice / Package Summary */}
        <div className="w-full md:w-80 bg-[#1E1714] text-[#FAF8F5] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#3C2A21]/20">
          <div className="flex flex-col gap-6 pr-20 md:pr-0">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#BFA15F] bg-[#BFA15F]/10 px-2 py-0.5 rounded">
                Direct Appointment Portal
              </span>
              <h4 className="font-serif text-2xl tracking-tight mt-3">
                Monica Interiors
              </h4>
              <p className="text-[11px] font-sans text-[#FAF8F5]/60 mt-1 uppercase tracking-widest">
                Exclusive Consultation
              </p>
            </div>

            {/* active summary detail */}
            <div className="border-t border-[#FAF8F5]/10 pt-4 flex flex-col gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#BFA15F] block">Selected Program:</span>
                <span className="text-sm font-sans tracking-tight font-medium block mt-1">{selectedPackage.name}</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#FAF8F5]/40 block">Duration:</span>
                  <span className="text-xs font-sans block mt-0.5">{selectedPackage.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#FAF8F5]/40 block">Design Consultation Fee:</span>
                  <span className="text-xs font-sans block mt-0.5">₹{selectedPackage.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {selectedDate && (
                <div className="text-xs border-t border-[#FAF8F5]/10 pt-2 font-sans flex items-center gap-2 text-[#BFA15F]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {calendarDays.find(d => d.raw === selectedDate)?.dayName}, {calendarDays.find(d => d.raw === selectedDate)?.monthName} {calendarDays.find(d => d.raw === selectedDate)?.dayNum}
                    {selectedSlot ? ` @ ${selectedSlot}` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[#FAF8F5]/10 pt-4 mt-8 flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-xs text-[#FAF8F5]/50">Consultation Fee</span>
              <span className="font-serif text-sm">₹{selectedPackage.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-xs text-[#FAF8F5]/50 flex gap-1 items-center">
                Processing Token 
              </span>
              <span className="font-serif text-xs text-[#BFA15F]">FREE</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-[#FAF8F5]/15 pt-2 mt-1">
              <span className="font-sans text-xs font-medium uppercase text-[#BFA15F]">Direct Due:</span>
              <span className="font-serif text-xl font-bold text-[#FAF8F5]">₹{selectedPackage.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1 text-[10px] font-mono text-[#FAF8F5]/40 uppercase tracking-widest text-center">
              <Lock className="w-3 h-3 text-[#BFA15F]" />
              <span>TLS Secure Gateway</span>
            </div>
          </div>
        </div>

        {/* MAIN BODY WORKSPACE (Steps) */}
        <div className="flex-grow p-6 md:p-8 flex flex-col justify-between overflow-x-hidden">
          
          {/* Progress Markers bar */}
          {!paymentComplete && (
            <div className="flex items-center justify-between border-b border-[#3C2A21]/10 pb-4 mb-6 pr-20 md:pr-24">
              {[
                { s: 1, name: 'Service' },
                { s: 2, name: 'Schedule' },
                { s: 3, name: 'Details' },
                { s: 4, name: 'Checkout' }
              ].map((m) => (
                <div key={m.s} className="flex items-center gap-1.5 sm:gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    step === m.s 
                      ? 'bg-[#3C2A21] text-white' 
                      : step > m.s ? 'bg-[#BFA15F] text-white' : 'bg-[#3C2A21]/10 text-[#3C2A21]/40'
                  }`}>
                    {step > m.s ? '✓' : m.s}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-sans tracking-wide uppercase font-medium ${
                    step === m.s ? 'text-[#3C2A21]' : 'text-[#6B625E]/50'
                  }`}>
                    {m.name}
                  </span>
                  {m.s < 4 && <ChevronRight className="w-3 h-3 text-stone-300 hidden sm:inline" />}
                </div>
              ))}
            </div>
          )}

          {/* ACTIVE CONTENT SHEET */}
          <div className="flex-grow flex flex-col justify-center">
            
            {/* SCREEN OVERLAY: Processing modal */}
            {isProcessingPayment && (
              <div className="flex flex-col items-center justify-center py-12 text-center" id="processing-loader-overlay">
                <Loader2 className="w-12 h-12 text-[#BFA15F] animate-spin mb-6" />
                <h5 className="font-serif text-xl text-[#3C2A21]">Processing Secure Escrow Transaction</h5>
                <p className="font-mono text-xs text-[#BFA15F] mt-2 bg-[#BFA15F]/15 px-3 py-1 uppercase rounded tracking-wider max-w-sm">
                  {paymentLogMsg}
                </p>
                <span className="font-sans text-xs text-[#6B625E] font-light mt-4">
                  Please hold on. Do not close this panel or hit your browser's back button.
                </span>
              </div>
            )}

            {!isProcessingPayment && !paymentComplete && (
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Select/Refine Consultation Package */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h5 className="font-serif text-xl mb-4">Choose Consultation Core</h5>
                    <div className="flex flex-col gap-3">
                      {CONSULTATION_PACKAGES.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackId(pkg.id)}
                          className={`p-4 text-left border rounded transition-all flex justify-between items-start gap-4 ${
                            selectedPackId === pkg.id 
                              ? 'border-[#3C2A21] bg-white shadow-md ring-1 ring-[#3C2A21]' 
                              : 'border-[#3C2A21]/10 bg-white/40 hover:bg-white hover:border-[#3C2A21]/30'
                          }`}
                          id={`book-pack-${pkg.id}`}
                        >
                          <div className="flex-grow">
                            <span className="font-sans text-[11px] font-mono text-[#BFA15F] tracking-widest block uppercase mb-0.5">
                              {pkg.duration} Consultation
                            </span>
                            <span className="font-serif text-base font-semibold block text-[#3C2A21]">{pkg.name}</span>
                            <p className="font-sans text-xs text-[#6B625E] font-light leading-relaxed mt-1">{pkg.description}</p>
                          </div>
                          <div className="flex flex-col items-end flex-shrink-0">
                            <span className="font-serif text-lg font-bold text-[#3C2A21]">₹{pkg.price.toLocaleString('en-IN')}</span>
                            {selectedPackId === pkg.id ? (
                              <span className="bg-[#BFA15F] text-white p-1 rounded-full mt-2">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-[#6B625E] border border-[#3C2A21]/15 px-2 py-0.5 mt-2 rounded">
                                Select
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Scheduler selection */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-5"
                  >
                    <div>
                      <h5 className="font-serif text-xl">Select Studio Schedule Slot</h5>
                      <p className="font-sans text-xs text-[#6B625E] font-light">
                        Select an available datespace over the upcoming days. All time zones resolve to Local Time.
                      </p>
                    </div>

                    {/* Horizontal scrollable date selection panel */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" id="booking-days-scroll-container">
                      {calendarDays.map((day) => (
                        <button
                          key={day.raw}
                          onClick={() => {
                            setSelectedDate(day.raw);
                            setSelectedSlot(''); // reset slot upon date change
                          }}
                          className={`flex-shrink-0 w-16 py-3 rounded text-center border transition-all ${
                            selectedDate === day.raw 
                              ? 'border-[#3C2A21] bg-[#3C2A21] text-[#FAF8F5]' 
                              : 'border-[#3C2A21]/12 bg-white hover:border-[#3C2A21]/40'
                          }`}
                          id={`date-pill-${day.raw}`}
                        >
                          <span className="font-mono text-[9px] uppercase tracking-wider block leading-tight">{day.monthName}</span>
                          <span className="font-serif text-lg font-bold block mt-0.5 leading-none">{day.dayNum}</span>
                          <span className="font-sans text-[10px] block mt-1 opacity-75">{day.dayName}</span>
                        </button>
                      ))}
                    </div>

                    {/* Timeline slots */}
                    <div className="grid grid-cols-2 gap-3" id="booking-slots-grid">
                      {timslots.map((slot) => {
                        const isSelected = selectedSlot === slot.id;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot.id)}
                            className={`p-3 border rounded text-center transition-all ${
                              isSelected 
                                ? 'border-[#BFA15F] bg-white ring-1 ring-[#BFA15F]' 
                                : 'border-[#3C2A21]/10 bg-white/40 hover:bg-white hover:border-[#3C2A21]/30'
                            }`}
                            id={`slot-pill-${slot.id.replace(/\s/g, '_')}`}
                          >
                            <span className="font-serif text-sm font-semibold text-[#3C2A21] block leading-none">{slot.label}</span>
                            <div className="flex items-center justify-between mt-2.5 text-[10px] font-sans text-[#6B625E]">
                              <span>{slot.period}</span>
                              <span className={`${slot.remaining === 1 ? 'text-red-500 font-medium' : 'text-[#BFA15F]'}`}>
                                {slot.remaining} left
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Client specifics and requirements */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <h5 className="font-serif text-xl">Spatial Specifications & Contact</h5>
                      <p className="font-sans text-xs text-[#6B625E] font-light">
                        Let Monica know more about your goals to optimize consultation material matching.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Full name */}
                      <div className="col-span-2 sm:col-span-1">
                        <label className="font-mono text-[10px] uppercase text-[#7F675B] tracking-wider block mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B625E]/50" />
                          <input
                            type="text"
                            required
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="e.g. Eleanor Vance"
                            className="w-full bg-white border border-[#3C2A21]/15 pl-9 pr-3 py-2.5 text-sm rounded outline-none focus:border-[#BFA15F]"
                            id="field-client-name"
                          />
                        </div>
                      </div>

                      {/* Contact Email */}
                      <div className="col-span-2 sm:col-span-1">
                        <label className="font-mono text-[10px] uppercase text-[#7F675B] tracking-wider block mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B625E]/50" />
                          <input
                            type="email"
                            required
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="eleanor@vancedesigns.com"
                            className="w-full bg-white border border-[#3C2A21]/15 pl-9 pr-3 py-2.5 text-sm rounded outline-none focus:border-[#BFA15F]"
                            id="field-client-email"
                          />
                        </div>
                      </div>

                      {/* Contact Phone */}
                      <div className="col-span-2 sm:col-span-1">
                        <label className="font-mono text-[10px] uppercase text-[#7F675B] tracking-wider block mb-1">
                          Mobile Phone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B625E]/50" />
                          <input
                            type="tel"
                            required
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            placeholder="(212) 555-0155"
                            className="w-full bg-white border border-[#3C2A21]/15 pl-9 pr-3 py-2.5 text-sm rounded outline-none focus:border-[#BFA15F]"
                            id="field-client-phone"
                          />
                        </div>
                      </div>

                      {/* Project Category toggle */}
                      <div className="col-span-2 sm:col-span-1">
                        <label className="font-mono text-[10px] uppercase text-[#7F675B] tracking-wider block mb-1">
                          Project Category
                        </label>
                        <div className="flex border border-[#3C2A21]/15 rounded overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setSpaceType('Residential')}
                            className={`flex-1 py-2.5 text-xs font-sans font-medium uppercase tracking-wider transition-all ${
                              spaceType === 'Residential' 
                                ? 'bg-[#3C2A21] text-white' 
                                : 'bg-white text-[#3C2A21] hover:bg-stone-100'
                            }`}
                            id="btn-space-residential"
                          >
                            Residential
                          </button>
                          <button
                            type="button"
                            onClick={() => setSpaceType('Commercial')}
                            className={`flex-1 py-2.5 text-xs font-sans font-medium uppercase tracking-wider transition-all ${
                              spaceType === 'Commercial' 
                                ? 'bg-[#3C2A21] text-white' 
                                : 'bg-white text-[#3C2A21] hover:bg-stone-100'
                            }`}
                            id="btn-space-commercial"
                          >
                            Commercial
                          </button>
                        </div>
                      </div>

                      {/* brief requirements */}
                      <div className="col-span-2">
                        <label className="font-mono text-[10px] uppercase text-[#7F675B] tracking-wider block mb-1">
                          Spaces details & Brief notes (Optional)
                        </label>
                        <textarea
                          rows={3}
                          value={projectNotes}
                          onChange={(e) => setProjectNotes(e.target.value)}
                          placeholder="Please specify layout preferences, material wishes, or renovation bounds..."
                          className="w-full bg-white border border-[#3C2A21]/15 p-3 text-sm rounded outline-none focus:border-[#BFA15F] resize-none"
                          id="field-project-notes"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Checkout simulated payment page */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <h5 className="font-serif text-xl">Razorpay Secure Checkout</h5>
                      <p className="font-sans text-xs text-[#6B625E] font-light mt-1">
                        Your transaction is securely tokenized and protected by AES encryption. Confirm your design studio booking using Razorpay.
                      </p>
                    </div>

                    {/* Razorpay Setup Status Indicator */}
                    {razorpayConfig.configured ? (
                      <div className="bg-emerald-50 border border-emerald-300/40 p-3 rounded-md flex items-start gap-2 text-[#064e3b]">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 animate-pulse" />
                        <div>
                          <span className="font-semibold block font-sans text-xs">Razorpay Live API Connection Ready</span>
                          <span className="text-[11px] opacity-90 block mt-0.5">
                            Using secure Key ID ending in <code className="font-mono bg-emerald-100 px-1 rounded">...{razorpayConfig.keyId.slice(-6) || "Active"}</code>.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#BFA15F]/5 border border-[#BFA15F22] p-4 rounded-md flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2 text-[#7F675B] font-medium font-sans">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>Razorpay Sandbox Connected (Simulator Active)</span>
                        </div>
                        <span className="text-[#6B625E] text-[11px] font-light leading-relaxed mt-1">
                          To activate live payments, configure your <code className="font-mono bg-[#3C2A21]/5 px-1 py-0.5 rounded">RAZORPAY_KEY_ID</code> &amp; <code className="font-mono bg-[#3C2A21]/5 px-1 py-0.5 rounded">RAZORPAY_KEY_SECRET</code> inside the client settings tab.
                        </span>
                      </div>
                    )}

                    {razorpayError && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded text-xs text-red-700 font-sans font-medium">
                        <strong className="font-semibold block">Gateway Error/Notice:</strong>
                        <span className="text-[11px] block font-light mt-0.5">{razorpayError}</span>
                      </div>
                    )}

                    {/* Razorpay Launch CTA Form */}
                    <form onSubmit={handleRazorpayPayment} className="flex flex-col gap-4 mt-1">
                      <div className="border border-[#3C2A21]/10 bg-white p-4 rounded-md flex flex-col gap-3 shadow-inner">
                        <div className="flex justify-between items-center text-xs pb-3 border-b border-dashed border-stone-200">
                          <span className="text-stone-500">Service Category:</span>
                          <span className="font-medium text-[#3C2A21]">{selectedPackage.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs pb-3 border-b border-dashed border-stone-200">
                          <span className="text-stone-500">Reserved Timing:</span>
                          <span className="font-medium text-[#3C2A21]">{calendarDays.find(d => d.raw === selectedDate)?.formatted || selectedDate} @ {selectedSlot}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs pb-3 border-b border-dashed border-stone-200">
                          <span className="text-stone-500">Client Details:</span>
                          <span className="font-mono text-[#3C2A21]">{clientName} ({clientPhone})</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-500">Amount Payable:</span>
                          <span className="font-serif font-bold text-base text-[#3C2A21]">₹{selectedPackage.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#3C2A21] text-white hover:bg-[#1E1714] py-3.5 px-4 rounded text-xs uppercase tracking-[0.15em] font-medium transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        id="razorpay-trigger-btn"
                      >
                        <CreditCard className="w-4 h-4 text-[#BFA15F]" />
                        Initialize Razorpay Payment • ₹{selectedPackage.price.toLocaleString('en-IN')}
                      </button>

                      <p className="text-[10px] text-center font-mono text-stone-400 uppercase tracking-widest mt-1">
                        🔒 Secured by Razorpay India. No payment instruments are stored on our records.
                      </p>
                    </form>
                  </motion.div>
                )}

              </AnimatePresence>
            )}

            {/* SCREEN OVERLAY: Successful confirmation receipt */}
            {paymentComplete && bookingDetails && (
              <motion.div
                key="step-confirmed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-6 text-[#3C2A21]"
                id="booking-confirmed-card"
              >
                <div className="w-16 h-16 rounded-full bg-[#BFA15F]/15 flex items-center justify-center mb-6 text-[#BFA15F] relative">
                  <CheckCircle className="w-10 h-10" />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full bg-[#BFA15F]/10 border border-[#BFA15F]"
                  />
                </div>

                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#BFA15F] bg-[#BFA15F]/10 px-3 py-1 rounded-full">
                  Appointment Confirmed
                </span>

                <h4 className="font-serif text-3xl mt-4 tracking-tight">
                  Your Space Awaits
                </h4>
                
                <p className="font-sans text-xs text-[#6B625E] font-light max-w-md mt-2 leading-relaxed">
                  Your appointment is successfully booked! Thank you, <strong>{bookingDetails.clientName}</strong>! Confirmation details has been sent to <strong>{bookingDetails.clientEmail}</strong> with joining instruction details.
                </p>

                {/* Real-time Email Dispatch System Status Widget */}
                <div className="w-full max-w-sm mt-4 text-left">
                  {emailStatus === 'sending' && (
                    <div className="bg-amber-500/5 text-amber-800 border border-amber-500/20 rounded-md p-3 flex gap-2.5 items-center font-sans text-xs">
                      <Loader2 className="w-4 h-4 text-[#BFA15F] animate-spin shrink-0" />
                      <div>
                        <strong className="font-semibold block text-[11px] uppercase tracking-wider">Transactional Delivery</strong>
                        <span className="font-light block text-[10px] opacity-90 mt-0.5">Authorizing premium receipt message for {bookingDetails.clientEmail}...</span>
                      </div>
                    </div>
                  )}

                  {emailStatus === 'sent' && (
                    <div className="bg-green-50 text-green-800 border border-green-200 rounded-md p-3.5 flex gap-2.5 items-start font-sans text-[11px]">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 mt-0.5 font-bold">✓</div>
                      <div>
                        <strong className="font-semibold block uppercase tracking-wider text-green-900 text-[10px]">Inbox Delivery Complete</strong>
                        <span className="font-light block opacity-90 mt-0.5 leading-relaxed">
                          Your premium email receipt has been securely dispatched via TLS and is ready in your inbox!
                        </span>
                      </div>
                    </div>
                  )}

                  {emailStatus === 'simulated' && (
                    <div className="bg-stone-100 text-stone-700 border border-stone-200 rounded-md p-3.5 flex gap-2.5 items-start font-sans text-[11px]">
                      <div className="w-5 h-5 rounded-full bg-[#BFA15F]/20 flex items-center justify-center text-[#BFA15F] shrink-0 mt-0.5 text-xs font-serif italic">i</div>
                      <div>
                        <strong className="font-semibold block uppercase tracking-wider text-stone-800 text-[10px]">Test Mode Confirmation Active</strong>
                        <span className="font-light block opacity-90 mt-0.5 leading-relaxed">
                          Your reservation has been securely logged on the server and is queryable in the Owner Portal.
                        </span>
                      </div>
                    </div>
                  )}

                  {emailStatus === 'failed' && (
                    <div className="bg-red-50 text-red-800 border border-red-200 rounded-md p-3.5 flex gap-2.5 items-start font-sans text-[11px]">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 mt-0.5">✕</div>
                      <div>
                        <strong className="font-semibold block uppercase tracking-wider text-red-900 text-[10px]">Delivery Pipeline Aborted</strong>
                        <span className="font-light block opacity-90 mt-0.5 leading-relaxed">
                          SMTP endpoint lookup failed check parameters: {emailError}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Digital receipt box */}
                <div className="bg-white border border-[#3C2A21]/10 rounded-lg p-5 w-full max-w-sm my-6 text-left shadow-md flex flex-col gap-3 font-sans text-xs">
                  <div className="flex justify-between pb-2 border-b border-stone-100">
                    <span className="font-medium text-[#6B625E]">Booking ID:</span>
                    <span className="font-mono font-bold text-[#3C2A21]">{bookingDetails.bookingId}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-stone-100">
                    <span className="font-medium text-[#6B625E]">Consultation:</span>
                    <span className="text-[#3C2A21]">{bookingDetails.packageName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-stone-100">
                    <span className="font-medium text-[#6B625E]">Date:</span>
                    <span className="text-[#3C2A21]">{bookingDetails.date}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-stone-100">
                    <span className="font-medium text-[#6B625E]">Time Slot:</span>
                    <span className="text-[#3C2A21]">{bookingDetails.time}</span>
                  </div>
                  {bookingDetails.meetLink && (
                    <div className="flex flex-col gap-1 pb-2 border-b border-stone-100">
                      <div className="flex justify-between items-center w-full">
                        <span className="font-medium text-[#6B625E]">Google Meet Room:</span>
                        <a 
                          href={bookingDetails.meetLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#BFA15F] hover:underline font-mono text-[10px] font-semibold break-all text-right max-w-[200px]"
                        >
                          {bookingDetails.meetLink}
                        </a>
                      </div>
                      {!razorpayConfig?.googleMeetLink && (
                        <p className="text-[10px] text-[#6B625E]/70 font-sans italic leading-normal text-right mt-1">
                          💡 If Google says "Check your meeting code" for a dynamic room code, Monica will activate &amp; register it right at the time of your call. To specify a permanent recurring room instead, set GOOGLE_MEET_LINK in environmental variables.
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium uppercase text-[#BFA15F]">Amount Secured:</span>
                    <span className="font-serif font-bold text-sm text-[#3C2A21]">₹{bookingDetails.amountPaid.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Interactive ICS downloadable component */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <button
                    onClick={handleDownloadCalendarEvent}
                    className="flex-1 bg-[#3C2A21] hover:bg-[#1E2941] text-[#FAF8F5] py-3 text-xs uppercase tracking-widest font-semibold rounded flex items-center justify-center gap-2 transition-all shadow-md"
                    id="download-calendar-btn"
                  >
                    <Download className="w-4 h-4 text-[#BFA15F]" />
                    Add To Calendar (.ics)
                  </button>

                  <button
                    onClick={onClose}
                    className="flex-1 border border-[#3C2A21]/20 hover:border-[#3C2A21] text-[#3C2A21] py-3 text-xs uppercase tracking-widest font-semibold rounded transition-all"
                    id="confirmation-finish-btn"
                  >
                    Finish & Return
                  </button>
                </div>

              </motion.div>
            )}

          </div>

          {/* NEXT STEP TRIGGERS */}
          {!paymentComplete && (
            <div className="flex justify-between items-center border-t border-[#3C2A21]/10 pt-4 mt-6">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1.5 text-xs text-[#3C2A21]/70 hover:text-[#3C2A21] font-sans uppercase tracking-widest transition-colors"
                  id="booking-step-back-btn"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              ) : (
                <div /> // dummy layout grid block
              )}

              {step < 4 ? (
                <button
                  disabled={(step === 2 && !validateStep2()) || (step === 3 && !validateStep3())}
                  onClick={handleNextStep}
                  className={`flex items-center gap-1 px-5 py-2.5 text-xs font-sans font-medium uppercase tracking-widest transition-all ${
                    (step === 2 && !validateStep2()) || (step === 3 && !validateStep3())
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-[#3C2A21] hover:bg-[#1E2941] text-[#FAF8F5]'
                  }`}
                  id="booking-step-next-btn"
                >
                  Retrieve Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div />
              )}
            </div>
          )}

        </div>

      </motion.div>

      {/* High-Fidelity Razorpay Simulator Modal fallback */}
      {showSimulatedRazorpayModal && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#1C2030] text-white w-full max-w-sm rounded-[10px] overflow-hidden shadow-2xl border border-slate-700/30 flex flex-col"
          >
            {/* Header: Designed to resemble Razorpay's premium Checkout widget */}
            <div className="bg-[#121420] p-5 flex justify-between items-center border-b border-slate-800">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#3399cc] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3399cc] animate-ping" />
                  Razorpay Sandbox
                </span>
                <span className="font-serif text-base font-semibold text-white tracking-tight">Monica Interiors</span>
                <span className="text-slate-400 text-[10px] font-sans">{selectedPackage.name}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[9px] uppercase font-mono tracking-wider block">Price Due</span>
                <span className="font-bold text-lg font-mono text-[#3399cc]">₹{selectedPackage.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Central Simulator Window */}
            {simulatedCheckoutState !== 'processing' && simulatedCheckoutState !== 'success' ? (
              <div className="p-5 flex flex-col gap-4">
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setSimulatedCheckoutState('options')}
                    className={`flex-1 py-1.5 text-xs rounded transition-all font-medium border ${
                      simulatedCheckoutState === 'options' 
                        ? 'bg-[#3399cc] border-[#3399cc] text-white font-sans' 
                        : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 font-sans'
                    }`}
                  >
                    UPI Gateway
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSimulatedCheckoutState('card')}
                    className={`flex-1 py-1.5 text-xs rounded transition-all font-medium border ${
                      simulatedCheckoutState === 'card' 
                        ? 'bg-[#3399cc] border-[#3399cc] text-white font-sans' 
                        : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 font-sans'
                    }`}
                  >
                    Credit Card
                  </button>
                </div>

                {simulatedCheckoutState === 'options' ? (
                  <div className="flex flex-col gap-3 min-h-[160px] justify-center text-left">
                    <span className="text-slate-400 text-[11px] font-medium uppercase font-mono tracking-wider">Simulate UPI Payment</span>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1 font-mono">UPI ID / VPA</label>
                      <input 
                        type="text" 
                        value={simulatedUPI} 
                        onChange={(e) => setSimulatedUPI(e.target.value)}
                        placeholder="razorpay@testupi" 
                        className="w-full bg-[#121420] border border-slate-700 text-white rounded p-2 text-xs outline-none focus:border-[#3399cc] font-mono"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={handleSimulatedRazorpaySuccess}
                      className="w-full bg-[#3399cc] hover:bg-[#2c88b7] text-white py-2.5 rounded font-sans font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer mt-1"
                    >
                      Pay UPI ₹{selectedPackage.price.toLocaleString('en-IN')}
                    </button>
                    <span className="text-[10px] text-[#BFA15F] bg-[#BFA15F]/10 p-2 rounded text-center block leading-relaxed">
                      💡 Connected to sandbox environment. Click Pay to simulate a live bank transaction flow!
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 min-h-[160px] justify-center text-left">
                    <span className="text-slate-400 text-[11px] font-medium uppercase font-mono tracking-wider">Simulate Card Terminal</span>
                    <div className="bg-[#121420] border border-slate-700 p-3 rounded flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-slate-500 block">CARD NUMBER</span>
                      <span className="text-xs font-mono tracking-widest text-[#3399cc]">4111 2222 3333 4444</span>
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                        <span>EXP: 12/29</span>
                        <span>CVV: 123</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={handleSimulatedRazorpaySuccess}
                      className="w-full bg-[#3399cc] hover:bg-[#2c88b7] text-white py-2.5 rounded font-sans font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer mt-1"
                    >
                      Pay Card ₹{selectedPackage.price.toLocaleString('en-IN')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 flex flex-col items-center justify-center min-h-[220px] text-center gap-3">
                {simulatedCheckoutState === 'processing' ? (
                  <>
                    <Loader2 className="w-12 h-12 text-[#3399cc] animate-spin mb-2" />
                    <span className="font-semibold text-sm">Authorizing Sandbox Escrow</span>
                    <span className="text-xs text-slate-400">Verifying bank protocols with Razorpay core servers...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-12 h-12 text-emerald-500 mb-2 animate-bounce" />
                    <span className="font-semibold text-sm text-emerald-400">Transaction Authorized!</span>
                    <span className="text-xs text-slate-400 font-light">Synthesizing digital consultation booking token...</span>
                  </>
                )}
              </div>
            )}

            {/* Footer with cancellation buttons */}
            <div className="bg-[#121420] p-4 flex justify-between items-center border-t border-slate-800 text-xs text-left">
              <span className="text-xs text-slate-500 font-mono tracking-wide">ID: {simulatedOrderId}</span>
              <button 
                type="button" 
                onClick={() => {
                  setShowSimulatedRazorpayModal(false);
                  setIsProcessingPayment(false);
                }}
                className="text-slate-400 hover:text-white uppercase font-sans text-[10px] tracking-wider font-semibold border border-slate-700 hover:border-slate-400 px-3 py-1 rounded transition-colors cursor-pointer"
              >
                Cancel payment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
