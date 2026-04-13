const urls = ['https://www.globalsuzuki.com/globalnews/2025/0731b.html', 'https://motortrade.com.ph/motorcycles/suzuki-v-strom-1050-de/', 'https://www.blackxperience.com/blackauto/autonews/suzuki-gsx-8s-hadir-dalam-varian-spesial-bertema-balap-ini'];

async function run() {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const match = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i);
      if (match) {
        console.log(url + '\n=> ' + match[1] + '\n');
      } else {
        console.log(url + '\n=> No og:image found\n');
      }
    } catch(e) {
      console.log(url + '\n=> Error\n');
    }
  }
}
run();
