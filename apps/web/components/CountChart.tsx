"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, Legend } from 'recharts';
import { User, Users } from 'lucide-react';

const data = [
  { name: 'Girls', count: 45, fill: '#f472b6' }, // Pink
  { name: 'Boys', count: 55, fill: '#60a5fa' }, // Blue
  { name: 'Total', count: 100, fill: 'white' }, // Hidden background
];

export default function CountChart() {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 border border-zinc-200 shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-zinc-900">Students</h1>
        <Users size={20} className="text-zinc-400" />
      </div>

      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        
        {/* CENTER ICON */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <User size={32} className="text-zinc-400" />
        </div>
      </div>

      {/* BOTTOM LABELS */}
      <div className="flex justify-center gap-8">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
          <h1 className="font-bold text-zinc-900">1,234</h1>
          <span className="text-xs text-zinc-400">Boys (55%)</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-pink-400" />
          <h1 className="font-bold text-zinc-900">1,100</h1>
          <span className="text-xs text-zinc-400">Girls (45%)</span>
        </div>
      </div>
    </div>
  );
}