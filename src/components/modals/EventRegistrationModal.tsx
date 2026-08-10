import React, { useState } from 'react';
import { EventItem } from '../../types';
import { useCms } from '../../context/CmsContext';
import { X, Calendar, MapPin, CheckCircle2, Ticket, User, Phone, Mail, School, Shirt, AlertCircle, HelpCircle, ExternalLink } from 'lucide-react';

interface EventRegistrationModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  event,
  onClose,
}) => {
  const { addEventAttendee } = useCms();
  const [submitted, setSubmitted] = useState(false);
  const [ticketCode, setTicketCode] = useState('');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [tShirtSize, setTShirtSize] = useState('M');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');

  if (!event) return null;

  const fields = event.registrationFields || {
    collectPhone: true,
    collectEmail: true,
    collectSchool: true,
    collectTShirtSize: false,
    collectEmergencyContact: false,
    collectCustomQuestion: false,
    customQuestionPrompt: 'Additional Details',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = 'SPYF-' + Math.floor(100000 + Math.random() * 900000);
    setTicketCode(code);

    // Save to CMS context
    addEventAttendee({
      eventId: event.id,
      eventTitle: event.title,
      fullName: fullName,
      phone: fields.collectPhone ? phone : undefined,
      email: fields.collectEmail ? email : undefined,
      schoolOrInstitution: fields.collectSchool ? school : undefined,
      tShirtSize: fields.collectTShirtSize ? tShirtSize : undefined,
      emergencyContact: fields.collectEmergencyContact ? emergencyContact : undefined,
      customQuestionAnswer: fields.collectCustomQuestion ? customAnswer : undefined,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-purple-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-600/90 text-[11px] font-bold uppercase tracking-wider text-purple-100">
            Event Registration
          </span>
          <h2 className="text-xl font-bold mt-2 pr-6 leading-snug">{event.title}</h2>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-purple-200">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-300" />
              {event.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-300" />
              {event.location}
            </span>
          </div>
        </div>

        {/* Form or Confirmation */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              {/* Big Animated Green Checkmark */}
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-30" />
                <div className="relative w-20 h-20 bg-emerald-100/90 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-in zoom-in duration-300" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-gray-900 font-display">
                  Registration Successful!
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm max-w-sm mx-auto mt-2 leading-relaxed">
                  Thank you <span className="font-bold text-purple-950">{fullName}</span> for registering for{' '}
                  <span className="font-semibold text-purple-950">{event.title}</span>. Your details have been stored safely in our registration records.
                </p>
              </div>

              {/* Entry Pass Ticket Code */}
              <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 text-center max-w-xs mx-auto shadow-2xs">
                <div className="flex items-center justify-center gap-1.5 text-purple-800 text-[11px] font-bold uppercase tracking-wider">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Your Entry Pass Code</span>
                </div>
                <div className="text-xl font-mono font-bold text-purple-950 tracking-widest mt-0.5">
                  {ticketCode}
                </div>
              </div>

              {/* Conditional WhatsApp Group Redirect Button */}
              {event.whatsappGroupLink && event.whatsappGroupLink.trim() !== '' ? (
                <div className="pt-2 space-y-3 max-w-md mx-auto">
                  <a
                    href={event.whatsappGroupLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm text-white bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 tracking-wide group"
                  >
                    <span className="text-lg leading-none">💬</span>
                    <span>Join Event WhatsApp Group for Updates</span>
                    <ExternalLink className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-8 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-purple-900 hover:bg-purple-950 shadow-md transition-all cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-100 text-xs text-purple-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-700 flex-shrink-0" />
                <span>
                  Please fill in the required fields below to secure your event access badge.
                </span>
              </div>

              {/* Required Full Name Field */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-800 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-700" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 text-sm outline-none transition-all"
                />
              </div>

              {/* Dynamic Toggled Fields */}
              {fields.collectEmail && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-800 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-700" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 text-sm outline-none transition-all"
                  />
                </div>
              )}

              {fields.collectPhone && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-800 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-700" />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1700-000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 text-sm outline-none transition-all"
                  />
                </div>
              )}

              {fields.collectSchool && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-800 mb-1 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-purple-700" />
                    <span>School / Institution *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jessore Zilla School / University of Dhaka"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 text-sm outline-none transition-all"
                  />
                </div>
              )}

              {fields.collectTShirtSize && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-800 mb-1 flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-purple-700" />
                    <span>T-Shirt Size *</span>
                  </label>
                  <select
                    value={tShirtSize}
                    onChange={(e) => setTShirtSize(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 text-sm outline-none transition-all bg-white"
                  >
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">Extra Large (XL)</option>
                    <option value="XXL">Double Extra Large (XXL)</option>
                  </select>
                </div>
              )}

              {fields.collectEmergencyContact && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-800 mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-purple-700" />
                    <span>Emergency Contact Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. Guardian Name & +880 1800-000000"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 text-sm outline-none transition-all"
                  />
                </div>
              )}

              {fields.collectCustomQuestion && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-800 mb-1 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-700" />
                    <span>{fields.customQuestionPrompt || 'Custom Question'} *</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Provide your answer..."
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 text-sm outline-none transition-all"
                  />
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-800 shadow-md transition-all cursor-pointer"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
