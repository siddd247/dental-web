import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  Wallet,
  Trash2,
  UserPlus,
  CreditCard,
  CheckCircle,
  Edit2,
  Save,
  X,
} from "lucide-react";
import {
  getPayments,
  addPaymentProfile,
  addInstallment,
  removeInstallment,
  updatePaymentProfile,
  deletePaymentProfile,
} from "../../stores/localStorageInfo";

const PaymentTracker = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    mobile: "",
    procedureCost: "",
  });
  const [activePatientId, setActivePatientId] = useState(null);
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    mobile: "",
    procedureCost: "",
  });
  const [sortFilter, setSortFilter] = useState("newest");

  const refreshData = async () => {
    setLoading(true);
    const data = await getPayments();
    setPatients(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const validateMobile = (mobile) => /^\d{10}$/.test(mobile);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.procedureCost) return;
    if (newPatient.mobile && !validateMobile(newPatient.mobile)) {
      alert("Please enter exactly 10 digits for the mobile number.");
      return;
    }
    await addPaymentProfile(newPatient);
    setNewPatient({ name: "", mobile: "", procedureCost: "" });
    setShowAddPatient(false);
    refreshData();
  };

  const handleAddInstallment = async (e, patientId) => {
    e.preventDefault();
    if (!installmentAmount) return;
    await addInstallment(patientId, installmentAmount);
    setInstallmentAmount("");
    setActivePatientId(null);
    refreshData();
  };

  const handleRemoveInstallment = async (patientId, instId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this payment installment?",
      )
    ) {
      await removeInstallment(patientId, instId);
      refreshData();
    }
  };

  const handleStartEditing = (patient) => {
    setEditingProfileId(patient.id);
    setEditFormData({
      name: patient.name,
      mobile: patient.mobile || "",
      procedureCost: patient.procedureCost,
    });
  };

  const handleSaveEdit = async (e, id) => {
    e.preventDefault();
    if (!editFormData.name || editFormData.procedureCost === "") return;
    if (editFormData.mobile && !validateMobile(editFormData.mobile)) {
      alert("Please enter exactly 10 digits for the mobile number.");
      return;
    }
    await updatePaymentProfile(id, editFormData);
    setEditingProfileId(null);
    refreshData();
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div className="pl-4 border-l-4 border-primary-500 mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-slate-800">Payment Tracker</h1>
          <p className="text-slate-500">
            Manage patient procedures, total costs, and installments (INR).
          </p>
        </div>
        <button
          onClick={() => setShowAddPatient(!showAddPatient)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
        >
          {showAddPatient ? (
            "Close Form"
          ) : (
            <>
              <UserPlus className="h-5 w-5" /> New Patient Profile
            </>
          )}
        </button>
      </div>

      {showAddPatient && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-8 max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
            Create Payment Profile
          </h2>
          <form
            onSubmit={handleAddPatient}
            className="grid md:grid-cols-2 gap-4"
          >
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Patient Name
              </label>
              <input
                required
                type="text"
                value={newPatient.name}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, name: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500"
                placeholder="Your Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mobile (10 digits)
              </label>
              <input
                type="tel"
                pattern="\d{10}"
                value={newPatient.mobile}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, mobile: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500"
                placeholder="10-digit Mobile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Total Procedure Cost (₹)
              </label>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={newPatient.procedureCost}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    procedureCost: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500 font-medium"
                placeholder="5000"
              />
            </div>
            <div className="col-span-2 mt-2">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg shadow transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {!loading && patients.length > 0 && (
        <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-800 ml-2 uppercase tracking-wide">Records</h2>
          <select
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-500 cursor-pointer font-medium"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest-balance">Highest Balance First</option>
            <option value="lowest-balance">Lowest Balance First</option>
          </select>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500">Loading...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
            <Wallet className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-600">
              No payment records yet
            </h3>
            <p className="text-slate-500 mt-2">
              Create a new patient profile to start tracking installments.
            </p>
          </div>
        ) : (
          [...patients].sort((a, b) => {
            if (sortFilter === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortFilter === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortFilter === "highest-balance") return b.balance - a.balance;
            if (sortFilter === "lowest-balance") return a.balance - b.balance;
            return 0;
          }).map((patient) => {
            const isPaidOff = patient.balance <= 0 && patient.procedureCost > 0;
            const isEditing = editingProfileId === patient.id;
            return (
              <div
                key={patient.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row"
              >
                <div
                  className={`p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col ${isPaidOff ? "bg-green-50" : "bg-slate-50"}`}
                >
                  {isEditing ? (
                    <form
                      onSubmit={(e) => handleSaveEdit(e, patient.id)}
                      className="space-y-3 flex-1 flex flex-col justify-center"
                    >
                      <div>
                        <label className="text-xs font-semibold text-slate-500">
                          Name
                        </label>
                        <input
                          required
                          type="text"
                          className="w-full text-sm p-1.5 border rounded"
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">
                          Mobile
                        </label>
                        <input
                          type="tel"
                          pattern="\d{10}"
                          className="w-full text-sm p-1.5 border rounded"
                          value={editFormData.mobile}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              mobile: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">
                          Procedure Cost (₹)
                        </label>
                        <input
                          required
                          type="number"
                          min="0"
                          step="1"
                          className="w-full text-sm p-1.5 border rounded"
                          value={editFormData.procedureCost}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              procedureCost: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="submit"
                          className="flex-1 bg-primary-600 text-white text-xs font-bold py-2 rounded flex justify-center items-center gap-1"
                        >
                          <Save className="h-3 w-3" /> Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProfileId(null)}
                          className="flex-1 bg-slate-300 text-slate-700 text-xs font-bold py-2 rounded flex justify-center items-center gap-1"
                        >
                          <X className="h-3 w-3" /> Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col h-full justify-center">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-slate-900">
                            {patient.name}
                          </h3>
                          {isPaidOff && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEditing(patient)}
                            className="text-slate-400 hover:text-primary-600 transition-colors p-1"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm("Are you sure you want to permanently delete this patient profile and all their payment history?")) {
                                await deletePaymentProfile(patient.id);
                                refreshData();
                              }
                            }}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            title="Delete Profile"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {patient.mobile && (
                        <p className="text-slate-500 text-sm mb-4">
                          {patient.mobile}
                        </p>
                      )}
                      <div className="space-y-2 mt-auto">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Total Cost:</span>
                          <span className="font-semibold text-slate-700">
                            {formatCurrency(patient.procedureCost)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Paid:</span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(patient.totalPaid)}
                          </span>
                        </div>
                        <div className="flex justify-between text-base mt-2 pt-2 border-t border-slate-200">
                          <span className="font-bold text-slate-700">
                            Balance:
                          </span>
                          <span
                            className={`font-bold ${isPaidOff ? "text-green-600" : "text-red-500"}`}
                          >
                            {formatCurrency(Math.max(0, patient.balance))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">
                      Payment History
                    </h4>
                    {patient.balance > 0 && (
                      <button
                        onClick={() =>
                          activePatientId === patient.id
                            ? setActivePatientId(null)
                            : setActivePatientId(patient.id)
                        }
                        className={`text-sm font-semibold px-3 py-1.5 rounded-md transition-colors ${activePatientId === patient.id ? "bg-slate-200 text-slate-800" : "bg-primary-100 text-primary-700 hover:bg-primary-200"}`}
                      >
                        {activePatientId === patient.id
                          ? "Cancel"
                          : "+ Add Payment"}
                      </button>
                    )}
                  </div>
                  {activePatientId === patient.id && (
                    <form
                      onSubmit={(e) => handleAddInstallment(e, patient.id)}
                      className="mb-6 flex gap-2 w-full bg-slate-50 p-3 rounded-lg border border-slate-200"
                    >
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-slate-500 font-medium">₹</span>
                        </div>
                        <input
                          autoFocus
                          required
                          type="number"
                          min="1"
                          max={patient.balance}
                          step="1"
                          value={installmentAmount}
                          onChange={(e) => setInstallmentAmount(e.target.value)}
                          className="pl-8 bg-white block w-full rounded border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500"
                          placeholder="Amount"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded text-sm shadow"
                      >
                        Log Payment
                      </button>
                    </form>
                  )}
                  {!patient.installments ||
                  patient.installments.length === 0 ? (
                    <p className="text-slate-500 text-sm italic py-4">
                      No payments recorded yet.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {[...patient.installments].reverse().map((inst) => (
                        <div
                          key={inst.id}
                          className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                              <CreditCard className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">
                                {formatCurrency(inst.amount)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {format(
                                  parseISO(inst.date),
                                  "MMM d, yyyy • h:mm a",
                                )}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveInstallment(patient.id, inst.id)
                            }
                            className="text-slate-400 hover:text-red-500 p-2 transition-colors rounded-full hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PaymentTracker;
