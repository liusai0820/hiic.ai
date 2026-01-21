/**
 * Helper script to create a new journal issue folder structure
 * Usage: node scripts/create-issue-template.js <source_id> <year> <date-iso>
 * Example: node scripts/create-issue-template.js economist 2026 2026-01-20
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 3) {
  console.log('Usage: node scripts/create-issue-template.js <source_id> <year> <date-iso>');
  console.log('Example: node scripts/create-issue-template.js economist 2026 2026-01-20');
  process.exit(1);
}

const [sourceId, year, date] = args;
const issueId = date; // We use date as issue ID by convention

const baseDir = 'library-content';
const targetDir = path.join(baseDir, sourceId, year, issueId);

// Create directory
fs.mkdirSync(targetDir, { recursive: true });

// Create meta.json template
const metaTemplate = {
  title: "Issue Title Here",
  issueNumber: "Vol. X No. Y",
  publishDate: date,
  summary: "AI-generated executive summary goes here...",
  keyTakeaways: [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ],
  tags: ["Tag1", "Tag2"],
  relatedReport: {
    title: "",
    url: ""
  }
};

fs.writeFileSync(
  path.join(targetDir, 'meta.json'),
  JSON.stringify(metaTemplate, null, 2)
);

console.log(`\n✅ Created issue template at: ${targetDir}`);
console.log('Next steps:');
console.log(`1. Add cover image to: ${path.join(targetDir, 'cover.jpg')}`);
console.log(`2. Add PDF document to: ${path.join(targetDir, 'document.pdf')}`);
console.log(`3. Edit meta.json with actual content`);
console.log(`4. Upload to R2: wrangler r2 object put hiic-library/library/${sourceId}/${year}/${issueId}/ --recursive --file=${targetDir}`);
