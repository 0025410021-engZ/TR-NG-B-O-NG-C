import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import HomeView from "./components/HomeView";
import LessonsView from "./components/LessonsView";
import ProgressView from "./components/ProgressView";
import { LearningProgress, PracticeRecord, RewardBadge, UserRole } from "./types";
import { Sparkles, Heart } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [currentRole, setCurrentRole] = useState<UserRole>("student");
  
  // Dashboard states
  const [progress, setProgress] = useState<LearningProgress>({
    user_id: "student_1",
    completed_lessons: [],
    average_score: 0,
    learning_streak: 1,
    total_practice_time: 0,
    last_active: new Date().toISOString()
  });
  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [rewards, setRewards] = useState<RewardBadge[]>([]);

  // Pull progress values from backend Express
  const loadProgress = async () => {
    try {
      const res = await fetch("/api/progress/student_1");
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
        setRecords(data.practiceRecords);
        setRewards(data.rewards);
      }
    } catch (err) {
      console.error("Lỗi lấy thông tin tiến trình của bé:", err);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  // Developer / Teacher resetting progress capability
  const resetProgressData = async () => {
    if (!confirm("Bé Tom hay Phụ huynh có chắc chắn muốn làm mới điểm số của tất cả các bài từ đầu không?")) return;
    try {
      const res = await fetch("/api/progress/student_1/reset", { method: "POST" });
      if (res.ok) {
        loadProgress();
        alert("Đã làm mới thành công! Bé hãy bắt đầu học vui vẻ nhé 🎈");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] text-[#1E293B] font-sans flex flex-col justify-between selection:bg-yellow-300">
      
      {/* Dynamic Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        streak={progress.learning_streak || 1}
      />

      {/* Main Content Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === "home" && (
          <HomeView
            setCurrentTab={setCurrentTab}
            currentRole={currentRole}
            progress={progress}
          />
        )}
        
        {currentTab === "lessons" && (
          <LessonsView
            currentRole={currentRole}
            onPracticeCompleted={loadProgress}
          />
        )}
        
        {currentTab === "progress" && (
          <ProgressView
            currentRole={currentRole}
            progress={progress}
            records={records}
            rewards={rewards}
            onResetProgress={resetProgressData}
          />
        )}
      </main>

      {/* Playful, Kid-friendly Bold Footer */}
      <footer className="bg-white border-t-4 border-[#1E293B] py-8 text-center text-xs font-bold text-[#1E293B] space-y-3 shadow-[0_-4px_0_0_#1E293B]">
        <div className="flex justify-center items-center gap-2">
          <span className="text-xl">🐱</span>
          <span className="text-[#1E293B] text-sm font-black uppercase tracking-tight">Bé Vui Học Giao Tiếp Cùng AI © 2026</span>
          <span className="text-xl">🤖</span>
        </div>
        <p className="max-w-md mx-auto px-4 text-[#1E293B]/80 font-bold leading-relaxed">
          Ứng dụng học tiếng Anh tăng cường tương tác thông minh cho trẻ em Việt Nam. 
          Sử dụng trí tuệ nhân tạo Gemini thế hệ mới giúp bé tự tin hội thoại, chỉnh từng lỗi phát âm.
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#1E293B] font-mono font-bold">
          <span>Khởi tạo cùng</span> 
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> 
          <span>và sự đồng hành của Ba Mẹ</span>
        </div>
      </footer>

    </div>
  );
}
