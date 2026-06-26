// engines.js – จัดการ video engines

export async function runEngine(engine, payload) {
  try {
    switch (engine) {
      case 'FAL':
        return await callFalEngine(payload);
      case 'MAGIC_HOUR':
        return await callMagicHour(payload);
      // เพิ่ม engine อื่น ๆ ตามต้องการ
      default:
        throw new Error(`Engine ${engine} not supported`);
    }
  } catch (err) {
    console.error(`[Engine Error] ${err.message}`);
    throw err;
  }
}

async function callFalEngine(payload) {
  // TODO: implement API call
}

async function callMagicHour(payload) {
  // TODO: implement API call
}