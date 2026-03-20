import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, startOfToday } from 'date-fns';
import { CheckCircle2, ChevronRight, Clock, CalendarDays, User, Phone, FileText } from 'lucide-react';
import { addBooking, getSlotStatus } from '../../stores/localStorageInfo';

// 30 min slots from 9 AM to 5 PM
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

const Booking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({ name: '', mobile: '', reason: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [slotStatuses, setSlotStatuses] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Generate 7 days starting from today
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfToday(), i));
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    const loadSlots = async () => {
      setLoadingSlots(true);
      const statuses = {};
      await Promise.all(
        TIME_SLOTS.map(async (slot) => {
          statuses[slot] = await getSlotStatus(dateStr, slot);
        })
      );
      setSlotStatuses(statuses);
      setLoadingSlots(false);
    };
    loadSlots();
  }, [dateStr]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTime || !formData.name || !formData.mobile) return;
    
    if (!/^\d{10}$/.test(formData.mobile)) {
      alert("Please enter exactly 10 digits for the mobile number without any country code or special characters.");
      return;
    }

    await addBooking({
      ...formData,
      date: dateStr,
      timeSlot: selectedTime
    });

    setIsSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 4000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Booking Confirmed!</h2>
          <p className="text-lg text-slate-600 mb-8">
            Thank you, {formData.name}. Your appointment is scheduled for{' '}
            <span className="font-semibold text-primary-700">{format(selectedDate, 'MMM dd, yyyy')}</span> at{' '}
            <span className="font-semibold text-primary-700">{selectedTime}</span>.
          </p>
          <button onClick={() => navigate('/')} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Book an Appointment</h1>
        <p className="text-slate-600 mt-3 text-lg">Select a convenient date and time for your visit.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Step 1 & 2: Date & Time Selection */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
            <CalendarDays className="h-6 w-6 text-primary-500" />
            1. Select Date
          </h2>
          
          <div className="flex overflow-x-auto gap-3 pb-4 mb-8 hide-scrollbar">
            {weekDays.map((date, idx) => {
              const isActive = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
              return (
                <button
                  key={idx}
                  onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                  className={`flex-shrink-0 flex flex-col items-center justify-center h-20 w-20 rounded-xl border-2 transition-all ${
                    isActive 
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' 
                    : 'border-slate-100 hover:border-primary-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="text-xs font-semibold uppercase">{format(date, 'EEE')}</span>
                  <span className="text-2xl font-bold">{format(date, 'd')}</span>
                </button>
              );
            })}
          </div>

          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Clock className="h-6 w-6 text-primary-500" />
            2. Select Time Slot
          </h2>

          {loadingSlots ? (
            <p className="text-slate-500 text-center py-4">Loading slots...</p>
          ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
            {TIME_SLOTS.map((time, idx) => {
              const status = slotStatuses[time];
              if (status === 'blocked') {
                return (
                  <button key={idx} disabled className="p-3 text-sm font-medium rounded-lg bg-slate-100 text-slate-400 line-through border border-slate-200 cursor-not-allowed">
                    {time}
                  </button>
                );
              }
              const isSelected = selectedTime === time;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                    isSelected 
                    ? 'border-primary-500 bg-primary-600 text-white shadow-md' 
                    : 'border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
          )}
        </div>

        {/* Step 3: Patient Details */}
        <div className={`transition-opacity duration-300 ${!selectedTime ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 h-full">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-8">
              <User className="h-6 w-6 text-primary-500" />
              3. Patient Details
            </h2>
            
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-10 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    pattern="\d{10}"
                    title="Please enter exactly 10 digits"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="pl-10 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="1234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Visit <span className="text-slate-400 font-normal">(Optional)</span></label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-slate-400" />
                  </div>
                  <textarea
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    className="pl-10 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Regular Checkup, Toothache, etc."
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!selectedTime}
                  className="w-full flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  Confirm Appointment
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
