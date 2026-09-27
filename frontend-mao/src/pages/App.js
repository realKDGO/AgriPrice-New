import React from 'react';
import { TbLayoutDashboard } from "react-icons/tb";
import { LuSprout } from "react-icons/lu";
import { LuStore } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { LuTags } from "react-icons/lu";
import { LuShieldCheck } from "react-icons/lu";
import { MdHistory } from "react-icons/md";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { TbFileAnalytics } from "react-icons/tb";
import { LuSettings } from "react-icons/lu"; 
import { LuLogOut } from "react-icons/lu";
import { LuArchive } from "react-icons/lu";
import { LuPencil } from "react-icons/lu";
import { LuBell } from "react-icons/lu";
import logoImg from '../assets/AgriPrice_White.png';

export default function App() {
  const cropData = [
    { id: 1, crop: 'Rice', category: 'Grain', unit: 'kg', status: 'Active' },
    { id: 2, crop: 'Tomato', category: 'Vegetable', unit: 'kg', status: 'Active' },
    { id: 3, crop: 'Eggplant', category: 'Vegetable', unit: 'kg', status: 'Active' },
    { id: 4, crop: 'Corn', category: 'Grain', unit: 'kg', status: 'Active' },
    { id: 5, crop: 'Onion', category: 'Vegetable', unit: 'kg', status: 'Active' },
    { id: 6, crop: 'Banana', category: 'Fruit', unit: 'kg', status: 'Active' },
    { id: 7, crop: 'Cabbage', category: 'Vegetable', unit: 'kg', status: 'Active' },
    { id: 8, crop: 'Garlic', category: 'Vegetable', unit: 'kg', status: 'Active' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F5F0] font-sans text-stone-800">
      <aside className="w-64 bg-[#0A261C] text-white flex flex-col justify-between select-none">
        <div>
          <div className="flex items-center gap-3 px-6 py-6">
            <img src={logoImg} alt="AgriPrice Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold tracking-wide">AgriPrice</span>
          </div>

          <div className="px-6 pt-2 pb-3 text-[11px] font-semibold text-stone-400 tracking-wider">
            OVERVIEW
          </div>

          <nav className="flex flex-col gap-1 px-3">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-white/5 cursor-default text-sm">
              <TbLayoutDashboard className="text-lg" />
              <span>Dashboard</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#22543D] text-white cursor-default text-sm font-medium">
              <LuSprout className="text-lg" />
              <span>Crop Management</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-white/5 cursor-default text-sm">
              <LuStore className="text-lg" />
              <span>Market Management</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-white/5 cursor-default text-sm">
              <LuTags className="text-lg" />
              <span>Crop Prices</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-white/5 cursor-default text-sm">
              <LuShieldCheck className="text-lg" />
              <span>Price Validation</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-white/5 cursor-default text-sm">
              <MdHistory className="text-lg" />
              <span>Historical Records</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-white/5 cursor-default text-sm">
              <LuChartNoAxesCombined className="text-lg" />
              <span>Forecast Information</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-white/5 cursor-default text-sm">
              <TbFileAnalytics className="text-lg" />
              <span>Reports & Analytics</span>
            </div>
          </nav>

          <div className="px-6 pt-8 pb-3 text-[11px] font-semibold text-stone-400 tracking-wider">
            ACCOUNT
          </div>

          <div className="px-3">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-white/5 cursor-default text-sm">
              <LuSettings className="text-lg" />
              <span>Settings</span>
            </div>
          </div>
        </div>

        <div className="p-4 px-6 border-t border-stone-800">
          <div className="flex items-center gap-3 text-stone-300 cursor-default text-sm">
            <LuLogOut className="text-lg" />
            <span>Sign Out</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-stone-900">Crop Management</h1>
          <div className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 cursor-default">
            <LuBell className="text-lg" />
          </div>
        </header>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <p className="text-sm text-stone-500">Maintain agricultural records used throughout AgriPrice.</p>
            <div className="bg-[#22543D] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-default select-none">
              <span>+ Add crop</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex-1 min-w-[280px]">
              <div className="relative">
                <input 
                  type="text" 
                  readOnly 
                  placeholder="Search records" 
                  className="w-full pl-4 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none" 
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-stone-500 font-medium">Status</span>
                <div className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700 min-w-[140px] flex justify-between items-center cursor-default">
                  <span>All Statuses</span>
                  <span className="text-xs text-stone-400">▼</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-stone-500 font-medium">Category</span>
                <div className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700 min-w-[140px] flex justify-between items-center cursor-default">
                  <span>All categories</span>
                  <span className="text-xs text-stone-400">▼</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-white">
              <h2 className="font-bold text-stone-900">8 records</h2>
              <span className="text-xs text-stone-400">Current records</span>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-100 text-[11px] font-semibold text-stone-400 tracking-wider bg-stone-50/50">
                  <th className="py-3 px-6">CROP</th>
                  <th className="py-3 px-6">CATEGORY</th>
                  <th className="py-3 px-6">UNIT</th>
                  <th className="py-3 px-6">STATUS</th>
                  <th className="py-3 px-6">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {cropData.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50">
                    <td className="py-4 px-6 font-medium text-stone-900">{item.crop}</td>
                    <td className="py-4 px-6 text-stone-600">{item.category}</td>
                    <td className="py-4 px-6 text-stone-600">{item.unit}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-[#E6F4EA] text-[#137333] text-xs font-medium rounded-full inline-block">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 border border-stone-200 rounded-md text-xs font-medium text-stone-700 flex items-center gap-1.5 bg-white cursor-default select-none">
                          <LuEye className="text-stone-500" />
                          <span>View</span>
                        </div>
                        <div className="px-3 py-1.5 border border-stone-200 rounded-md text-xs font-medium text-stone-700 flex items-center gap-1.5 bg-white cursor-default select-none">
                          <LuPencil className="text-stone-500" />
                          <span>Edit</span>
                        </div>
                        <div className="p-1.5 border border-stone-200 rounded-md text-stone-500 bg-white cursor-default select-none">
                          <LuArchive className="text-sm" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}