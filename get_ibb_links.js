const https = require('https');

const urls = [
  "https://ibb.co.com/LD26d4F1",
  "https://ibb.co.com/VWQwTdDW",
  "https://ibb.co.com/7xtqb4kM",
  "https://ibb.co.com/7d0609N6",
  "https://ibb.co.com/gLq3D7X5",
  "https://ibb.co.com/GvvRh7GR",
  "https://ibb.co.com/1Y7GhMgb",
  "https://ibb.co.com/RTTRxqDP",
  "https://ibb.co.com/v6zQC8hB",
  "https://ibb.co.com/BH9wDTsZ",
  "https://ibb.co.com/3mC2wK1M"
];

async function fetchDirectLink(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Look for og:image or <img src="...ibb..." alt="..."
        const match = data.match(/<meta property="og:image" content="([^"]+)"/);
        const titleMatch = data.match(/<meta property="og:title" content="([^"]+)"/);
        if (match) {
          resolve({
            url: url,
            direct: match[1],
            title: titleMatch ? titleMatch[1] : 'Unknown'
          });
        } else {
          resolve({ url, direct: null, title: null });
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const url of urls) {
    const info = await fetchDirectLink(url);
    console.log(`URL: ${info.url}`);
    console.log(`Title: ${info.title}`);
    console.log(`Direct: ${info.direct}`);
    console.log('---');
  }
}

main();
