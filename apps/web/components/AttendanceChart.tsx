"use client";

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckSquare } from 'lucide-react';

const data = [
  { name: 'Mon', present: 60, absent: 40 },
  { name: 'Tue', present: 70, absent: 30 },
  { name: 'Wed', present: 90, absent: 10 },
  { name: 'Thu', present: 90, absent: 10 },
  { name: 'Fri', present: 65, absent: 35 },
];

export default function AttendanceChart() {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 border border-zinc-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-zinc-900">Weekly Attendance</h1>
        <CheckSquare size={20} className="text-zinc-400" />
      </div>

      <div className="w-full h-[90%]">
        <ResponsiveContainer width="100%" height="90%">
          <BarChart width={500} height={300} data={data} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="name" axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }} />
            <Legend align="left" verticalAlign="top" wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }} />
            <Bar dataKey="present" fill="#000000" legendType="circle" radius={[10, 10, 0, 0]} />
            <Bar dataKey="absent" fill="#e4e4e7" legendType="circle" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}