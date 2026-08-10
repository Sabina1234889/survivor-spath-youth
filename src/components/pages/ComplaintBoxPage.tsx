import React, { useState } from 'react';
import { ShieldCheck, Lock, Upload, CheckCircle2, FileText, MapPin } from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { BANGLADESH_DIVISIONS, BANGLADESH_DISTRICTS } from '../../data/mockData';

export const ComplaintBoxPage: React.FC = () => {
  const { addComplaint } = useCms();
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    emailOrPhone: '',
    institution: '',
    category: 'General Concern',
    division: '',
    district: '',
    subject: '',
    description: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFileUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generated = 'CB-' + Math.floor(100000 + Math.random() * 900000);

    addComplaint({
      fullName: formData.fullName || 'Anonymous Complainant',
      emailOrPhone: formData.emailOrPhone,
      institution: formData.institution,
      category: formData.category,
      division: formData.division,
      district: formData.district,
      subject: formData.subject,
      description: formData.description,
      attachmentName: fileName || undefined,
      attachmentUrl: fileUrl || undefined,
    });

    setRefCode(generated);
    setSubmitted(true);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Calm Header */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white py-16 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-800/80 text-purple-200 text-xs font-bold uppercase tracking-wider border border-purple-600">
            <Lock className="w-3.5 h-3.5 text-purple-300" />
            <span>SAFE & CONFIDENTIAL REPORTING</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display leading-tight">
            Your Voice Matters.
          </h1>
          <p className="text-base sm:text-lg text-purple-200/90 leading-relaxed font-normal">
            If you have experienced a concern, misconduct, harassment, discrimination or any issue
            related to our activities or programs, you can share it with us.
          </p>
        </div>
      </section>

      {/* Main Form Container in Calm Lavender */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-purple-50/70 rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm space-y-8">
          {/* Prominent Privacy Notice Box */}
          <div className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-2xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-purple-950">Strict Confidentiality Assurance</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                “Your information will be treated respectfully and handled confidentially.” Providing
                your name, contact details, or institution is strictly optional. You may submit
                completely anonymously if you prefer.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="bg-white p-8 rounded-2xl border border-purple-200 text-center space-y-5 animate-in fade-in duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-700">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-purple-950">
                Complaint Submitted Securely
              </h3>
              <p className="text-sm text-gray-700 max-w-md mx-auto leading-relaxed">
                Your submission has been encrypted and routed directly to our chief safeguarding cell.
                We take all reported matters seriously and will investigate discreetly.
              </p>

              {(formData.division || formData.district) && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 rounded-lg text-xs font-semibold text-purple-900">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>
                    Location logged: {formData.district ? `${formData.district}, ` : ''}{formData.division} Division
                  </span>
                </div>
              )}

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 max-w-xs mx-auto">
                <div className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                  Confidential Reference ID
                </div>
                <div className="text-2xl font-mono font-bold text-purple-950 mt-1">{refCode}</div>
                <p className="text-[11px] text-gray-500 mt-1">Please save this code for follow-ups.</p>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    fullName: '',
                    emailOrPhone: '',
                    institution: '',
                    category: 'General Concern',
                    division: '',
                    district: '',
                    subject: '',
                    description: '',
                  });
                  setFileName('');
                }}
                className="mt-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-purple-800 text-white hover:bg-purple-900 transition-colors cursor-pointer"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-purple-100 space-y-5">
              {/* Row 1: Full Name & Email/Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Full Name <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Leave blank for anonymity"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none bg-gray-50/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Email / Phone <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="If you desire a reply"
                    value={formData.emailOrPhone}
                    onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none bg-gray-50/30"
                  />
                </div>
              </div>

              {/* Row 2: School/Institution & Complaint Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    School / Institution <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Name of school or college"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none bg-gray-50/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Complaint Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none bg-white cursor-pointer"
                  >
                    <option value="Program Conduct">Program Conduct / Event Issue</option>
                    <option value="Harassment/Safety">Harassment or Safety Concern</option>
                    <option value="Misconduct">Staff / Volunteer Misconduct</option>
                    <option value="General Concern">General Concern</option>
                    <option value="Confidential Inquiry">Confidential Legal/Psychological Inquiry</option>
                  </select>
                </div>
              </div>

              {/* Row 3 (NEW ROW): Location Tracking - DIVISION & DISTRICT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    DIVISION *
                  </label>
                  <select
                    required
                    value={formData.division}
                    onChange={(e) => {
                      const selectedDiv = e.target.value;
                      const districtList = BANGLADESH_DISTRICTS[selectedDiv] || [];
                      setFormData({
                        ...formData,
                        division: selectedDiv,
                        district: districtList.includes(formData.district) ? formData.district : '',
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none bg-white cursor-pointer"
                  >
                    <option value="" disabled>Select Division</option>
                    {BANGLADESH_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    DISTRICT *
                  </label>
                  <select
                    required
                    disabled={!formData.division}
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none bg-white cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>
                      {formData.division ? 'Select District' : 'Select Division First'}
                    </option>
                    {formData.division &&
                      BANGLADESH_DISTRICTS[formData.division]?.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Subject */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Summary of your concern"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none"
                />
              </div>

              {/* Row 5: Detailed Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Please describe the situation, dates, location or relevant context clearly..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm outline-none"
                />
              </div>

              {/* Row 6: Optional Attachment */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Attachment <span className="text-gray-400 font-normal">(Optional: Screenshot, document or image)</span>
                </label>
                <div className="relative border-2 border-dashed border-purple-200 rounded-xl p-4 text-center hover:bg-purple-50/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Upload className="w-5 h-5 text-purple-600" />
                    <span className="text-xs text-purple-900 font-medium">
                      {fileName ? fileName : 'Click or drop a file to attach'}
                    </span>
                    <span className="text-[10px] text-gray-400">PDF, PNG, JPG up to 10MB</span>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-purple-700 hover:bg-purple-800 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>SUBMIT COMPLAINT</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
