import { useState, useEffect } from "react";
import { format, startOfToday, addDays } from "date-fns";
import { Settings, CalendarDays } from "lucide-react";
import { getSlotStatus, updateSlotStatus } from "../../stores/localStorageInfo";

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

const SlotManager = () => {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [slotStatuses, setSlotStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  useEffect(() => {
    const loadSlots = async () => {
      setLoading(true);
      const statuses = {};
      await Promise.all(
        TIME_SLOTS.map(async (slot) => {
          statuses[slot] = await getSlotStatus(dateStr, slot);
        }),
      );
      setSlotStatuses(statuses);
      setLoading(false);
    };
    loadSlots();
  }, [dateStr]);

  const toggleSlotStatus = async (timeSlot) => {
    const currentStatus = slotStatuses[timeSlot];
    const newStatus = currentStatus === "blocked" ? "open" : "blocked";
    setSlotStatuses((prev) => ({ ...prev, [timeSlot]: newStatus }));
    await updateSlotStatus(dateStr, timeSlot, newStatus);
  };

  const weekDays = Array.from({ length: 14 }).map((_, i) =>
    addDays(startOfToday(), i),
  );

  return (
    <div>
      <div className="mb-8 pl-4 border-l-4 border-primary-500">
        <h1 className="text-2xl font-bold text-slate-800">Slot Manager</h1>
        <p className="text-slate-500">
          Control your availability by opening or blocking specific time slots.
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <CalendarDays className="h-6 w-6 text-primary-500" />
          Select Date
        </h2>
        <div className="flex overflow-x-auto gap-3 pb-4 mb-8 hide-scrollbar">
          {weekDays.map((date, idx) => {
            const isActive = format(date, "yyyy-MM-dd") === dateStr;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 flex flex-col items-center justify-center h-20 w-20 rounded-xl border-2 transition-all ${isActive ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm" : "border-slate-100 hover:border-primary-200 hover:bg-slate-50 text-slate-600"}`}
              >
                <span className="text-xs font-semibold uppercase">
                  {format(date, "MMM")}
                </span>
                <span className="text-2xl font-bold">{format(date, "d")}</span>
              </button>
            );
          })}
        </div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
          <Settings className="h-6 w-6 text-primary-500" />
          Manage Slots for {format(selectedDate, "MMMM d, yyyy")}
        </h2>
        {loading ? (
          <p className="text-slate-500 text-center py-8">Loading slots...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {TIME_SLOTS.map((slot) => {
              const isBlocked = slotStatuses[slot] === "blocked";
              return (
                <button
                  key={slot}
                  onClick={() => toggleSlotStatus(slot)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isBlocked ? "border-red-200 bg-red-50 text-red-700 hover:border-red-300" : "border-green-200 bg-green-50 text-green-700 hover:border-green-300"}`}
                >
                  <span className="font-bold text-lg">{slot}</span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${isBlocked ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}
                  >
                    {isBlocked ? "Blocked" : "Open"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg text-sm text-slate-600 flex items-center gap-2">
          <span className="font-medium">Tip:</span> Blocked slots will appear as
          crossed-out on the patient-facing booking page.
        </div>
      </div>
    </div>
  );
};

export default SlotManager;
