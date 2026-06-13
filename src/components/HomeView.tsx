import React from "react";
import { 
  Sparkles, 
  ArrowRight, 
} from "lucide-react";
import { UserRole, LearningProgress } from "../types";

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  currentRole: UserRole;
  progress: LearningProgress;
}

export default function HomeView({ setCurrentTab, currentRole, progress }: HomeViewProps) {
  
  const stats = [
    { 
      label: "Bé đã học xong", 
      value: `${progress.completed_lessons.length} bài`, 
      icon: "📚", 
      borderColor: "border-[#3B82F6]",
      textColor: "text-[#3B82F6]",
      shadowColor: "shadow-[#3B82F6]"
    },
    { 
      label: "Điểm phát âm TB", 
      value: `${progress.average_score || 0}%`, 
      icon: "⭐", 
      borderColor: "border-[#F97316]",
      textColor: "text-[#F97316]",
      shadowColor: "shadow-[#F97316]"
    },
    { 
      label: "Chuỗi liên tục", 
      value: `${progress.learning_streak} Ngày 🔥`, 
      icon: "🔥", 
      borderColor: "border-rose-500",
      textColor: "text-rose-500",
      shadowColor: "shadow-rose-500"
    },
    { 
      label: "Thời gian nói", 
      value: `${progress.total_practice_time} phút`, 
      icon: "⏱️", 
      borderColor: "border-emerald-500",
      textColor: "text-emerald-500",
      shadowColor: "shadow-emerald-500"
    },
  ];

  return (
    <div className="space-y-12 pb-16 font-sans">
      
      {/* Hero / Banner Section with Bold Typography Neobrutalist design */}
      <section className="bg-white rounded-[32px] border-4 border-[#1E293B] p-6 md:p-10 relative overflow-hidden shadow-[8px_8px_0px_0px_#3B82F6]">
        {/* Background bubbles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FBBF24]/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#3B82F6]/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Slogan & Buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FEF3C7] text-[#1E293B] border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316] animate-spin" /> Trí tuệ Nhân tạo hỗ trợ Giáo dục Lớp 3
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1E293B] tracking-tight leading-none uppercase">
              Bé Vui Học <br className="hidden md:inline" />
              <span className="text-[#3B82F6] underline decoration-4 decoration-[#FBBF24] underline-offset-4">Giao Tiếp</span> Cùng <span className="text-white bg-[#F97316] px-3 py-1.5 border-4 border-[#1E293B] rounded-2xl inline-block shadow-[4px_4px_0px_0px_#1E293B] transform -rotate-1">AI 🤖</span>
            </h1>
            
            <p className="text-base md:text-lg font-bold text-slate-700 max-w-2xl leading-relaxed">
              Phương pháp học nghe - nói tiếng Anh lý thú cho học sinh Lớp 3. 
              Thực hành qua mẩu truyện, đối thoại tương tác và nhận đánh giá phát âm thông minh từng âm tiết chuẩn từ trợ lý AI!
            </p>

            {/* Quick Actions (Neobrutalist buttons) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={() => setCurrentTab("lessons")}
                className="px-8 py-4 bg-[#F97316] text-white font-black text-lg rounded-2xl border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1E293B] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-tight"
              >
                🎮 Luyện nói ngay thôi <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setCurrentTab("progress")}
                className="px-8 py-4 bg-white text-[#1E293B] border-4 border-[#1E293B] font-black text-lg rounded-2xl shadow-[4px_4px_0px_0px_#1E293B] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1E293B] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-tight"
              >
                📊 Kết quả học tập
              </button>
            </div>

            {/* Sub-label */}
            <p className="text-xs text-center lg:text-left text-slate-500 font-extrabold font-mono uppercase tracking-wider">
              *Học sinh Tom (Lớp 3A) đang trực tuyến! 👦💡
            </p>
          </div>

          {/* Neobrutalist illustration box */}
          <div className="lg:col-span-5 flex justify-center items-center z-10">
            <div className="relative bg-[#FBBF24] p-6 rounded-[32px] border-4 border-[#1E293B] shadow-[8px_8px_0px_0px_#3B82F6] max-w-sm w-full">
              <div className="absolute -top-6 -right-5 w-14 h-14 bg-[#F97316] rounded-full border-4 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] flex items-center justify-center text-2xl animate-bounce">
                👑
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-[#1E293B] pb-3">
                  <div className="text-3xl">🤖</div>
                  <div>
                    <h4 className="font-extrabold text-[#1E293B] uppercase tracking-tight text-sm">Cô Giáo Trợ Lý AI</h4>
                    <p className="text-xs font-black text-[#78350F] font-mono">"Hello! Nice to meet you."</p>
                  </div>
                </div>
                
                <div className="p-3.5 bg-white border-2 border-[#1E293B] rounded-2xl text-xs font-bold text-slate-800 leading-relaxed shadow-[2px_2px_0px_0px_#1E293B]">
                  "Bé hãy vào phần <strong className="text-[#F97316]">Bài Học</strong>, nghe cô đọc to rồi giữ mic đọc lại thật tự tin để cô chấm điểm phát âm xem đạt bao nhiêu hoa điểm mười nhé!"
                </div>

                <div className="flex justify-between items-center bg-[#DBEAFE] p-2.5 rounded-xl border-2 border-[#1E293B]">
                  <span className="text-xs font-black uppercase text-[#1E293B]">⭐ Bé Tom đạt:</span>
                  <span className="text-[11px] font-black uppercase text-white bg-[#3B82F6] border-2 border-[#1E293B] px-2 py-0.5 rounded-lg shadow-[1px_1px_0px_0px_#1E293B]">3 ngày Streak! 🔥</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Grid of neobrutalist statistical cards */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-2xl md:text-3xl font-black text-[#1E293B] uppercase tracking-tight">
            🏆 Bảng Thống Kê Học Tập Của Bé Tom
          </h3>
          <p className="text-slate-600 font-bold text-sm">
            Chăm chỉ nói tiếng Anh chuẩn cùng cô giáo AI mỗi ngày để rinh thêm cúp vàng!
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <div 
              key={idx}
              className="bg-white p-6 rounded-[24px] border-4 border-[#1E293B] shadow-[6px_6px_0px_0px_#1E293B] relative overflow-hidden flex flex-col justify-between hover:translate-y-[-4px] transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">{s.label}</p>
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <h4 className="text-3xl font-black text-[#1E293B]">{s.value}</h4>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 border-t pt-2 border-dashed">
                Hệ thống lưu máy học AI 🤖
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Features of the system styled with gorgeous neobrutalist yellow board */}
      <section className="bg-[#FEF3C7] rounded-[32px] border-4 border-[#1E293B] p-6 md:p-8 space-y-8 shadow-[8px_8px_0px_0px_#1E293B]">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-3xl">⚡⚡</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#1E293B] uppercase tracking-tight">Tính năng nổi bật bé học sẽ thích mê!</h2>
          <p className="font-bold text-slate-800 text-sm md:text-base">Các tính năng giáo dục hiện đại, trực quan, 100% tiếng Anh Tiểu học Lớp 3</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-[20px] border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1E293B] transition-all space-y-3">
            <div className="w-12 h-12 bg-[#DBEAFE] border-2 border-[#1E293B] rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#1E293B]">
              🎬
            </div>
            <h4 className="text-lg font-black text-[#3B82F6] uppercase tracking-tight border-b-2 border-slate-100 pb-1">Video Học Tiếng Anh</h4>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              Mỗi bài học được bắt đầu với video hoạt cảnh sinh động hoặc nhạc vui vẻ từ YouTube lớp học giúp trẻ hào hứng tiếp thu từ vựng.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[20px] border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1E293B] transition-all space-y-3">
            <div className="w-12 h-12 bg-[#FEF3C7] border-2 border-[#1E293B] rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#1E293B]">
              🗣️
            </div>
            <h4 className="text-lg font-black text-[#F97316] uppercase tracking-tight border-b-2 border-slate-100 pb-1">Giọng Đọc Giáo Viên AI</h4>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              Trợ lý AI đọc chuẩn giọng bản xứ Mỹ chậm rãi giúp em bé làm quen với ngữ điệu rành mạch, dõng dạc của bản xứ ngay từ nhỏ.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[20px] border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1E293B] transition-all space-y-3">
            <div className="w-12 h-12 bg-[#D1FAE5] border-2 border-[#1E293B] rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#1E293B]">
              🎙️
            </div>
            <h4 className="text-lg font-black text-emerald-600 uppercase tracking-tight border-b-2 border-slate-100 pb-1">Công Nghệ Speech To Text</h4>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              Nhận dạng giọng nói trẻ em an toàn, tức thì. Phân tích cụm từ bé đọc để đối sánh xem từ nào bé nói tròn chữ, rõ ràng nhất.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[20px] border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1E293B] transition-all space-y-3">
            <div className="w-12 h-12 bg-pink-100 border-2 border-[#1E293B] rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#1E293B]">
              📈
            </div>
            <h4 className="text-lg font-black text-pink-600 uppercase tracking-tight border-b-2 border-slate-100 pb-1">Chấm 4 Tiêu Chí Tiêu Chuẩn</h4>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              Thuật toán thông minh chấm điểm 4 cột trụ: Phát âm (Accent), Độ chính xác (Accuracy), Ngữ điệu (Intonation), và Lưu loát (Fluency).
            </p>
          </div>

          <div className="bg-white p-6 rounded-[20px] border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1E293B] transition-all space-y-3">
            <div className="w-12 h-12 bg-purple-100 border-2 border-[#1E293B] rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#1E293B]">
              🥇
            </div>
            <h4 className="text-lg font-black text-purple-600 uppercase tracking-tight border-b-2 border-slate-100 pb-1">Sửa Lỗi Nhân Tâm Từ Cô AI</h4>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              Cô giáo AI sẽ cho lời khen vô cùng khích lệ cùng mẹo nhỏ hướng dẫn đặt khẩu hình miệng dễ hiểu giúp bé cải thiện sau từng lượt.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[20px] border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1E293B] transition-all space-y-3">
            <div className="w-12 h-12 bg-yellow-100 border-2 border-[#1E293B] rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#1E293B]">
              🏆
            </div>
            <h4 className="text-lg font-black text-[#F59E0B] uppercase tracking-tight border-b-2 border-slate-100 pb-1">Huy hiệu Danh Giá</h4>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              Khi đạt được hoa điểm mười, bé sẽ nhận hàng loạt Huy chương, mở khóa danh hiệu: Hiệp Sĩ Phát Âm, Sao Sáng tiếng Anh đầy kiêu hãnh.
            </p>
          </div>

        </div>
      </section>

      {/* Role explanation simplified into solid block design boxes */}
      <section className="bg-white rounded-[32px] border-4 border-[#1E293B] p-6 md:p-8 space-y-6 shadow-[8px_8px_0px_0px_#F97316]">
        <h4 className="font-black text-[#1E293B] text-xl uppercase tracking-tight flex items-center gap-2">
          👨‍👩‍👧‍👦 Ba góc nhìn tuyệt vời trên hệ thống Bé Vui Học AI
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-[#FEF3C7] rounded-3xl border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] space-y-2">
            <span className="text-3xl">👦</span>
            <strong className="text-[#1E293B] uppercase tracking-tight block text-sm border-b border-[#1E293B]/20 pb-1">Dành Cho Học Sinh</strong>
            <p className="text-xs font-bold text-slate-700 leading-relaxed">
              Học các bài giao tiếp vui nhỏ, nghe trợ lý AI bắt bài giọng đọc và thu âm giọng để so tài nhận hàng trăm ngôi sao danh giá.
            </p>
          </div>
          <div className="p-5 bg-[#E0F2FE] rounded-3xl border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] space-y-2">
            <span className="text-3xl">👩‍🏫</span>
            <strong className="text-[#1E293B] uppercase tracking-tight block text-sm border-b border-[#1E293B]/20 pb-1">Dành Cho Giáo Viên</strong>
            <p className="text-xs font-bold text-slate-700 leading-relaxed">
              Hỗ trợ quản lý khóa học Tiểu học: thêm bài thực hành, gán video bài hát nhảy múa sinh động trên YouTube và chỉnh sửa từ vựng.
            </p>
          </div>
          <div className="p-5 bg-[#D1FAE5] rounded-3xl border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] space-y-2">
            <span className="text-3xl">👩</span>
            <strong className="text-[#1E293B] uppercase tracking-tight block text-sm border-b border-[#1E293B]/20 pb-1">Dành Cho Phụ Huynh</strong>
            <p className="text-xs font-bold text-slate-700 leading-relaxed">
              Theo dõi sát sao từng thang sao của con, xem lại các bản ghi âm mẫu thực tế và <strong>Xuất học bạ học vụ</strong> dạng bản In trực tiếp!
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
