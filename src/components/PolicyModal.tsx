import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mail, Phone, MapPin, Clock, FileText, 
  ShieldCheck, RefreshCw, Landmark, HelpCircle, Copy, Check 
} from 'lucide-react';

export type PolicyTab = 'contact' | 'terms' | 'privacy' | 'refund';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export default function PolicyModal({ isOpen, onClose, initialTab = 'contact' }: PolicyModalProps) {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialTab]);

  const copyContact = () => {
    navigator.clipboard.writeText("monicainteriors23@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: PolicyTab; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'contact', 
      label: 'Contact Us', 
      icon: <Phone className="w-4 h-4" /> 
    },
    { 
      id: 'terms', 
      label: 'Terms & Conditions', 
      icon: <FileText className="w-4 h-4" /> 
    },
    { 
      id: 'privacy', 
      label: 'Privacy Policy', 
      icon: <ShieldCheck className="w-4 h-4" /> 
    },
    { 
      id: 'refund', 
      label: 'Refund & Cancellation', 
      icon: <RefreshCw className="w-4 h-4" /> 
    },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#1E1714]/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
      id="policy-modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-[#FAF8F5] text-[#3C2A21] w-full max-w-4xl border border-[#3C2A21]/15 shadow-2xl relative overflow-hidden rounded-xl flex flex-col md:flex-row h-[85vh] max-h-[700px]"
        onClick={(e) => e.stopPropagation()}
        id="policy-modal-card"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#3C2A21]/60 hover:text-[#BFA15F] transition-colors rounded-full hover:bg-stone-100"
          id="policy-modal-close-btn"
          aria-label="Close legal modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar Tabs (Desktop) */}
        <div className="w-full md:w-[30%] bg-stone-100/70 border-b md:border-b-0 md:border-r border-[#3C2A21]/10 p-6 flex flex-col gap-6 justify-between flex-shrink-0">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#BFA15F] font-bold">
                Boutique Atelier
              </span>
              <span className="font-serif text-lg font-light tracking-wide text-[#3C2A21] mt-0.5">
                Monica Interiors
              </span>
            </div>

            {/* Tab buttons */}
            <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-2 pb-2 md:pb-0 scrollbar-none">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-sans font-medium rounded transition-all whitespace-nowrap md:whitespace-normal w-full text-left cursor-pointer ${
                      isActive 
                        ? 'bg-[#3C2A21] text-[#FAF8F5]' 
                        : 'text-[#6B625E] hover:bg-stone-200/55 hover:text-[#3C2A21]'
                    }`}
                    id={`policy-tab-btn-${tab.id}`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-2 border-t border-[#3C2A21]/10 pt-4 font-sans text-[10px] text-[#6B625E]/80">
            <div className="flex items-center gap-1.5 font-semibold text-[#BFA15F] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Gateway Compliant</span>
            </div>
            <span>Payments secured via safe SSL certificates and verified industry credentials.</span>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-grow p-6 md:p-10 overflow-y-auto font-sans text-sm text-[#6B625E] leading-relaxed relative flex flex-col">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-grow flex flex-col"
            >
              
              {/* CONTACT TAB */}
              {activeTab === 'contact' && (
                <div className="flex flex-col gap-6" id="policy-content-contact">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#BFA15F] font-semibold">
                      Reach Our Team
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#3C2A21] tracking-tight mt-1">
                      Contact Us & Studio Atelier
                    </h3>
                  </div>

                  <p className="font-light">
                    We look forward to discussing your spatial layouts, material layering requirements, and budget targets. Reach out directly or visit our office headquarters.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="border border-[#3C2A21]/10 bg-white p-4 rounded flex flex-col gap-2">
                      <div className="flex items-center gap-2.5 text-[#3C2A21] font-semibold font-serif">
                        <MapPin className="w-4.5 h-4.5 text-[#BFA15F]" />
                        <span>Studio Address</span>
                      </div>
                      <p className="text-xs font-light">
                        Monica Interiors Studio<br />
                        Bandra West, Link Road Area<br />
                        Mumbai, MH &bull; India (400050)
                      </p>
                    </div>

                    <div className="border border-[#3C2A21]/10 bg-white p-4 rounded flex flex-col gap-2">
                      <div className="flex items-center gap-2.5 text-[#3C2A21] font-semibold font-serif">
                        <Clock className="w-4.5 h-4.5 text-[#BFA15F]" />
                        <span>Studio Hours</span>
                      </div>
                      <p className="text-xs font-light">
                        Monday - Saturday<br />
                        10:00 AM - 7:00 PM IST<br />
                        Sundays - By Appointment Only
                      </p>
                    </div>

                    <div className="border border-[#3C2A21]/10 bg-white p-4 rounded flex flex-col gap-2">
                      <div className="flex items-center gap-2.5 text-[#3C2A21] font-semibold font-serif">
                        <Phone className="w-4.5 h-4.5 text-[#BFA15F]" />
                        <span>Call or WhatsApp</span>
                      </div>
                      <p className="text-xs font-light">
                        <a href="tel:+919137062574" className="hover:text-[#BFA15F] font-mono transition-colors">+91 9137062574</a>
                        <span className="block text-[10px] text-stone-400 mt-1">Bookings, civil queries & estimates</span>
                      </p>
                    </div>

                    <div className="border border-[#3C2A21]/10 bg-white p-4 rounded flex flex-col gap-2">
                      <div className="flex items-center gap-2.5 text-[#3C2A21] font-semibold font-serif">
                        <Mail className="w-4.5 h-4.5 text-[#BFA15F]" />
                        <span>Email Contact</span>
                      </div>
                      <p className="text-xs font-light flex items-center justify-between gap-1">
                        <a href="mailto:monicainteriors23@gmail.com" className="hover:text-[#BFA15F] font-mono transition-colors break-all">
                          monicainteriors23@gmail.com
                        </a>
                        <button 
                          onClick={copyContact}
                          className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-[#3C2A21] transition-colors"
                          title="Copy Email"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#BFA15F]/20 rounded-md p-5 mt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex-grow">
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-[#3C2A21]">Need an immediate concept walkthrough?</h4>
                      <p className="text-xs font-light text-stone-500 mt-1">Select one of our premium design layouts to launch an instant secured video session booking.</p>
                    </div>
                    <a 
                      href="https://maps.app.goo.gl/De1WH2acvmSum1HVA"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#3C2A21] text-[#FAF8F5] hover:bg-[#BFA15F] hover:text-[#1E1714] transition-all text-[10px] uppercase tracking-wider font-semibold py-2.5 px-4 rounded whitespace-nowrap"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              )}

              {/* TERMS TAB */}
              {activeTab === 'terms' && (
                <div className="flex flex-col gap-6" id="policy-content-terms">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#BFA15F] font-semibold">
                      Legal Frame
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#3C2A21] tracking-tight mt-1">
                      Terms & Conditions
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4 font-light text-xs md:text-sm">
                    <p>
                      <strong>1. Agreement to Terms:</strong> By accessing the Monica Interiors website (the "Platform"), initiating a style quiz, simulating mood boards, or purchasing pre-secured digital slot consultations, you agree to comply with and be bound by these local design service Terms.
                    </p>
                    <p>
                      <strong>2. Creative Services Scope:</strong> Monica Interiors Studio acts as a full-service custom architectural renderer and coordinator based in Mumbai, India. Digital booking vouchers cover design checklists and video consultation time. Full turnkey execution (civil site work, custom woodwork installations, and architectural handoffs) requires a separate physical contract.
                    </p>
                    <p>
                      <strong>3. Payment & Online Billing:</strong> Consultation fees are secure and captured in Indian Rupees (₹) via authorized transaction channels. By submitting payment, you affirm that the credentials supplied belong to you, are authentic, and have adequate funds to lock in your booked designer slot.
                    </p>
                    <p>
                      <strong>4. Intellectual Property:</strong> All spatial calculations, material boards, color palettes, mock blueprints, 3D modular cabinets drawings, and website content remains the exclusive intellectual and design copyright of Monica Interiors. You may use provided assets solely for your relative home renovation projects.
                    </p>
                    <p>
                      <strong>5. Limitation of Liability:</strong> We prioritize absolute safety and design diligence on site, but cannot be held liable for third-party shipping delays of raw laminate woodworks or unexpected civil site conditions out of our architectural control.
                    </p>
                  </div>
                </div>
              )}

              {/* PRIVACY TAB */}
              {activeTab === 'privacy' && (
                <div className="flex flex-col gap-6" id="policy-content-privacy">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#BFA15F] font-semibold">
                      Personal Shield
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#3C2A21] tracking-tight mt-1">
                      Privacy Policy
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4 font-light text-xs md:text-sm">
                    <p>
                      <strong>1. Transmitted Information:</strong> When you operate the platform, book designer spaces, or compile custom color quiz answers, we collect necessary coordinates to furnish the requested services. This includes name, phone number, design quiz styles chosen, and transaction references.
                    </p>
                    <p>
                      <strong>2. Secure Transaction Handshakes:</strong> All credit card details, UPI inputs, or bank codes are routed directly through secured standard payment partner APIs (such as Razorpay). At no point does Monica Interiors intercept, store, or process your raw payment keys on our servers.
                    </p>
                    <p>
                      <strong>3. Dynamic Meet Coordination:</strong> We send transactional scheduling notifications with real-time dynamic video links. We never share your primary telephone contacts or email folders with outside advertisement directories or cold lists.
                    </p>
                    <p>
                      <strong>4. Retention & Protection:</strong> All details are safely protected within secured, authorized databases. We maintain data records solely for the duration required to handle your space planning renovations and transactional accounting audits.
                    </p>
                    <p>
                      <strong>5. Client Support Mailbox:</strong> If you ever wish to securely query what coordinates we hold, or ask us to permanently purge your quiz history, simply email <a href="mailto:monicainteriors23@gmail.com" className="text-[#BFA15F] underline font-mono">monicainteriors23@gmail.com</a>.
                    </p>
                  </div>
                </div>
              )}

              {/* REFUND TAB */}
              {activeTab === 'refund' && (
                <div className="flex flex-col gap-6" id="policy-content-refund">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#BFA15F] font-semibold">
                      Booking Protections
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#3C2A21] tracking-tight mt-1">
                      Refund & Cancellation Policy
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4 font-light text-xs md:text-sm">
                    <p>
                      <strong>1. Video Consult Reservations:</strong> We understand scheduling plans shift! Pre-booked consultation deposits (such as ₹250 or other designated amounts) are fully refundable if a cancellation request is submitted at least <strong>24 hours</strong> prior to your scheduled time slot.
                    </p>
                    <p>
                      <strong>2. Cancellations Within 24 Hours:</strong> If you need to cancel within 24 hours of your booking, you can choose to reschedule to any future date for free, or cancel with a 50% reservation deposit refund to cover pre-allocated design desk checks.
                    </p>
                    <p>
                      <strong>3. Completed Services:</strong> Consultation and planning fees are non-refundable once the full video session has been successfully initiated, or custom layout checklists have been prepared and delivered to the client.
                    </p>
                    <p>
                      <strong>4. Turnkey Service Retainers:</strong> Retainers and milestones paid under physical woodwork, plumbing, or raw turnkey building deliverables are governed specifically by the signed civil site contract rather than virtual checkout norms.
                    </p>
                    <p>
                      <strong>5. Refund Disbursement:</strong> Once approved, your refund will be processed back automatically through the original source channel (Razorpay API back to your debit/credit card, net banking, or UPI identifier) within <strong>5 to 7 operational bank days</strong>.
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Footer inside viewport */}
          <div className="border-t border-[#3C2A21]/15 pt-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-sans text-stone-400">
            <span>Last Updated: June 2026</span>
            <span>Monica Interiors &bull; Bandra West, Mumbai</span>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
