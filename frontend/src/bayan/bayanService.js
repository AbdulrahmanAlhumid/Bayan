export const DEFAULT_PROMPT = `أنت محلل قانوني متخصص في تبسيط الأنظمة واللوائح الرسمية للمواطنين ورواد الأعمال.

مهمتك: تحليل النص التنظيمي المقدم وإصدار تقرير منظم يحتوي على العناصر التالية بالضبط.

أجب فقط بـ JSON صالح بدون أي نص إضافي أو markdown، بهذا الهيكل:
{
  "title": "عنوان النظام أو اللائحة",
  "summary": "ملخص مبسط للنظام في 3-5 جمل يفهمه أي شخص دون خلفية قانونية",
  "targets": ["الفئة المستهدفة 1", "الفئة المستهدفة 2"],
  "obligations": [
    {"title": "عنوان الالتزام", "description": "وصف مبسط للالتزام"}
  ],
  "penalties": [
    {"title": "عنوان العقوبة", "description": "وصف العقوبة أو المخاطرة"}
  ],
  "faqs": [
    {"question": "السؤال الشائع", "answer": "الإجابة المبسطة"}
  ]
}

ملاحظات مهمة:
- استخدم لغة بسيطة وواضحة تخلو من المصطلحات القانونية المعقدة
- إذا لم يكن هناك عقوبات صريحة، اذكر المخاطر المحتملة
- أضف 3-5 أسئلة شائعة مفيدة
- كن دقيقاً وأميناً في نقل روح النص الأصلي`;

async function request(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `فشل الطلب إلى الخادم المحلي برمز ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export async function analyzeDocument({ inputText, uploadedFile, prompt }) {
  const hasText = inputText.trim();
  const hasPdf = uploadedFile?.type === "pdf";

  if (!hasText && !hasPdf) {
    throw new Error("يرجى إدخال نص أو رفع ملف أولاً");
  }

  const data = await request("/api/analyze", {
    inputText,
    uploadedFile,
    prompt,
  });

  return data.result;
}

export async function sendChatMessage({ messages, result, originalText }) {
  const data = await request("/api/chat", {
    messages,
    result,
    originalText,
  });

  return data.reply || "لم أتمكن من الإجابة، يرجى المحاولة مجدداً.";
}
