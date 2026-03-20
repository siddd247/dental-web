import { useState } from 'react';
import { Phone, MapPin, Clock, CheckCircle2, Send } from 'lucide-react';
import { addMessage } from '../../stores/localStorageInfo';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', mobile: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation
  const isNameValid = formData.name.length >= 3;
  const isMobileValid = /^\d{10}$/.test(formData.mobile);
  const isMessageValid = formData.message.length >= 5;
  const isFormValid = isNameValid && isMobileValid && isMessageValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    
    await addMessage({
      name: formData.name,
      mobile: formData.mobile,
      message: formData.message
    });
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', mobile: '', message: '' });
    }, 5000);
  };

  const getBorderColor = (value, isValid) => {
    if (value.length === 0) return "border-slate-300 focus:border-primary-500 focus:ring-primary-500";
    return isValid ? "border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50/10" : "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/30";
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-in fade-in duration-500">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200">
          <div className="mx-auto bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600 animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Message Sent Successfully!</h2>
          <p className="text-lg text-slate-600 mb-8">
            Thank you for reaching out, {formData.name}. We have received your inquiry and will be in touch with you shortly.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({ name: '', mobile: '', message: '' });
            }}
            className="text-primary-600 font-semibold hover:text-primary-800 transition-colors"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20 flex flex-col items-center">
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-slate-600 text-lg">
          Have a question or need to schedule a specific procedure? Drop us a message or call our clinic directly!
        </p>
      </div>

      <div className="w-full grid lg:grid-cols-3 gap-10">
        
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full">
            <h3 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Clinic Details</h3>
            
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="bg-primary-50 p-3 rounded-2xl text-primary-600 shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Phone</h4>
                  <p className="text-slate-600 mt-1 hover:text-primary-600 transition-colors cursor-pointer">(123) 456-7890</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary-50 p-3 rounded-2xl text-primary-600 shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Address</h4>
                  <p className="text-slate-600 mt-1">
                    123 Dental Suite<br/>
                    Health Avenue, NY 10001
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary-50 p-3 rounded-2xl text-primary-600 shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Hours</h4>
                  <p className="text-slate-600 mt-1">Mon-Sat 9AM-5PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`block w-full rounded-xl border-2 px-4 py-3 outline-none transition-colors ${getBorderColor(formData.name, isNameValid)}`}
                    placeholder="Jane Doe"
                  />
                  {formData.name.length > 0 && !isNameValid && (
                    <p className="text-red-500 text-xs mt-1">Name must be at least 3 characters.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ''); // strict numeric
                      setFormData({...formData, mobile: val});
                    }}
                    className={`block w-full rounded-xl border-2 px-4 py-3 outline-none transition-colors ${getBorderColor(formData.mobile, isMobileValid)}`}
                    placeholder="1234567890"
                  />
                  {formData.mobile.length > 0 && !isMobileValid && (
                    <p className="text-red-500 text-xs mt-1">Please enter exactly 10 digits.</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className={`block w-full rounded-xl border-2 px-4 py-3 outline-none transition-colors resize-none ${getBorderColor(formData.message, isMessageValid)}`}
                  placeholder="How can we help you today?"
                />
                {formData.message.length > 0 && !isMessageValid && (
                  <p className="text-red-500 text-xs mt-1">Message is too short.</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="w-full flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" /> Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
