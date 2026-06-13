import React from "react";
import { 
  BookOpen, 
  Award, 
  User, 
  Sparkles, 
  Flame, 
  Settings, 
  Volume2
} from "lucide-react";
import { UserRole } from "../types";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  streak: number;
}

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  currentRole, 
  setCurrentRole,
  streak
}: HeaderProps) {
  
  const roles = [
    { value: "student", label: "👦 Bé Tom (Học sinh)", color: "bg-[#FEF3C7] text-[#1E293B] border-2 border-[#1E293B] hover:bg-amber-200" },
    { value: "teacher", label: "👩‍🏫 Cô Hoa (Giáo viên)", color: "bg-purple-100 text-[#1E293B] border-2 border-[#1E293B] hover:bg-purple-200" },
    { value: "parent", label: "👩 Mẹ của Tom (Phụ huynh)", color: "bg-emerald-100 text-[#1E293B] border-2 border-[#1E293B] hover:bg-emerald-200" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b-4 border-[#3B82F6] shadow-sm">
      {/* Top Bar - Cute design & role switcher with bold styles */}
      <div className="bg-[#FBBF24] border-b-2 border-[#1E293B] py-2 px-4 text-xs font-bold text-[#1E293B] flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#F97316] animate-bounce" />
          <span className="font-extrabold uppercase tracking-tight">Chào mừng Bé đến với thế giới Anh ngữ kỳ diệu Cùng AI! ✨</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black uppercase tracking-tight text-[10px]">Đóng vai nhanh:</span>
          <div className="flex gap-1.5">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => setCurrentRole(r.value as UserRole)}
                className={`px-3 py-1 rounded-full font-black text-[10px] transition-all cursor-pointer ${
                  currentRole === r.value 
                    ? "bg-[#F97316] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] scale-105" 
                    : `${r.color} border-2 border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]`
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with Bold Typography style */}
          <div 
            onClick={() => setCurrentTab("home")} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-12 h-12 bg-[#FBBF24] rounded-full flex items-center justify-center border-2 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] group-hover:scale-110 transition-transform">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#3B82F6] tracking-tight text-stroke-sm uppercase leading-none">
                Bé Vui Học <span className="text-[#F59E0B]">AI</span>
              </h1>
              <p className="text-[10px] font-black uppercase text-[#F97316] mt-1 tracking-wider">Cùng Cô Trợ Lý AI 🤖✨</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-4 font-bold">
            <button
              onClick={() => setCurrentTab("home")}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm border-2 border-[#1E293B] transition-all cursor-pointer uppercase ${
                currentTab === "home"
                  ? "bg-[#3B82F6] text-white shadow-[3px_3px_0px_0px_#1E293B]"
                  : "bg-white text-[#1E293B] hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_#1E293B]"
              }`}
            >
              Trang Chủ
            </button>

            <button
              onClick={() => setCurrentTab("lessons")}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm border-2 border-[#1E293B] transition-all cursor-pointer uppercase ${
                currentTab === "lessons"
                  ? "bg-[#F97316] text-white shadow-[3px_3px_0px_0px_#1E293B]"
                  : "bg-white text-[#1E293B] hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_#1E293B]"
              }`}
            >
              Bài Học
            </button>

            <button
              onClick={() => setCurrentTab("progress")}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm border-2 border-[#1E293B] transition-all cursor-pointer uppercase ${
                currentTab === "progress"
                  ? "bg-emerald-500 text-white shadow-[3px_3px_0px_0px_#1E293B]"
                  : "bg-white text-[#1E293B] hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_#1E293B]"
              }`}
            >
              Tiến Độ
            </button>

            {/* Streak Tracker for Kids with neobrutalist badge */}
            {currentRole === "student" && (
              <div className="flex items-center gap-1.5 bg-[#FEF3C7] border-2 border-[#1E293B] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#1E293B]">
                <Flame className="w-5 h-5 text-[#F97316] animate-pulse fill-[#F97316]" />
                <span className="font-extrabold text-[#1E293B] text-xs uppercase tracking-tight">
                  {streak} ngày 🔥
                </span>
              </div>
            )}
            
            {/* Quick Badge info */}
            {currentRole === "student" && (
              <div className="hidden lg:flex items-center gap-1.5 bg-[#DBEAFE] border-2 border-[#3B82F6] px-3 py-1.5 rounded-xl">
                <span className="text-xs font-black uppercase text-[#3B82F6]">TOM</span>
              </div>
            )}
          </nav>

        </div>
      </div>
    </header>
  );
}
