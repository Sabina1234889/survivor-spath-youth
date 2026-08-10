import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Building, Handshake } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

interface ContactPageProps {
  onOpenInvolvementModal: (type: 'Partner With Us') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenInvolvementModal }) => {
  const { addInboxItem, siteContent } = useCms();
  const contactInfo = siteContent?.contactInfo || {
    email: 'info@survivorspathyouth.org',
    phone: '+880 1700-000000',
    officeLocations: 'Dhaka & Jessore Division Headquarters, Bangladesh',
  };
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addInboxItem({
        category: 'General Messages',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        organizationOrSchool: formData.organization || undefined,
        subjectOrRole: formData.subject || 'Direct Contact Form Message',
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err: any) {
      alert('Error submitting message: ' + (err?.message || 'Please check connection and try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white py-16 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-800/80 px-3.5 py-1 rounded-full border border-purple-600">
            OPEN COMMUNICATION
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display leading-tight">
            Let’s Connect.
          </h1>
          <p className="text-base sm:text-lg text-purple-200 font-medium max-w-2xl mx-auto">
            We welcome inquiries from schools, students, civil society partners, international donors, and media representatives.
          </p>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Info Left */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white p-8 rounded-3xl shadow-lg space-y-6">
              <h2 className="text-2xl font-extrabold font-display">Survivor’s Path Youth</h2>
              <p className="text-purple-200 text-sm leading-relaxed">
                An initiative dedicated to empowering youth, delivering institutional safety education, and fostering survivor-centered support across Bangladesh.
              </p>

              <div className="space-y-4 pt-2 text-sm text-purple-100">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-purple-800/80 text-purple-300 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-purple-300">Office Locations</h4>
                    <p className="text-sm mt-0.5">{contactInfo.officeLocations}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-purple-800/80 text-purple-300 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-purple-300">Email Us</h4>
                    <a href={`mailto:${contactInfo.email}`} className="text-sm hover:underline mt-0.5 block">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-purple-800/80 text-purple-300 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-purple-300">Helpline / Phone</h4>
                    <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`} className="text-sm hover:underline mt-0.5 block">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Invitation Card */}
            <div className="bg-purple-50 p-8 rounded-3xl border border-purple-100 space-y-4">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase tracking-wider">
                <Building className="w-4 h-4 text-purple-600" />
                <span>Partner With Us</span>
              </div>
              <h3 className="text-xl font-bold text-purple-950">
                Institutional & School Collaborations
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                We invite schools, universities, NGOs, corporate sponsors, and development institutions to join hands in scaling safety campaigns and youth leadership programs.
              </p>
              <button
                onClick={() => onOpenInvolvementModal('Partner With Us')}
                className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Handshake className="w-4 h-4" />
                <span>Submit Partner Proposal</span>
              </button>
            </div>
          </div>

          {/* Contact Form Right */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-purple-100 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in duration-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-700">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-purple-950">Message Sent!</h3>
                <p className="text-gray-600 text-sm max-w-sm mx-auto">
                  Thank you for reaching out to Survivor’s Path Youth. Our communications team will respond to your query shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      organization: '',
                      subject: '',
                      message: '',
                    });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl font-bold text-xs uppercase bg-purple-800 text-white cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-extrabold text-purple-950 font-display mb-2">
                  Send Us a Direct Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abdullah Al Mamun"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1700-000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Organization / School <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your school or institution"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="General Inquiry, Event Partnership, etc."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist or collaborate with you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-purple-700 hover:bg-purple-800 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
