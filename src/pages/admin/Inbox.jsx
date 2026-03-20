import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Mail, Phone, Clock, User, Trash2 } from "lucide-react";
import { getMessages, deleteMessage } from "../../stores/localStorageInfo";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshMessages = async () => {
    setLoading(true);
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteMessage(id);
      refreshMessages();
    }
  };

  return (
    <div>
      <div className="mb-8 pl-4 border-l-4 border-primary-500">
        <h1 className="text-2xl font-bold text-slate-800">Inbox</h1>
        <p className="text-slate-500">Messages and inquiries from patients.</p>
      </div>
      <div className="grid gap-6">
        {loading ? (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center text-slate-500 border border-slate-200">
            Loading...
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center text-slate-500 border border-slate-200">
            <Mail className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p>Your inbox is empty.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-xl">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      {msg.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {msg.mobile}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400 font-medium whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(parseISO(msg.createdAt), "MMM d, yyyy • h:mm a")}
                  </div>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                    title="Delete Message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700">
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;
