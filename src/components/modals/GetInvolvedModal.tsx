import React, { useState } from 'react';
import { X, CheckCircle2, Heart, Users, Building, School } from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { InboxCategory } from '../../types';

export type InvolvementType =
  | 'Volunteer'
  | 'Partner With Us'
  | 'Sponsor an Event'
  | 'School Collaboration';

interface GetInvolvedModalProps {
  type: InvolvementType | null;
  onClose: () => void;
}

export const GetInvolvedModal: React.FC<GetInvolvedModalProps> = ({ type, onClose }) => {
  const { addInboxItem } = useCms();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organizationOrSchool: '',
    district: 'Dhaka',
    message: '',
  });

  if (!type) return null;

  const getIcon = () => {
    switch (type) {
      case 'Volunteer':
        return <Heart className="w-5 h-5 text-purple-300" />;
      case 'Partner With Us':
        return <Users className="w-5 h-5 text-purple-300" />;
      case 'Sponsor an Event':
        return <Building className="w-5 h-5 text-purple-300" />;
      case 'School Collaboration':
        return <School className="w-5 h-5 text-purple-300" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let category: InboxCategory = 'Volunteer Applications';
    let subjectOrRole = type as string;

    if (type === 'Volunteer') {
      category = 'Volunteer Applications';
      subjectOrRole = 'Youth Volunteer Advocate Application';
    } else if (type === 'Partner With Us' || type === 'Sponsor an Event') {
      category = 'Partnership & Sponsorships';
      subjectOrRole =
        type === 'Sponsor an Event'
          ? 'Event Sponsorship Inquiry'
          : 'Institutional Partnership Proposal';
    } else if (type === 'School Collaboration') {
      category = 'School Collaborations';
      subjectOrRole = 'Campus Safety & Consent Session Request';
    }

    addInboxItem({
      category,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      organizationOrSchool: formData.organizationOrSchool || undefined,
      districtOrLocation: formData.district || undefined,
      subjectOrRole,
      message: formData.message || `Application / Proposal submitted for ${type}.`,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-purple-100">
        <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            {getIcon()}
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Get Involved
            </span>
          </div>
          <h2 className="text-xl font-bold pr-6">{type}</h2>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-700">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-purple-950">Application Received!</h3>
              <p className="text-gray-600 text-sm max-w-sm mx-auto">
                Thank you for your interest in{' '}
                <span className="font-semibold text-purple-900">{type}</span>. Our team will
                review your application and contact you shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-purple-800 hover:bg-purple-900 shadow-md cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Full Name / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nusrat Parveen"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Institution / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="Name of school, NGO or company"
                    value={formData.organizationOrSchool}
                    onChange={(e) =>
                      setFormData({ ...formData, organizationOrSchool: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    District / Division *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none bg-white"
                  >
                    <option value="Jessore">Jessore</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  How would you like to collaborate? *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share a brief description of your goals or background..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
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
                  Submit Interest
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
