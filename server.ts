import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not set. AI Speech and TTS features will run in demo/offline backup mode.");
}

// Database directory & file setup
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Default initial database content
const initialDB = {
  users: [
    { id: "student_1", fullname: "Bé Tom", email: "tom@student.com", role: "student", avatar: "👦" },
    { id: "teacher_1", fullname: "Cô Hoa", email: "hoa@teacher.com", role: "teacher", avatar: "👩‍🏫" },
    { id: "parent_1", fullname: "Mẹ của Tom", email: "parent@family.com", role: "parent", avatar: "👩" }
  ],
  lessons: [
    {
      id: "lesson_1",
      title: "Bài 1: Hello! What's Your Name?",
      description: "Học cách chào hỏi bằng tiếng Anh và tự giới thiệu tên của mình thật vui vẻ nào!",
      level: "Cơ bản (Lớp 3)",
      topic: "Greetings (Chào hỏi)",
      video_url: "https://youtu.be/Uv1JkBL5728?list=RDUv1JkBL5728", // Super Simple Song - What's your name
      script: [
        { id: "s1", role: "teacher", text: "Hello! What's your name?", translation: "Xin chào! Tên của con là gì?" },
        { id: "s2", role: "student", text: "Hello! My name is Tom.", translation: "Xin chào! Tên của con là Tom." },
        { id: "s3", role: "teacher", text: "Nice to meet you, Tom.", translation: "Rất vui được gặp con, Tom." },
        { id: "s4", role: "student", text: "Nice to meet you too.", translation: "Con cũng rất vui được gặp cô." }
      ],
      vocabulary: [
        { word: "Hello", type: "Interjection", pronunciation: "/həˈləʊ/", meaning: "Xin chào", example: "Hello, teacher!" },
        { word: "Name", type: "Noun", pronunciation: "/neɪm/", meaning: "Tên", example: "My name is Tom." },
        { word: "Meet", type: "Verb", pronunciation: "/miːt/", meaning: "Gặp gỡ", example: "Nice to meet you!" }
      ],
      key_sentences: [
        "What's your name?",
        "My name is Tom.",
        "Nice to meet you."
      ]
    },
    {
      id: "lesson_2",
      title: "Bài 2: Let's Go To My Classroom!",
      description: "Cùng làm quen với các dụng cụ học tập dễ thương có trong cặp sách của bé.",
      level: "Trung bình (Lớp 3)",
      topic: "School Items (Trường lớp)",
      video_url: "https://www.youtube.com/embed/i0S6AeSE1Uw?list=RDi0S6AeSE1Uw", // Super Simple Song - School items
      script: [
        { id: "s1", role: "teacher", text: "What is this? Is it a book?", translation: "Đây là cái gì? Có phải cuốn sách không con?" },
        { id: "s2", role: "student", text: "No, it is a blue pencil.", translation: "Dạ không, nó là cây bút chì màu xanh dương." },
        { id: "s3", role: "teacher", text: "Oh, is it in your bag?", translation: "Ôi, thế nó có nằm trong cặp sách của con không?" },
        { id: "s4", role: "student", text: "Yes, it is in my school bag.", translation: "Dạ có, nó ở trong cặp đi học của con." }
      ],
      vocabulary: [
        { word: "Pencil", type: "Noun", pronunciation: "/ˈpensl/", meaning: "Bút chì", example: "This is my pencil." },
        { word: "School bag", type: "Noun", pronunciation: "/skuːl bæɡ/", meaning: "Cặp sách", example: "My school bag is green." },
        { word: "Book", type: "Noun", pronunciation: "/bʊk/", meaning: "Sách", example: "Open your book, please." }
      ],
      key_sentences: [
        "Is it a book?",
        "It is a blue pencil.",
        "Yes, it is in my school bag."
      ]
    },
    {
      id: "lesson_3",
      title: "Bài 3: My Cute Farm Animals!",
      description: "Thăm nông trại vui nhộn và học tên gọi của các bạn động vật đáng yêu.",
      level: "Thử thách (Lớp 3)",
      topic: "Animals (Thú cưng & Động vật)",
      video_url: "https://www.youtube.com/shorts/2XjJPxxtQoE?feature=share", // Super Simple Song - Farm animals
      script: [
        { id: "s1", role: "teacher", text: "Look! Do you have a dog?", translation: "Nhìn kìa! Con có nuôi một chú chó nào không?" },
        { id: "s2", role: "student", text: "Yes! I have a happy brown dog.", translation: "Dạ có! Con nuôi một chú chó màu nâu rất vui vẻ." },
        { id: "s3", role: "teacher", text: "Great! Does it love bones?", translation: "Tuyệt vời! Chú chó ấy có thích ăn xương không con?" },
        { id: "s4", role: "student", text: "Yes, it loves to run and eat bones.", translation: "Dạ có, nó rất thích chạy chơi và ăn xương ạ." }
      ],
      vocabulary: [
        { word: "Dog", type: "Noun", pronunciation: "/dɒɡ/", meaning: "Con chó", example: "I love my little dog." },
        { word: "Farm", type: "Noun", pronunciation: "/fɑːm/", meaning: "Nông trại", example: "My grandpa lives on a farm." },
        { word: "Happy", type: "Adjective", pronunciation: "/ˈhæpi/", meaning: "Vui vẻ", example: "She is a happy girl." }
      ],
      key_sentences: [
        "Do you have a dog?",
        "I have a happy brown dog.",
        "Yes, it loves to run and eat bones."
      ]
    }
  ],
  practiceRecords: [
    {
      id: "record_demo_1",
      user_id: "student_1",
      lesson_id: "lesson_1",
      lesson_title: "Bài 1: Hello! What's Your Name?",
      speech_text: "My name is Tom.",
      target_text: "My name is Tom.",
      score: { pronunciation: 90, accuracy: 95, intonation: 88, fluency: 92, average: 91 },
      feedback: "Con phát âm đúng từ 'name', âm cuối rất chuẩn xác. Nghe rất lưu loát và tự nhiên!",
      suggestions: ["Con hãy giữ nguyên ngữ điệu đáng yêu này nhé!", "Thử mở khẩu hình to hơn ở nguyên âm 'a'."],
      created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "record_demo_2",
      user_id: "student_1",
      lesson_id: "lesson_1",
      lesson_title: "Bài 1: Hello! What's Your Name?",
      speech_text: "Nice to meet you too.",
      target_text: "Nice to meet you too.",
      score: { pronunciation: 85, accuracy: 88, intonation: 82, fluency: 85, average: 85 },
      feedback: "Tuyệt quá! Cách phát âm của con nghe rất rõ ràng.",
      suggestions: ["Bé hãy chú ý nhấn giọng ở từ 'meet' một chút nhé.", "Cố gắng nối âm nhẹ giữa 'meet' và 'you'."],
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "record_demo_3",
      user_id: "student_1",
      lesson_id: "lesson_2",
      lesson_title: "Bài 2: Let's Go To My Classroom!",
      speech_text: "it is a blue pen",
      target_text: "No, it is a blue pencil.",
      score: { pronunciation: 78, accuracy: 70, intonation: 75, fluency: 80, average: 76 },
      feedback: "Cố lên con yêu! Con đã nói được một nửa câu mẫu một cách xuất sắc.",
      suggestions: ["Bé nhớ nói đầy đủ từ 'pencil' thay vì chỉ 'pen' nhé.", "Nghe hướng dẫn phát âm chuẩn và thử lại nhé."],
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ],
  progress: [
    {
      user_id: "student_1",
      completed_lessons: ["lesson_1"],
      average_score: 84,
      learning_streak: 3,
      total_practice_time: 45,
      last_active: new Date().toISOString()
    }
  ],
  rewards: [
    { id: "badge_1", title: "Nhà Giao Tiếp Nhí", description: "Hoàn thành xuất sắc lượt nói đầu tiên của con", icon: "Mic", points: 10, unlockedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
    { id: "badge_2", title: "Sao Sáng Tiếng Anh", description: "Đạt số điểm trung bình trên 85 trong một bài học", icon: "Star", points: 20, unlockedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
  ]
};

// Write database function
const saveDB = (data: typeof initialDB) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
};

// Read database function
const loadDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    saveDB(initialDB);
    return initialDB;
  }
  try {
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error parsing DB file, reverting to defaults", err);
    return initialDB;
  }
};

// --- DATABASE API ROUTES ---

// 1. Get lessons list
app.get("/api/lessons", (req, res) => {
  const db = loadDB();
  res.json(db.lessons);
});

// 2. Create Lesson (Teacher/Admin)
app.post("/api/lessons", (req, res) => {
  const db = loadDB();
  const newLesson = {
    id: `lesson_${Date.now()}`,
    title: req.body.title || "Bài Học Mới",
    description: req.body.description || "Mô tả bài học",
    level: req.body.level || "Cơ bản (Lớp 3)",
    topic: req.body.topic || "Giao tiếp cơ bản",
    video_url: req.body.video_url || "",
    script: req.body.script || [],
    vocabulary: req.body.vocabulary || [],
    key_sentences: req.body.key_sentences || []
  };
  db.lessons.push(newLesson);
  saveDB(db);
  res.status(201).json(newLesson);
});

// 3. Edit Lesson
app.put("/api/lessons/:id", (req, res) => {
  const db = loadDB();
  const index = db.lessons.findIndex((l: any) => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Không tìm thấy bài học" });
  }

  db.lessons[index] = {
    ...db.lessons[index],
    title: req.body.title || db.lessons[index].title,
    description: req.body.description || db.lessons[index].description,
    level: req.body.level || db.lessons[index].level,
    topic: req.body.topic || db.lessons[index].topic,
    video_url: req.body.video_url || db.lessons[index].video_url,
    script: req.body.script || db.lessons[index].script,
    vocabulary: req.body.vocabulary || db.lessons[index].vocabulary,
    key_sentences: req.body.key_sentences || db.lessons[index].key_sentences
  };

  saveDB(db);
  res.json(db.lessons[index]);
});

// 4. Delete Lesson
app.delete("/api/lessons/:id", (req, res) => {
  const db = loadDB();
  const index = db.lessons.findIndex((l: any) => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Không tìm thấy bài học" });
  }
  db.lessons.splice(index, 1);
  saveDB(db);
  res.json({ message: "Xóa bài học thành công", id: req.params.id });
});

// 5. Get student progress & stats
app.get("/api/progress/:userId", (req, res) => {
  const db = loadDB();
  const userId = req.params.userId;
  
  let userProgress = db.progress.find((p: any) => p.user_id === userId);
  if (!userProgress) {
    userProgress = {
      user_id: userId,
      completed_lessons: [],
      average_score: 0,
      learning_streak: 1,
      total_practice_time: 0,
      last_active: new Date().toISOString()
    };
    db.progress.push(userProgress);
    saveDB(db);
  }

  const userRecords = db.practiceRecords.filter((r: any) => r.user_id === userId);
  const userRewards = db.rewards.filter((r: any) => r.user_id === userId);

  res.json({
    progress: userProgress,
    practiceRecords: userRecords,
    rewards: userRewards
  });
});

// 6. Reset baby student score (highly requested by test scenarios)
app.post("/api/progress/:userId/reset", (req, res) => {
  const db = loadDB();
  const userId = req.params.userId;

  // Re-establish fresh child starting metrics
  db.progress = db.progress.filter((p: any) => p.user_id !== userId);
  db.practiceRecords = db.practiceRecords.filter((r: any) => r.user_id !== userId);
  db.rewards = db.rewards.filter((r: any) => r.user_id !== userId);

  // Bring baseline metrics
  db.progress.push({
    user_id: userId,
    completed_lessons: [],
    average_score: 0,
    learning_streak: 1,
    total_practice_time: 0,
    last_active: new Date().toISOString()
  });

  saveDB(db);
  res.json({ success: true, message: "Đã làm mới tiến trình học của Bé!" });
});


// 7. Text-To-Speech (Gemini AI TTS Provider)
app.post("/api/tts", async (req, res) => {
  const { text, voiceName = "Kore" } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Văn bản phát âm không được để trống" });
  }

  if (!ai) {
    // Return mock Base64 audio if Gemini not configured or missing key
    return res.json({
      demoMode: true,
      audioBase64: "", // Client will fall back to Web Speech Synthesis API seamlessly
      message: "Vận hành chế độ ngoại tuyến Web Speech"
    });
  }

  try {
    // Generate TTS cheerful audio using gemini-3.1-flash-tts-preview
    // Let's specify cheerful style for kid English teacher
    const speechPrompt = `Say cheerfully in standard friendly English: ${text}`;
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: speechPrompt }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName } // Kore, Puck, Zephyr, Fenrir
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audioBase64: base64Audio });
    } else {
      throw new Error("Không nhận diện được phản hồi âm thanh từ Gemini");
    }
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    res.status(500).json({
      error: error.message || "Lỗi tạo giọng nói AI",
      demoMode: true
    });
  }
});

// 7b. Legacy/Direct Evaluation API for Frontend matching payload
app.post("/api/evaluate", async (req, res) => {
  const { expected, actual, lessonId, userId = "student_1" } = req.body;
  const target_text = expected || "";
  const speech_text = actual || "";
  const lesson_id = lessonId || "custom";
  const user_id = userId;

  const transcribedText = speech_text || "[Bé chưa thu âm]";
  let evaluationResult: any = null;

  if (!ai) {
    const distance_or_match = transcribedText.toLowerCase().trim() === target_text.toLowerCase().trim();
    const average = distance_or_match ? 95 : 75;
    evaluationResult = {
      pronunciation: distance_or_match ? 94 : 76,
      accuracy: distance_or_match ? 98 : 70,
      intonation: distance_or_match ? 92 : 75,
      fluency: distance_or_match ? 95 : 80,
      average: average,
      description: distance_or_match 
        ? "Con nói cực kỳ giỏi! Hãy tự tin phát huy ở các từ tiếp theo nhé!" 
        : "Tuyệt vời bé ơi! Con đã dám thử sức nói tiếng Anh. Hãy nghe cô giáo nói rồi thu âm lại lần nữa nhé!",
      suggestions: distance_or_match 
        ? ["Tuyệt vời! Con phát âm chuẩn giọng bản xứ.", "Con hãy cố gắng nối âm thông thạo hơn nhé."]
        : ["Hãy nghe kỹ từ cuối trong cụm từ.", "Nói rõ ràng và thở đều khi bắt đầu phát âm."]
    };
  } else {
    try {
      const evaluationPrompt = `Bạn là một giáo viên tiếng Anh tiểu học vui tươi, cực kỳ nhiệt huyết và thân thiện dành cho một em bé lớp 3 (8 tuổi) người Việt Nam.
Bé đang luyện nói theo mẫu câu: "${target_text}".
Kết quả bé thu âm được (văn bản nhận diện giọng nói): "${transcribedText}".

Hãy đánh giá xem bé phát âm đúng đến mức nào và trả về duy nhất ở dạng JSON có định dạng sau:
{
  "pronunciation": <điểm từ 10 đến 100>,
  "accuracy": <điểm từ 10 đến 100>,
  "intonation": <điểm từ 10 đến 100>,
  "fluency": <điểm từ 10 đến 100>,
  "average": <trung bình cộng 4 điểm trên>,
  "description": "<Một câu nhận xét tiếng Việt tối đa 20 từ tràn đầy sự khích lệ, dùng đại từ nhân xưng là 'Con' hoặc 'Bé' và xưng hô 'Cô/Thầy', có các biểu tượng vui như 🌟, 👍, 🎉>",
  "suggestions": [
     "<gợi ý 1 bằng tiếng Việt cực kỳ ngắn gọn và dễ hiểu với bé lớp 3>",
     "<gợi ý 2 bằng tiếng Việt cực kỳ ngắn gọn và dễ hiểu với bé lớp 3>"
  ]
}

Nguyên tắc cho điểm:
- Nếu bé nói hoàn toàn khớp hoặc gần đúng: Điểm trung bình > 85.
- Nếu bé nói sai một số từ hoặc thiếu từ: Điểm trung bình từ 65 đến 84.
- Nếu bé nói hoàn toàn không liên quan hoặc rỗng ("${transcribedText}" là "[Bé chưa thu âm]"): Điểm trung bình từ 30 đến 50.

Không thêm bất kỳ định dạng markdown nào hay bọc chữ lộn xộn. Chỉ trả về chuỗi JSON thô hợp lệ.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: evaluationPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text.trim());
      evaluationResult = parsed;
    } catch (err: any) {
      console.error("Gemini Speech Evaluation Error:", err);
      evaluationResult = {
        pronunciation: 80,
        accuracy: 80,
        intonation: 80,
        fluency: 80,
        average: 80,
        description: "Bé nói rất tốt! Cô rất tự hào về tinh thần học hỏi của con. 👍",
        suggestions: ["Bé hãy luyện nghe và lặp lại thật nhiều lần nhé.", "Đọc chậm rãi từng chữ một để cô nghe rõ hơn."]
      };
    }
  }

  // Record practice progress statistics
  try {
    const db = loadDB();
    const lesson = db.lessons.find((l: any) => l.id === lesson_id);
    const lessonTitle = lesson ? lesson.title : "Bài học Tiếng Anh";

    const newRecord = {
      id: `record_${Date.now()}`,
      user_id: user_id,
      lesson_id: lesson_id,
      lesson_title: lessonTitle,
      speech_text: transcribedText,
      target_text: target_text,
      score: evaluationResult,
      feedback: evaluationResult.description,
      suggestions: evaluationResult.suggestions || [],
      created_at: new Date().toISOString()
    };

    db.practiceRecords.push(newRecord);

    let userProgress = db.progress.find((p: any) => p.user_id === user_id);
    if (!userProgress) {
      userProgress = {
        user_id: user_id,
        completed_lessons: [],
        average_score: 0,
        learning_streak: 1,
        total_practice_time: 0,
        last_active: new Date().toISOString()
      };
      db.progress.push(userProgress);
    }

    const lastActiveDate = new Date(userProgress.last_active).toDateString();
    const todayDate = new Date().toDateString();
    if (lastActiveDate !== todayDate) {
      const timeDiff = Math.abs(new Date().getTime() - new Date(userProgress.last_active).getTime());
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (dayDiff <= 1) {
        userProgress.learning_streak += 1;
      } else if (dayDiff > 1) {
        userProgress.learning_streak = 1;
      }
    }
    userProgress.last_active = new Date().toISOString();
    userProgress.total_practice_time += 2;

    const records = db.practiceRecords.filter((r: any) => r.user_id === user_id);
    if (records.length > 0) {
      const totalAvg = records.reduce((sum: number, r: any) => sum + r.score.average, 0);
      userProgress.average_score = Math.round(totalAvg / records.length);
    }

    if (evaluationResult.average >= 70 && !userProgress.completed_lessons.includes(lesson_id)) {
      userProgress.completed_lessons.push(lesson_id);
    }

    if (evaluationResult.average >= 90 && !db.rewards.some((r: any) => r.user_id === user_id && r.id === "badge_3")) {
      db.rewards.push({
        id: "badge_3",
        title: "Hiệp Sĩ Phát Âm",
        description: "Đạt một câu bứt phá trên 90 điểm phát âm",
        icon: "Award",
        points: 50,
        unlockedAt: new Date().toISOString()
      });
    }

    saveDB(db);
  } catch (err) {
    console.error("Lỗi cập nhật tiến trình trong /api/evaluate:", err);
  }

  res.json(evaluationResult);
});

// 8. Evaluation AI API (Gemini Speech & Conversation Assessor)
app.post("/api/practice/evaluate", async (req, res) => {
  const { user_id, lesson_id, target_text, speech_text } = req.body;

  if (!user_id || !lesson_id || !target_text) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const transcribedText = speech_text || "[Bé chưa thu âm]";
  let evaluationResult: any = null;

  if (!ai) {
    // Offline/Demo model assessment fallback if Gemini is offline
    const distance_or_match = transcribedText.toLowerCase().trim() === target_text.toLowerCase().trim();
    const average = distance_or_match ? 95 : 75;
    evaluationResult = {
      pronunciation: distance_or_match ? 94 : 76,
      accuracy: distance_or_match ? 98 : 70,
      intonation: distance_or_match ? 92 : 75,
      fluency: distance_or_match ? 95 : 80,
      average: average,
      description: distance_or_match 
        ? "Con nói cực kỳ giỏi! Hãy tự tin phát huy ở các từ tiếp theo nhé!"
        : "Tuyệt vời bé ơi! Con đã dám thử sức nói tiếng Anh. Hãy nghe cô giáo nói rồi thu âm lại lần nữa nhé!",
      suggestions: distance_or_match 
        ? ["Tuyệt vời! Con phát âm chuẩn giọng bản xứ.", "Con hãy cố gắng nối âm thông thạo hơn nhé."]
        : ["Hãy nghe kỹ từ cuối trong cụm từ.", "Nói rõ ràng và thở đều khi bắt đầu phát âm."]
    };
  } else {
    try {
      const evaluationPrompt = `Bạn là một giáo viên tiếng Anh tiểu học vui tươi, cực kỳ nhiệt huyết và thân thiện dành cho một em bé lớp 3 (8 tuổi) người Việt Nam.
Bé đang luyện nói theo mẫu câu: "${target_text}".
Kết quả bé thu âm được (văn bản nhận diện giọng nói): "${transcribedText}".

Hãy đánh giá xem bé phát âm đúng đến mức nào và trả về duy nhất ở dạng JSON có định dạng sau:
{
  "pronunciation": <điểm từ 10 đến 100>,
  "accuracy": <điểm từ 10 đến 100>,
  "intonation": <điểm từ 10 đến 100>,
  "fluency": <điểm từ 10 đến 100>,
  "average": <trung bình cộng 4 điểm trên>,
  "description": "<Một câu nhận xét tiếng Việt tối đa 20 từ tràn đầy sự khích lệ, dùng đại từ nhân xưng là 'Con' hoặc 'Bé' và xưng hô 'Cô/Thầy', có các biểu tượng vui như 🌟, 👍, 🎉>",
  "suggestions": [
     "<gợi ý 1 bằng tiếng Việt cực kỳ ngắn gọn và dễ hiểu với bé lớp 3>",
     "<gợi ý 2 bằng tiếng Việt cực kỳ ngắn gọn và dễ hiểu với bé lớp 3>"
  ]
}

Nguyên tắc cho điểm:
- Nếu bé nói hoàn toàn khớp hoặc gần đúng: Điểm trung bình > 85.
- Nếu bé nói sai một số từ hoặc thiếu từ: Điểm trung bình từ 65 đến 84.
- Nếu bé nói hoàn toàn không liên quan hoặc rỗng ("${transcribedText}" là "[Bé chưa thu âm]"): Điểm trung bình từ 30 đến 50.

Không thêm bất kỳ định dạng markdown nào hay bọc chữ lộn xộn. Chỉ trả về chuỗi JSON thô hợp lệ.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: evaluationPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text.trim());
      evaluationResult = parsed;
    } catch (err: any) {
      console.error("Gemini Speech Evaluation Error:", err);
      evaluationResult = {
        pronunciation: 80,
        accuracy: 80,
        intonation: 80,
        fluency: 80,
        average: 80,
        description: "Bé nói rất tốt! Cô rất tự hào về tinh thần học hỏi của con. 👍",
        suggestions: ["Bé hãy luyện nghe và lặp lại thật nhiều lần nhé.", "Đọc chậm rãi từng chữ một để cô nghe rõ hơn."]
      };
    }
  }

  // Save practice records
  const db = loadDB();
  const lesson = db.lessons.find((l: any) => l.id === lesson_id);
  const lessonTitle = lesson ? lesson.title : "Bài học Tiếng Anh";

  const newRecord = {
    id: `record_${Date.now()}`,
    user_id: user_id,
    lesson_id: lesson_id,
    lesson_title: lessonTitle,
    speech_text: transcribedText,
    target_text: target_text,
    score: evaluationResult,
    feedback: evaluationResult.description,
    suggestions: evaluationResult.suggestions || [],
    created_at: new Date().toISOString()
  };

  db.practiceRecords.push(newRecord);

  // Update progress, completed lessons list and streaks
  let userProgress = db.progress.find((p: any) => p.user_id === user_id);
  if (!userProgress) {
    userProgress = {
      user_id: user_id,
      completed_lessons: [],
      average_score: 0,
      learning_streak: 1,
      total_practice_time: 0,
      last_active: new Date().toISOString()
    };
    db.progress.push(userProgress);
  }

  // Simple streak logic on action
  const lastActiveDate = new Date(userProgress.last_active).toDateString();
  const todayDate = new Date().toDateString();
  if (lastActiveDate !== todayDate) {
    // If last active was yesterday, increase streak, else reset or preserve
    const timeDiff = Math.abs(new Date().getTime() - new Date(userProgress.last_active).getTime());
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (dayDiff <= 1) {
      userProgress.learning_streak += 1;
    } else if (dayDiff > 1) {
      userProgress.learning_streak = 1;
    }
  }
  userProgress.last_active = new Date().toISOString();
  userProgress.total_practice_time += 2; // Each try counts as 2 minutes of practice!

  // Re-calculate average score for student based on actual records
  const records = db.practiceRecords.filter((r: any) => r.user_id === user_id);
  if (records.length > 0) {
    const totalAvg = records.reduce((sum: number, r: any) => sum + r.score.average, 0);
    userProgress.average_score = Math.round(totalAvg / records.length);
  }

  // Update completed lessons: if score.average is >= 70, insert lesson into complete list
  if (evaluationResult.average >= 70 && !userProgress.completed_lessons.includes(lesson_id)) {
    userProgress.completed_lessons.push(lesson_id);
  }

  // Reward unlocking mechanisms
  // Badge 3: Master of english (>90 score)
  if (evaluationResult.average >= 90 && !db.rewards.some((r: any) => r.user_id === user_id && r.id === "badge_3")) {
    db.rewards.push({
      id: "badge_3",
      title: "Hiệp Sĩ Phát Âm",
      description: "Đạt một câu bứt phá trên 90 điểm phát âm",
      icon: "Award",
      points: 50,
      unlockedAt: new Date().toISOString()
    });
  }

  // Badge 4: Explorer of Farm Animals
  if (lesson_id === "lesson_3" && evaluationResult.average >= 75 && !db.rewards.some((r: any) => r.user_id === user_id && r.id === "badge_4")) {
    db.rewards.push({
      id: "badge_4",
      title: "Nhà Thám Hiểm Nông Trại",
      description: "Hoàn tranh luyện nói bài học Động Vật Nông Trại",
      icon: "Sparkles",
      points: 30,
      unlockedAt: new Date().toISOString()
    });
  }

  saveDB(db);
  res.json({
    record: newRecord,
    updated_progress: userProgress,
    rewards: db.rewards.filter((r: any) => r.user_id === user_id)
  });
});


// Serve Vite client app
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Run inside dev server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static delivery
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Kid English backend matching requirements running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
