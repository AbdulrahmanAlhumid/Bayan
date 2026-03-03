import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import express from "express";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(__dirname, "..", "..");

dotenv.config({ path: path.join(backendRoot, ".env.local") });
dotenv.config({ path: path.join(backendRoot, ".env") });
dotenv.config({ path: path.join(projectRoot, ".env.local") });
dotenv.config({ path: path.join(projectRoot, ".env") });

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

function createGeminiClient() {
  if (!GEMINI_API_KEY) {
    const error = new Error("لم يتم تعريف مفتاح Gemini API. أضف GEMINI_API_KEY في ملف .env.local");
    error.status = 500;
    throw error;
  }

  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

function parseJsonResponse(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    const error = new Error("تعذّر قراءة نتيجة التحليل. حاول تبسيط النص أو تقليله.");
    error.status = 422;
    throw error;
  }

  return JSON.parse(jsonMatch[0]);
}

function buildDocContext({ result, originalText }) {
  if (originalText?.trim()) {
    return originalText;
  }

  return `ملخص النظام: ${result.summary}\n\nالالتزامات: ${
    result.obligations?.map((item) => `${item.title}: ${item.description}`).join("\n") || ""
  }\n\nالعقوبات: ${
    result.penalties?.map((item) => `${item.title}: ${item.description}`).join("\n") || ""
  }`;
}

function buildChatSystem({ result, originalText }) {
  const docContext = buildDocContext({ result, originalText });

  return `أنت مساعد قانوني متخصص في الإجابة على أسئلة المستخدمين حول وثيقة تنظيمية محددة فقط.

الوثيقة التي تعمل عليها هي: "${result.title || "النظام المحلل"}"

محتوى الوثيقة:
---
${docContext.slice(0, 6000)}
---

تعليمات صارمة:
1. أجب فقط على الأسئلة المتعلقة بهذه الوثيقة تحديداً.
2. إذا كان السؤال خارج نطاق الوثيقة أو لا علاقة له بها (مثل أسئلة عن الطقس، الطبخ، السياسة، أو أي موضوع آخر)، رد بهذا النص بالضبط: "⚠️ سؤالك خارج نطاق هذه الوثيقة. أنا هنا فقط للإجابة على ما يتعلق بـ «${result.title || "النظام المحلل"}». هل لديك سؤال عن هذا النظام؟"
3. إذا كانت المعلومة غير موجودة في الوثيقة، قل ذلك بوضوح ولا تخترع إجابة.
4. استخدم لغة عربية بسيطة وواضحة.
5. لا تقدم استشارات قانونية رسمية، وذكّر المستخدم بذلك عند الحاجة.`;
}

async function analyzeDocument({ inputText, uploadedFile, prompt }) {
  const client = createGeminiClient();
  const hasText = inputText?.trim();
  const hasPdf = uploadedFile?.type === "pdf";

  if (!hasText && !hasPdf) {
    const error = new Error("يرجى إدخال نص أو رفع ملف أولاً");
    error.status = 400;
    throw error;
  }

  const contents = hasPdf
    ? [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: uploadedFile.base64,
              },
            },
            { text: "حلّل هذا النظام أو اللائحة واستخرج المعلومات المطلوبة." },
          ],
        },
      ]
    : [
        {
          role: "user",
          parts: [{ text: `النص التنظيمي للتحليل:\n\n${inputText}` }],
        },
      ];

  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents,
    config: {
      systemInstruction: prompt,
    },
  });

  const text = response.text || "";
  if (!text) {
    const error = new Error("لم يتم استلام رد من الذكاء الاصطناعي. يرجى المحاولة مجدداً.");
    error.status = 502;
    throw error;
  }

  return parseJsonResponse(text);
}

async function generateChatReply({ messages, result, originalText }) {
  const client = createGeminiClient();

  const contents = messages.map((message) => ({
    role: message.role === "user" ? "user" : "model",
    parts: [{ text: message.text }],
  }));

  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents,
    config: {
      systemInstruction: buildChatSystem({ result, originalText }),
    },
  });

  return response.text || "لم أتمكن من الإجابة، يرجى المحاولة مجدداً.";
}

function sendError(res, error) {
  const status =
    Number(error?.status) ||
    Number(error?.code) ||
    (error?.status === "UNAVAILABLE" ? 503 : null) ||
    500;

  res.status(status).json({
    error: {
      message: error?.message || "حدث خطأ غير متوقع في الخادم",
      status: error?.status || "INTERNAL_ERROR",
      code: status,
    },
  });
}

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "30mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      const result = await analyzeDocument(req.body);
      res.json({ result });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const reply = await generateChatReply(req.body);
      res.json({ reply });
    } catch (error) {
      sendError(res, error);
    }
  });

  return app;
}

export function startServer(port = Number(process.env.PORT) || 8787) {
  const app = createApp();
  return app.listen(port, () => {
    console.log(`Bayan server listening on http://localhost:${port}`);
  });
}

if (process.argv[1] === __filename) {
  startServer();
}
