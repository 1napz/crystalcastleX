const requiredFields = [
  "เรื่องที่อยากดูวันนี้",
  "รายละเอียด",
  "ระดับความสำคัญ"
];

function validate(content) {
  const missing = [];

  for (const field of requiredFields) {
    if (!content.includes(field) || content.includes(`${field} :`)) {
      missing.push(field);
    }
  }

  return missing;
}