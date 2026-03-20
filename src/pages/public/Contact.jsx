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

      {/* Clinic Info Cards */}
      <div className="w-full grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-primary-50 p-8 rounded-2xl shadow-sm flex flex-col items-center text-center">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <MapPin className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Address</h3>
          <p className="text-slate-600 mb-6 flex-1">
            H.no.133, 7, Lane 5,<br/>
            Guru Nanak Nagar, Jammu,<br/>
            Jammu and Kashmir 180004
          </p>
          <a
            href="https://www.google.com/maps/place/Dr.+Gagan+dental+care/@32.6930174,74.871287,17z/data=!3m1!4b1!4m6!3m5!1s0x391e85f2c359fc03:0xfb7b54989e96abc2!8m2!3d32.6930174!4d74.871287!16s%2Fg%2F11j8mcp0k9?entry=ttu&g_ep=EgoyMDI2MDMxNy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white text-primary-600 hover:bg-primary-600 hover:text-white border border-primary-200 font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Get Directions
          </a>
        </div>

        <div className="bg-primary-50 p-8 rounded-2xl shadow-sm flex flex-col items-center text-center">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Phone className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Phone</h3>
          <p className="text-slate-600 mb-6 flex-1 text-lg font-medium">
            096221 72998
          </p>
          <a
            href="tel:09622172998"
            className="w-full bg-primary-600 text-white hover:bg-primary-700 font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Call Now
          </a>
        </div>

        <div className="bg-primary-50 p-8 rounded-2xl shadow-sm flex flex-col items-center text-center">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Clock className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Hours</h3>
          <div className="text-slate-600 mb-6 flex-1">
            <p className="font-medium text-slate-700">Monday - Saturday</p>
            <p>10 AM – 1 PM</p>
            <p className="mb-2">4:30 PM – 9 PM</p>
            <p className="font-medium text-slate-700 mt-3 pt-3 border-t border-primary-100">Sunday: <span className="text-red-500 font-semibold">Closed</span></p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="w-full max-w-3xl mx-auto">
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
                    placeholder="Your Full Name"
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
                    placeholder="10-digit Mobile"
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
  );
};

export default Contact;
