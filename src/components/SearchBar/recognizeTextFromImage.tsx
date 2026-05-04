import { createWorker } from 'tesseract.js';

export const recognizeTextFromImage = async (file: File): Promise<string> => {
  // 1. Створюємо тимчасове посилання на картинку (це працює швидше і стабільніше за File)
  const imageURL = URL.createObjectURL(file);
  
  // 2. Створюємо воркер (в v5 мова передається відразу)
  const worker = await createWorker('ukr+eng');

  try {
    // 3. Розпізнаємо
    const { data: { text } } = await worker.recognize(imageURL);
    
    // 4. Обов'язково чистимо за собою
    await worker.terminate();
    URL.revokeObjectURL(imageURL); // Звільняємо пам'ять
    
    return text.trim();
  } catch (error) {
    // Чистимо навіть при помилці
    await worker.terminate();
    URL.revokeObjectURL(imageURL);
    
    console.error("Помилка OCR:", error);
    throw new Error("Не вдалося розпізнати текст");
  }
};
