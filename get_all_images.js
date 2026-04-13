const url = 'https://www.globalsuzuki.com/globalnews/2025/0731b.html';

async function run() {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      console.log(match[1]);
    }
  } catch(e) {}
}
run();
