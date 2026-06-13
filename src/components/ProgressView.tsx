import React, { useState } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  Cell 
} from "recharts";
import { 
  Calendar, 
  Clock, 
  Star, 
  FileText, 
  RefreshCw, 
  TrendingUp, 
  Printer
} from "lucide-react";
import { UserRole, LearningProgress, PracticeRecord, RewardBadge } from "../types";

interface ProgressViewProps {
  currentRole: UserRole;
  progress: LearningProgress;
  records: PracticeRecord[];
  rewards: RewardBadge[];
  onResetProgress: () => void;
}

export default function ProgressView({ 
  currentRole, 
  progress, 
  records, 
  rewards,
  onResetProgress 
}: ProgressViewProps) {
  const [showPrintReportCard, setShowPrintReportCard] = useState(false);

  // Parse records for time charts
  const lineChartData = records
    .map((rec) => ({
      name: new Date(rec.created_at).toLocaleDateString("vi-VN", { month: "numeric", day: "numeric" }),
      "Điểm Phát Âm": rec.score.pronunciation,
      "Điểm Tổng Hợp": rec.score.average,
    }))
    .reverse(); // old to new

  // Get most recent log breakdown score
  const latestRecord = records[records.length - 1];
  const barChartData = latestRecord
    ? [
        { name: "Phát âm (Accent)", "Điểm Số": latestRecord.score.pronunciation, color: "#3B82F6" },
        { name: "Chính xác (Accuracy)", "Điểm Số": latestRecord.score.accuracy, color: "#EF4444" },
        { name: "Ngữ điệu (Intonation)", "Điểm Số": latestRecord.score.intonation, color: "#A855F7" },
        { name: "Lưu loát (Fluency)", "Điểm Số": latestRecord.score.fluency, color: "#10B981" },
      ]
    : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in print:bg-white print:p-0 font-sans">
      
      {/* Printable Report Card Overlay Modal (Báo cáo Phụ huynh) */}
      {showPrintReportCard && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 print:static print:bg-transparent print:p-0">
          <div className="bg-white rounded-[32px] border-8 border-[#10B981] p-6 md:p-10 max-w-3xl w-full shadow-[12px_12px_0px_0px_#1E293B] relative overflow-hidden print:border-0 print:shadow-none">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBF24]/20 rounded-full blur-xl pointer-events-none"></div>

            {/* Close Button on Web view */}
            <button
              onClick={() => setShowPrintReportCard(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 border-2 border-[#1E293B] rounded-full cursor-pointer print:hidden"
            >
              <XIcon className="w-5 h-5 text-gray-800" />
            </button>

            {/* Stamp certification decoration */}
            <div className="absolute right-6 top-10 w-24 h-24 border-4 border-double border-red-500 rounded-full flex flex-col items-center justify-center text-red-500 font-extrabold rotate-12 scale-90 select-none">
              <span className="text-[9px] uppercase font-black">Bé Vui Học AI</span>
              <span className="text-xs font-black">ĐẠT CHUẨN</span>
              <span className="text-[8px] font-black">LỚP 3A ✅</span>
            </div>

            <div className="space-y-6 text-center">
              <div className="flex justify-center items-center gap-2">
                <span className="text-4xl">👑</span>
                <h3 className="text-2xl md:text-3xl font-black text-[#1E293B] tracking-tight uppercase">
                  Học Bạ Phát Âm Tiếng Anh Lớp 3
                </h3>
              </div>
              
              <p className="text-xs text-slate-500 font-black uppercase -mt-3 italic">
                Thời gian lập: {new Date().toLocaleDateString("vi-VN")} | Hệ thống Trợ lý AI thế hệ mới 🤖
              </p>

              {/* Student Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left bg-[#D1FAE5] rounded-2xl p-5 border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-800 uppercase font-black">Học sinh thân yêu:</span>
                  <p className="text-lg font-black text-[#1E293B]">Bé Tom</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-800 uppercase font-black">Mã học vụ lớp:</span>
                  <p className="text-sm font-black text-slate-700">LỚP 3A - TIỂU HỌC TƯƠNG TÁC</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-800 uppercase font-black">Địa chỉ Email:</span>
                  <p className="text-xs font-black text-slate-700">tom@student.com</p>
                </div>
              </div>

              {/* Core metrics summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-4 rounded-xl border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
                  <p className="text-[10px] uppercase font-black text-slate-400">Bài Học Xong</p>
                  <p className="text-xl font-black text-indigo-600 mt-1">{progress.completed_lessons.length} bài</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
                  <p className="text-[10px] uppercase font-black text-slate-400">Điểm Phát Âm TB</p>
                  <p className="text-xl font-black text-[#F97316] mt-1">{progress.average_score || 0}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
                  <p className="text-[10px] uppercase font-black text-slate-400">Thời gian nói</p>
                  <p className="text-xl font-black text-emerald-600 mt-1">{progress.total_practice_time} phút</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B]">
                  <p className="text-[10px] uppercase font-black text-slate-400">Kỷ lục streak</p>
                  <p className="text-xl font-black text-rose-500 mt-1">{progress.learning_streak} ngày 🔥</p>
                </div>
              </div>

              {/* Detailed achievements */}
              <div className="text-left space-y-3">
                <h4 className="font-extrabold text-[#1E293B] border-b-2 border-slate-100 pb-2 text-xs uppercase tracking-tight">🏆 Huy Hiệu Bé Đã Đạt Được:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rewards.map((rew) => (
                    <div key={rew.id} className="flex items-center gap-3 bg-[#FEF3C7] p-3 rounded-xl border-2 border-[#1E293B] shadow-[1px_1px_0px_0px_#1E293B]">
                      <span className="text-2xl">🥇</span>
                      <div>
                        <h5 className="font-black text-[#1E293B] text-xs uppercase tracking-tight">{rew.title}</h5>
                        <p className="text-[10px] text-slate-600 font-bold leading-relaxed">{rew.description}</p>
                      </div>
                    </div>
                  ))}
                  {rewards.length === 0 && (
                    <p className="text-xs text-slate-500 italic">Bé hãy hoàn thành các bài học nói để rinh thật nhiều huy hiệu danh giá nhé!</p>
                  )}
                </div>
              </div>

              {/* Teacher generic feedback summary */}
              <div className="text-left p-4 bg-slate-50 border-2 border-[#1E293B] rounded-2xl space-y-1.5 shadow-[2px_2px_0px_0px_#1E293B]">
                <h5 className="font-extrabold text-[#3B82F6] text-xs uppercase tracking-tight">📝 Đánh Giá Sư Phạm Từ Cô Giáo AI:</h5>
                <p className="text-xs font-bold text-slate-755 leading-relaxed">
                  Bé Tom có tố chất phát âm tiếng Anh dõng dạc, rành rọt. 
                  Các âm đuôi "s", "d" và ngữ điệu lên xuống của câu chào hỏi đã có sự tiến bộ vượt bậc. 
                  Bé học rất chăm chỉ và giữ vững tinh thần hiếu học. Ba Mẹ hãy tặng thưởng cho bé một chuyến đi chơi thật vui vẻ nhé!
                </p>
              </div>

              {/* Web Actions display */}
              <div className="flex justify-center gap-3 pt-6 border-t border-slate-100 print:hidden">
                <button
                  onClick={() => setShowPrintReportCard(false)}
                  className="px-5 py-2.5 bg-white border-2 border-[#1E293B] text-slate-700 font-extrabold text-xs uppercase tracking-tight rounded-xl shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
                >
                  Đóng học bạ
                </button>
                <button
                  onClick={handlePrint}
                  className="px-6 py-2.5 bg-[#10B981] text-white font-black text-xs uppercase tracking-tight rounded-xl border-4 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] flex items-center gap-2 cursor-pointer transition-all hover:translate-y-[-1px]"
                >
                  <Printer className="w-4 h-4" /> Bấm In Học Bạ Ngay
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Main Student metadata Card banner */}
      <div className="bg-white p-6 rounded-[32px] border-4 border-[#1E293B] shadow-[6px_6px_0px_0px_#10B981] flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#D1FAE5] rounded-full border-4 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] flex items-center justify-center text-4xl animate-pulse">
            👦
          </div>
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-black text-[#1E293B] uppercase tracking-tight leading-none">
              Theo dõi tiến độ: <span className="text-[#10B981]">Bé Tom Lớp 3A 🌟</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Phụ huynh học sinh Tom đồng bộ học vụ trực tiếp cùng AI</p>
          </div>
        </div>

        {/* Parent actions triggers report popup */}
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => setShowPrintReportCard(true)}
            className="px-5 py-3 bg-[#10B981] text-white font-black text-xs uppercase tracking-tight rounded-xl border-4 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#1E293B] active:translate-y-[1px] transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" /> 📊 Xuất Kết Quả Học Tập
          </button>

          <button
            onClick={onResetProgress}
            className="px-4 py-3 bg-red-100 border-2 border-[#1E293B] text-rose-700 hover:bg-rose-100 font-extrabold text-xs uppercase tracking-tight rounded-xl shadow-[2px_2px_0px_0px_#1E293B] flex items-center gap-1.5 cursor-pointer"
            title="Làm mới tiến trình"
          >
            <RefreshCw className="w-4 h-4" /> Làm lại từ đầu
          </button>
        </div>
      </div>

      {/* Graphs charts dashboard */}
      {records.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Pronunciation progress line chart */}
          <div className="bg-white p-5 rounded-[32px] border-4 border-[#1E293B] shadow-[6px_6px_0px_0px_#FBBF24] space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-extrabold text-[#1E293B] text-xs md:text-sm flex items-center gap-1.5 uppercase tracking-tight">
                <TrendingUp className="w-5 h-5 text-[#F97316]" /> Biểu đồ tiến bộ phát âm qua từng buổi học
              </h4>
              <span className="text-[10px] font-black uppercase text-[#F97316] bg-[#FEF3C7] border-2 border-[#1E293B] px-2.5 py-0.5 rounded-full">
                Live AI
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 20, right: 35, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#1E293B" fontSize={11} fontStyle="bold" />
                  <YAxis domain={[30, 100]} stroke="#1E293B" fontSize={11} />
                  <Tooltip wrapperStyle={{ fontFamily: "sans-serif", fontSize: "12px", fontWeight: "bold" }} />
                  <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                  <Line 
                    type="monotone" 
                    dataKey="Điểm Phát Âm" 
                    stroke="#3B82F6" 
                    strokeWidth={4} 
                    dot={{ r: 6, strokeWidth: 2, fill: "#3B82F6", stroke: "#1E293B" }}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Điểm Tổng Hợp" 
                    stroke="#10B981" 
                    strokeWidth={3} 
                    dot={{ r: 5, strokeWidth: 1, fill: "#10B981", stroke: "#1E293B" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-center text-slate-500 font-extrabold tracking-tight uppercase">
              *Đường kẻ đi lên biểu thị cơ hàm của bé đã thích nghi với ngữ điệu chuẩn! 📈
            </p>
          </div>

          {/* Card 2: Skill metrics breakdown bar chart for latest try */}
          <div className="bg-white p-5 rounded-[32px] border-4 border-[#1E293B] shadow-[6px_6px_0px_0px_#3B82F6] space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-extrabold text-[#1E293B] text-xs md:text-sm flex items-center gap-1.5 uppercase tracking-tight">
                <Star className="w-5 h-5 text-[#3B82F6]" /> Chỉ số kỹ năng của lần nghe nói mới nhất
              </h4>
              <span className="text-[10px] font-black uppercase text-[#3B82F6] bg-[#DBEAFE] border-2 border-[#1E293B] px-2.5 py-0.5 rounded-full">
                Deep Analysis
              </span>
            </div>

            {latestRecord ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#1E293B" fontSize={10} fontStyle="bold" tickFormatter={(t)=>t.split(" ")[0]} />
                    <YAxis domain={[0, 100]} stroke="#1E293B" fontSize={11} />
                    <Tooltip wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
                    <Bar dataKey="Điểm Số" radius={[8, 8, 0, 0]} maxBarSize={45}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#1E293B" strokeWidth={2} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col justify-center items-center text-center text-gray-500 text-xs font-black uppercase font-mono">
                Bé chưa có dữ liệu phân tích kỹ năng.
              </div>
            )}
            <p className="text-[10px] text-center text-slate-500 font-extrabold tracking-tight uppercase">
              *Cột biểu đồ cao hơn biểu thị kỹ năng tròn vành rõ chữ của bé vượt trội! 👍
            </p>
          </div>

        </div>
      ) : (
        <div className="bg-white p-12 text-center border-4 border-dashed rounded-3xl space-y-3 font-black uppercase text-slate-400">
          <TrendingUp className="w-12 h-12 text-slate-300 mx-auto" />
          <p>Chưa có dữ liệu học tập nào ghi nhận. Bé hãy khởi động một bài học đầu tiên nhé!</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-[#3B82F6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] rounded-xl text-xs uppercase font-black cursor-pointer">Tải lại bảng</button>
        </div>
      )}

      {/* Rewards Badge Chest achievements */}
      <section className="bg-[#FEF3C7] p-6 rounded-[32px] border-4 border-[#1E293B] space-y-4 shadow-[8px_8px_0px_0px_#1E293B]">
        <h4 className="font-extrabold text-[#1E293B] text-base flex items-center gap-1.5 uppercase tracking-tight">
          🏆 Kho báu Huy hiệu của Bé Tom Lớp 3A ({rewards.length} unlocked)
        </h4>
        <p className="text-xs text-slate-700 font-black uppercase -mt-3">Bé chăm luyện nói mỗi ngày để mở khóa dốc rương báu vật nhé!</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 rounded-xl border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] flex gap-3 items-center">
            <span className="text-3xl">👦</span>
            <div>
              <h5 className="font-black text-[#1E293B] text-xs uppercase tracking-tight">Mới Gia Nhập</h5>
              <p className="text-[10px] text-slate-500 font-bold">Bé đã bắt đầu hành trình</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border-2 flex gap-3 items-center ${
            rewards.some(r=>r.id === "badge_1") ? "bg-white border-[#1E293B] opacity-100 shadow-[2px_2px_0px_0px_#1E293B]" : "bg-gray-100/40 border-[#1E293B]/20 opacity-50"
          }`}>
            <span className="text-3xl">🎙️</span>
            <div>
              <h5 className="font-black text-[#1E293B] text-xs uppercase tracking-tight">Giao Tiếp Nhí</h5>
              <p className="text-[10px] text-slate-550 font-bold">Hoàn thành lượt luyện nói</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border-2 flex gap-3 items-center ${
            rewards.some(r=>r.id === "badge_2") ? "bg-white border-[#1E293B] opacity-100 shadow-[2px_2px_0px_0px_#1E293B]" : "bg-gray-100/40 border-[#1E293B]/20 opacity-50"
          }`}>
            <span className="text-3xl">🌟</span>
            <div>
              <h5 className="font-black text-[#1E293B] text-xs uppercase tracking-tight">Sao Sáng Anh Ngữ</h5>
              <p className="text-[10px] text-slate-550 font-bold">Đạt bài học trên 85 điểm</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border-2 flex gap-3 items-center ${
            rewards.some(r=>r.id === "badge_3") ? "bg-white border-[#1E293B] opacity-100 shadow-[2px_2px_0px_0px_#1E293B]" : "bg-gray-100/40 border-[#1E293B]/20 opacity-50"
          }`}>
            <span className="text-3xl">🛡️</span>
            <div>
              <h5 className="font-black text-[#1E293B] text-xs uppercase tracking-tight">Hiệp Sĩ Phát Âm</h5>
              <p className="text-[10px] text-slate-550 font-bold">Đạt một phát âm trên 90 điểm</p>
            </div>
          </div>

        </div>
      </section>

      {/* Timeline Try Records list */}
      <section className="bg-white p-5 rounded-[32px] border-4 border-[#1E293B] shadow-[8px_8px_0px_0px_#1E293B] space-y-4">
        <h4 className="font-extrabold text-[#1E293B] text-base flex items-center gap-1.5 uppercase tracking-tight border-b pb-2">
          📜 Chi tiết lịch sử luyện phát âm thực tế (Study Log)
        </h4>

        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
          {records.map((rec) => (
            <div 
              key={rec.id}
              className="p-4 bg-slate-50 border-2 border-[#1E293B] hover:bg-slate-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all shadow-[2px_2px_0px_0px_#1E293B]"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-black bg-[#DBEAFE] text-[#3B82F6] border border-[#1E293B] px-2 py-0.5 rounded-lg shadow-[1px_1px_0px_0px_#1E293B]">
                    {rec.lesson_title}
                  </span>
                  <span className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-0.5">
                    <Calendar className="w-3 h-3" /> {new Date(rec.created_at).toLocaleString("vi-VN")}
                  </span>
                </div>
                
                <p className="text-xs font-bold text-slate-800 normal-case">
                  🎯 Câu gốc: <span className="font-mono text-[#1E293B] bg-white border border-[#1E293B]/20 py-0.5 px-1.5 rounded">{rec.target_text}</span>
                </p>
                <p className="text-xs font-bold text-slate-800 normal-case">
                  🗣️ Thu âm thực tế: <span className="text-[#3B82F6] font-black">"{rec.speech_text}"</span>
                </p>
                <p className="text-[11px] font-bold text-slate-550 leading-snug normal-case">
                  👩‍🏫 Sửa lỗi: <span className="text-slate-600 font-bold">"{rec.feedback}"</span>
                </p>
              </div>

              {/* Score Display */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-sm font-black uppercase text-[#1E293B] px-3.5 py-1.5 rounded-xl border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] ${
                  rec.score.average >= 85 
                    ? "bg-[#D1FAE5] text-emerald-900" 
                    : rec.score.average >= 70 
                    ? "bg-[#FEF3C7] text-amber-900" 
                    : "bg-red-100 text-red-900"
                }`}>
                  {rec.score.average} Điểm
                </span>
              </div>

            </div>
          ))}

          {records.length === 0 && (
            <p className="text-xs text-center text-slate-500 py-8 font-extrabold uppercase italic">Bé chưa thực hiện lượt luyện nói nào đâu.</p>
          )}
        </div>
      </section>

    </div>
  );
}

// Custom Close Icon
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
