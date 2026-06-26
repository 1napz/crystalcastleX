// rebuild-package-json.js
const fs = require('fs');

try {
  // Read the lockfile
  const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));

  // Create a basic package.json structure
  const pkg = {
    name: "crystalcastle",
    version: "1.0.0",
    description: "Rebuilt package.json from package-lock.json",
    dependencies: {}
  };

  // Extract dependencies
  if (lock.dependencies) {
    for (const [dep, info] of Object.entries(lock.dependencies)) {
      pkg.dependencies[dep] = info.version;
    }
  }

  // Write to package.json
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  console.log("✅ package.json has been rebuilt from package-lock.json");
} catch (err) {
  console.error("❌ Failed to rebuild package.json:", err.message);
}
