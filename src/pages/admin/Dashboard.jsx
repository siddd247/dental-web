import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  getBookings,
  deleteBooking,
  addPaymentProfile,
} from "../../stores/localStorageInfo";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    const data = await getBookings();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAccept = async (booking) => {
    if (
      window.confirm(
        "Accept this appointment? This will move it to the Payment Tracker automatically.",
      )
    ) {
      await addPaymentProfile({
        name: booking.name,
        mobile: booking.mobile,
        procedureCost: 0,
      });
      await deleteBooking(booking.id);
      refreshData();
    }
  };

  const handleReject = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to reject and delete this appointment?",
      )
    ) {
      await deleteBooking(id);
      refreshData();
    }
  };

  return (
    <div>
      <div className="mb-8 pl-4 border-l-4 border-primary-500">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">
          Overview of all upcoming appointments. Accept to move to Payment
          Tracker.
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Patient
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Date & Time
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Contact
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Reason
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600 uppercase tracking-wide text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No pending bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                          {booking.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800">
                          {booking.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          {format(parseISO(booking.date), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Clock className="h-4 w-4 text-slate-400" />
                          {booking.timeSlot}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Phone className="h-4 w-4 text-slate-400" />
                        {booking.mobile}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-2 text-slate-600 text-sm max-w-xs truncate">
                        <FileText className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        {booking.reason || (
                          <span className="italic text-slate-400">
                            None provided
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAccept(booking)}
                          className="flex items-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-green-200"
                        >
                          <CheckCircle className="h-4 w-4" /> Accept
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-red-200"
                        >
                          <XCircle className="h-4 w-4" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
