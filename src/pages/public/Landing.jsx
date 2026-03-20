import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Stethoscope, Clock, Sparkles, MapPin, Star, Camera, ChevronLeft, ChevronRight } from 'lucide-react';

const Landing = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80" },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1598256989800-fea5ce5146f2?auto=format&fit=crop&q=80" }
  ];

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const time = hours + minutes / 60;
      
      if (day === 0) {
        setIsOpen(false);
      } else {
        const isMorningSession = time >= 10 && time < 13;
        const isEveningSession = time >= 16.5 && time < 21;
        setIsOpen(isMorningSession || isEveningSession);
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section with Background Carousel */}
      <section className="relative py-20 lg:py-32 overflow-hidden flex items-center justify-center min-h-[600px] lg:min-h-[700px] group">
        
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0 bg-slate-100">
          <div 
            className="flex transition-transform duration-1000 ease-in-out h-full w-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselSlides.map((slide) => (
              <div key={slide.id} className="min-w-full h-full relative">
                <img 
                  src={slide.imageUrl} 
                  alt="Clinic" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* Light Overlay to make dark text readable */}
          <div className="absolute inset-0 bg-white/85 sm:bg-white/75 md:bg-white/60 backdrop-blur-[2px]"></div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute z-20 top-1/2 -translate-y-1/2 left-4 w-12 h-12 bg-white/50 hover:bg-white/90 backdrop-blur-md text-primary-700 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute z-20 top-1/2 -translate-y-1/2 right-4 w-12 h-12 bg-white/50 hover:bg-white/90 backdrop-blur-md text-primary-700 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute z-20 bottom-6 left-0 right-0 flex justify-center gap-2">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all shadow-md ${currentSlide === index ? "bg-primary-600 scale-125" : "bg-white/70 hover:bg-white"}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full py-10 rounded-3xl">
          <div className="mb-8 inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200 shadow-sm text-sm font-medium">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            {isOpen ? <span className="text-green-700">Open Now</span> : <span className="text-red-700">Closed</span>}
            <span className="text-slate-400 mx-1">|</span>
            <span className="text-slate-600">Hours: Mon-Sat 10AM-1PM & 4:30PM-9PM</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 drop-shadow-sm">
            Your Smile, <span className="text-primary-700">Our Priority</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-800 font-medium max-w-2xl mx-auto mb-10 drop-shadow-sm">
            Provide your family with the highest quality dental care in a comfortable, trustworthy environment. Book your visit today.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <Link 
              to="/book" 
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-full shadow-xl transition-transform hover:scale-105"
            >
              Book an Appointment
            </Link>
            <a 
              href="https://www.google.com/maps/place/Dr.+Gagan+dental+care/@32.6930174,74.871287,17z/data=!3m1!4b1!4m6!3m5!1s0x391e85f2c359fc03:0xfb7b54989e96abc2!8m2!3d32.6930174!4d74.871287!16s%2Fg%2F11j8mcp0k9?entry=ttu&g_ep=EgoyMDI2MDMxNy4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/95 backdrop-blur-sm text-primary-700 border-2 border-primary-500 hover:bg-white font-semibold px-8 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" /> Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Gagan Dental Care?</h2>
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
      
      {/* Reviews Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">What Our Patients Say</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:-translate-y-1 transition-transform border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">RS</div>
                <div>
                  <h4 className="font-bold text-slate-900">Rahul Sharma</h4>
                  <div className="flex gap-1 text-yellow-400 mt-1">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-slate-600 italic">"Excellent dental care! Dr. Gagan is very professional and gentle. The clinic is clean and well-equipped. Highly recommended!"</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md hover:-translate-y-1 transition-transform border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg">PM</div>
                <div>
                  <h4 className="font-bold text-slate-900">Priya Malhotra</h4>
                  <div className="flex gap-1 text-yellow-400 mt-1">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-slate-600 italic">"Best dental clinic in Jammu! Very affordable and the staff is extremely friendly. My entire family visits here."</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:-translate-y-1 transition-transform border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">AG</div>
                <div>
                  <h4 className="font-bold text-slate-900">Amit Gupta</h4>
                  <div className="flex gap-1 text-yellow-400 mt-1">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 text-slate-200 fill-slate-200" />
                  </div>
                </div>
              </div>
              <p className="text-slate-600 italic">"Great experience overall. Doctor explains everything clearly before treatment. Will definitely come back!"</p>
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
