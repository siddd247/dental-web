import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ugeyapfvybtemtuizubp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZXlhcGZ2eWJ0ZW10dWl6dWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Mzk4OTgsImV4cCI6MjA4OTUxNTg5OH0.33aCkKMaknI3kULr9liLjS1efnIbyM_djOmhxRaSc78';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwZpNXV3gjn56VlttUJ8J5L06RJbacMVMmm3g4Fu2DIPu9oUlG-PIQJEQCs7hLSYKxM/exec';

const backupToSheets = async (data) => {
  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error('Sheets backup failed:', err);
  }
};

const getStorage = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

const setStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const STORE_KEYS = {
  AUTH: "dc_admin_auth",
};

export const getBookings = async () => {
  const { data, error } = await supabase.from('bookings').select('*').order('createdAt', { ascending: false });
  if (error) {
    console.error("Error fetching bookings", error);
    return [];
  }
  return data;
};

export const addBooking = async (booking) => {
  const newBooking = {
    status: "pending",
    ...booking,
    createdAt: new Date().toISOString(),
  };
  const { data, error } = await supabase.from('bookings').insert([newBooking]).select().single();
  if (error) {
    console.error("Error adding booking", error);
    return null;
  }
  await backupToSheets({
    type: 'booking',
    id: data.id,
    name: data.name,
    mobile: data.mobile,
    date: data.date,
    timeSlot: data.timeSlot,
    reason: data.reason || 'None',
    createdAt: data.createdAt
  });
  return data;
};

export const deleteBooking = async (id) => {
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) console.error("Error deleting booking", error);
};

export const updateBookingStatus = async (id, status) => {
  const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
  if (error) console.error("Error updating booking status", error);
};

export const getSlotsConfig = async () => {
  const { data, error } = await supabase.from('slots').select('*');
  if (error) return {};
  const config = {};
  data.forEach((slot) => {
    if (!config[slot.date]) config[slot.date] = {};
    config[slot.date][slot.timeSlot] = slot.status;
  });
  return config;
};

export const updateSlotStatus = async (dateStr, timeStr, status) => {
  const { data: existing } = await supabase.from('slots')
    .select('id')
    .eq('date', dateStr)
    .eq('timeSlot', timeStr)
    .single();

  if (existing) {
    await supabase.from('slots').update({ status }).eq('id', existing.id);
  } else {
    await supabase.from('slots').insert([{ date: dateStr, timeSlot: timeStr, status }]);
  }
};

export const getSlotStatus = async (dateStr, timeStr) => {
  const { data, error } = await supabase.from('slots')
    .select('status')
    .eq('date', dateStr)
    .eq('timeSlot', timeStr)
    .single();
  
  if (error || !data) return "open";
  return data.status || "open";
};

export const getMessages = async () => {
  const { data, error } = await supabase.from('messages').select('*').order('createdAt', { ascending: false });
  if (error) return [];
  return data;
};

export const addMessage = async (message) => {
  const newMsg = {
    ...message,
    createdAt: new Date().toISOString(),
  };
  const { data, error } = await supabase.from('messages').insert([newMsg]).select().single();
  if (error) {
    console.error("Error adding message", error);
    return;
  }
  await backupToSheets({
    type: 'message',
    id: data.id,
    name: data.name,
    mobile: data.mobile,
    message: data.message,
    createdAt: data.createdAt
  });
};

export const deleteMessage = async (id) => {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) console.error("Error deleting message", error);
};

export const getPayments = async () => {
  const { data, error } = await supabase.from('payments').select('*').order('createdAt', { ascending: true });
  if (error) return [];
  return data;
};

export const addPaymentProfile = async (profile) => {
  const newProfile = {
    ...profile,
    installments: [],
    totalPaid: 0,
    balance: Number(profile.procedureCost),
    createdAt: new Date().toISOString(),
  };
  const { data, error } = await supabase.from('payments').insert([newProfile]).select().single();
  if (error) return null;
  await backupToSheets({
    type: 'payment_new',
    id: data.id,
    name: data.name,
    mobile: data.mobile || '',
    procedureCost: Number(data.procedureCost),
    totalPaid: 0,
    balance: Number(data.procedureCost),
    createdAt: data.createdAt
  });
  return data;
};

export const updatePaymentProfile = async (id, updates) => {
  const { data: current, error: getErr } = await supabase.from('payments').select('*').eq('id', id).single();
  if (getErr) return;

  const updatedProfile = { ...current, ...updates };
  updatedProfile.balance = Number(updatedProfile.procedureCost) - Number(updatedProfile.totalPaid);

  await supabase.from('payments').update({
    name: updatedProfile.name,
    mobile: updatedProfile.mobile,
    procedureCost: updatedProfile.procedureCost,
    balance: updatedProfile.balance
  }).eq('id', id);

  const { data: updatedPatient } = await supabase.from('payments').select('*').eq('id', id).single();
  if (updatedPatient) {
    await backupToSheets({
      type: 'payment_update',
      id: id,
      procedureCost: Number(updatedPatient.procedureCost),
      totalPaid: Number(updatedPatient.totalPaid),
      balance: Number(updatedPatient.balance)
    });
  }
};

export const addInstallment = async (patientId, amount) => {
  const { data: p, error } = await supabase.from('payments').select('*').eq('id', patientId).single();
  if (error) return;

  const newInstallments = [...(p.installments || [])];
  newInstallments.push({
    id: crypto.randomUUID(),
    amount: Number(amount),
    date: new Date().toISOString(),
  });

  const newTotalPaid = (p.totalPaid || 0) + Number(amount);
  const newBalance = p.procedureCost - newTotalPaid;

  await supabase.from('payments').update({
    installments: newInstallments,
    totalPaid: newTotalPaid,
    balance: newBalance
  }).eq('id', patientId);

  const { data: updatedPatient } = await supabase.from('payments').select('*').eq('id', patientId).single();
  if (updatedPatient) {
    await backupToSheets({
      type: 'payment_update',
      id: patientId,
      totalPaid: newTotalPaid,
      balance: newBalance
    });
  }
};

export const removeInstallment = async (patientId, installmentId) => {
  const { data: p, error } = await supabase.from('payments').select('*').eq('id', patientId).single();
  if (error) return;

  const currentInst = p.installments || [];
  const instIdx = currentInst.findIndex((i) => i.id === installmentId);
  
  if (instIdx > -1) {
    const amt = currentInst[instIdx].amount;
    const newInstallments = [...currentInst];
    newInstallments.splice(instIdx, 1);

    const newTotalPaid = p.totalPaid - amt;
    const newBalance = p.procedureCost - newTotalPaid;

    await supabase.from('payments').update({
      installments: newInstallments,
      totalPaid: newTotalPaid,
      balance: newBalance
    }).eq('id', patientId);
    
    const { data: updatedPatient } = await supabase.from('payments').select('*').eq('id', patientId).single();
    if (updatedPatient) {
      await backupToSheets({
        type: 'payment_update',
        id: patientId,
        totalPaid: newTotalPaid,
        balance: newBalance
      });
    }
  }
};

export const deletePaymentProfile = async (id) => {
  const { error } = await supabase.from('payments').delete().eq('id', id);
  if (error) { console.error(error); return; }
  await backupToSheets({
    type: 'payment_delete',
    id: id
  });
};

export const getAdminAuth = () => getStorage(STORE_KEYS.AUTH, false);
export const setAdminAuth = (state) => setStorage(STORE_KEYS.AUTH, state);
