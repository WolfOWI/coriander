// src/components/AdminCalendar.tsx
// Adjust the typography..

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // optional default styles
import '../styles/adminDash.css'; // Import your custom styles

const AdminCalendar = ({ value, onChange }: { value: Date; onChange: (date: Date) => void }) => (
  <div className="px-2 text-zinc-700">
    <Calendar
      className="bg-transparent border-2 border-warmstone-400"
      onChange={(date) => onChange(date as Date)}
      value={value}
    />
  </div>
);

export default AdminCalendar;
