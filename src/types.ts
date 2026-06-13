export type UserRole = "student" | "teacher" | "parent";

export interface User {
  id: string;
  fullname: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface DialogueTurn {
  id: string;
  role: "teacher" | "student";
  text: string;
  translation: string;
}

export interface VocabularyWord {
  word: string;
  type: string; // e.g., Noun, Verb
  pronunciation: string;
  meaning: string;
  example: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string; // Lớp 3 - Cơ bản, Thử thách, etc.
  topic: string; // Greetings, School, Family, etc.
  video_url: string; // Support Youtube, Google Drive, MP4
  script: DialogueTurn[];
  vocabulary: VocabularyWord[];
  key_sentences: string[];
}

export interface DetailScores {
  pronunciation: number; // Phát âm (0-100)
  accuracy: number;      // Độ chính xác từ vựng (0-100)
  intonation: number;    // Ngữ điệu (0-100)
  fluency: number;       // Độ lưu loát (0-100)
  average: number;       // Điểm trung bình
}

export interface PracticeRecord {
  id: string;
  user_id: string;
  lesson_id: string;
  lesson_title: string;
  speech_text: string;     // Student response transcription
  target_text: string;     // The sentence AI asked student to say
  score: DetailScores;
  feedback: string;        // Nhận xét tích cực
  suggestions: string[];   // Các từ cần cải thiện, mẹo nói hay hơn
  created_at: string;
}

export interface LearningProgress {
  user_id: string;
  completed_lessons: string[]; // Lesson IDs
  average_score: number;
  learning_streak: number;
  total_practice_time: number; // in minutes
  last_active: string;
}

export interface RewardBadge {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name from lucide
  points: number; // Star points
  unlockedAt?: string;
}
