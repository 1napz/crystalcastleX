const missing = validate(content);

if (missing.length > 0) {
  console.error("Missing fields:", missing.join(", "));
  process.exit(1);
}