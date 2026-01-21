
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SOURCE_DIR = '/Users/qibaoba/Downloads/Magazines';
const BUCKET_NAME = 'hiic-library';
const TEMP_DIR = 'temp_upload_stage';

// Mappings from folder name to source ID and metadata
const SOURCE_MAP = {
  'The_Economist': {
    id: 'economist',
    name: 'The Economist',
    parse: (filename) => {
      // Format: The Economist-03.01.2025.pdf (DD.MM.YYYY)
      const match = filename.match(/(\d{2})\.(\d{2})\.(\d{4})/);
      if (match) {
        const [_, day, month, year] = match;
        return {
          date: `${year}-${month}-${day}`,
          year,
          title: `The Economist ${month}/${day}/${year}`,
          issueNumber: `${year}.${month}.${day}`
        };
      }
      return null;
    }
  },
  '财新周刊': {
    id: 'internal-brief', // Mapping to "internal-brief" or create new 'caixin' source? Let's map to internal-brief for now as a placeholder or add 'caixin' to types later. Actually, let's stick to existing types or add a new one. The user mentioned Caixin specifically. I should probably add 'caixin' to types later, but for now let's map to 'internal-brief' OR just 'caixin' and update types. Let's use 'caixin' and I will update types.ts.
    id: 'caixin',
    name: '财新周刊',
    parse: (filename) => {
      // Format: 财新周刊-第1期2026.pdf
      const match = filename.match(/第(\d+)期(\d{4})/);
      if (match) {
        const [_, issue, year] = match;
        // Estimate date: Jan 1st + (issue * 7) days roughly, or just use a dummy date for sorting
        // Better: Use year-issue as date string for sorting if needed, but standard date is YYYY-MM-DD
        // Let's fake the date: Year-01-01 + weeks.
        const weekOffset = (parseInt(issue) - 1) * 7;
        const d = new Date(year, 0, 1 + weekOffset);
        const dateStr = d.toISOString().split('T')[0];

        return {
          date: dateStr,
          year,
          title: `财新周刊 ${year}年 第${issue}期`,
          issueNumber: `No. ${issue}`
        };
      }
      return null;
    }
  },
  'Barrons': {
    id: 'barrons',
    name: "Barron's",
    parse: (filename) => {
      // Format: Barron's-05.01.2026.pdf (DD.MM.YYYY)
      const match = filename.match(/Barron's-(\d{2})\.(\d{2})\.(\d{4})/);
      if (match) {
        const [_, day, month, year] = match;
        return {
          date: `${year}-${month}-${day}`,
          year,
          title: `Barron's ${month}/${day}/${year}`,
          issueNumber: `${year}.${month}.${day}`
        };
      }
      return null;
    }
  },
  'The_New_Yorker': {
    id: 'new_yorker',
    name: "The New Yorker",
    parse: (filename) => {
        // Format: The New Yorker-1.12.2026.pdf (D.M.YYYY or DD.MM.YYYY)
        const match = filename.match(/The New Yorker-(\d{1,2})\.(\d{1,2})\.(\d{4})/);
        if (match) {
          let [_, day, month, year] = match;
          // Pad with 0 if needed
          day = day.padStart(2, '0');
          month = month.padStart(2, '0');
          return {
            date: `${year}-${month}-${day}`,
            year,
            title: `The New Yorker ${month}/${day}/${year}`,
            issueNumber: `${year}.${month}.${day}`
          };
        }
        return null;
    }
  },
   'Bloomberg_Businessweek': {
    id: 'bloomberg',
    name: "Bloomberg Businessweek",
    parse: (filename) => {
        // Format: Bloomberg Businessweek-01.2026.pdf (MM.YYYY)
        const match = filename.match(/Bloomberg Businessweek-(\d{2})\.(\d{4})/);
        if (match) {
            const [_, month, year] = match;
            const day = '01';
            return {
                date: `${year}-${month}-${day}`,
                year,
                title: `Bloomberg Businessweek ${month}/${year}`,
                issueNumber: `${year}.${month}`
            };
        }
        return null;
    }
  }
};

// Ensure temp dir exists
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

function uploadFile(localPath, remoteKey) {
  try {
    console.log(`Uploading ${localPath} -> ${remoteKey}...`);
    // Added --remote flag to upload to actual R2 bucket instead of local emulation
    execSync(`npx wrangler r2 object put ${BUCKET_NAME}/${remoteKey} --file="${localPath}" --remote`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to upload ${localPath}:`, e.message);
  }
}

async function main() {
  const folders = fs.readdirSync(SOURCE_DIR);

  for (const folder of folders) {
    if (!SOURCE_MAP[folder]) continue;
    const config = SOURCE_MAP[folder];

    const folderPath = path.join(SOURCE_DIR, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.pdf'));

    for (const file of files) {
      console.log(`Processing ${folder}/${file}...`);
      const meta = config.parse(file);

      if (!meta) {
        console.warn(`Skipping ${file} - could not parse filename`);
        continue;
      }

      // R2 Path: library/<sourceId>/<year>/<date>/
      const r2Prefix = `library/${config.id}/${meta.year}/${meta.date}`;

      // 1. Upload PDF
      uploadFile(path.join(folderPath, file), `${r2Prefix}/document.pdf`);

      // 2. Generate and Upload Meta
      const metaJson = {
        title: meta.title,
        issueNumber: meta.issueNumber,
        publishDate: meta.date,
        summary: "Pending AI analysis...",
        keyTakeaways: ["Content to be analyzed"],
        tags: [config.name]
      };

      const metaPath = path.join(TEMP_DIR, 'meta.json');
      fs.writeFileSync(metaPath, JSON.stringify(metaJson, null, 2));
      uploadFile(metaPath, `${r2Prefix}/meta.json`);

      // 3. Generate and Upload Cover
      const localPdfPath = path.join(folderPath, file);
      const localCoverPath = path.join(TEMP_DIR, 'cover.jpg');

      try {
        console.log(`Generating cover for ${file}...`);
        // Use sips to convert first page of PDF to JPG
        // -s format jpeg: Output format
        // -Z 800: Resize max dimension to 800px (good for thumbnails)
        // -s formatOptions 80: JPEG quality
        // --out: Output file
        execSync(`sips -s format jpeg -s formatOptions 80 -Z 800 "${localPdfPath}" --out "${localCoverPath}"`, { stdio: 'ignore' });

        if (fs.existsSync(localCoverPath)) {
          uploadFile(localCoverPath, `${r2Prefix}/cover.jpg`);
          // Clean up temp cover
          fs.unlinkSync(localCoverPath);
        } else {
          console.warn(`Warning: Cover generation failed for ${file}`);
        }
      } catch (e) {
        console.warn(`Error generating cover for ${file}: ${e.message}`);
      }
    }
  }
}

main();
