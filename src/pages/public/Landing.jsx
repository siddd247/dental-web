import { Link } from 'react-router-dom';
import { ShieldCheck, Stethoscope, Clock, Sparkles } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Your Smile, <span className="text-primary-600">Our Priority</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Provide your family with the highest quality dental care in a comfortable, trustworthy environment. Book your visit today.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <Link 
              to="/book" 
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              Book an Appointment
            </Link>
            <Link 
              to="/contact" 
              className="bg-white text-primary-600 border border-slate-200 hover:bg-slate-50 font-semibold px-8 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose SmileCare?</h2>
            <p className="text-slate-600 mt-4">We combine expertise with compassion to give you the best experience.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-slate-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Trusted Experts</h3>
              <p className="text-slate-600">Our team consists of highly qualified professionals with years of experience.</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Modern Technology</h3>
              <p className="text-slate-600">We utilize the latest equipment to ensure painless and efficient treatments.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Flexible Timings</h3>
              <p className="text-slate-600">We offer convenient scheduling options to fit your busy lifestyle.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready for a Brighter Smile?</h2>
          <Link 
            to="/book" 
            className="bg-white text-primary-700 hover:bg-slate-50 font-bold px-8 py-3 rounded-full shadow-lg transition-transform hover:scale-105 inline-block"
          >
            Schedule Your Visit
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
