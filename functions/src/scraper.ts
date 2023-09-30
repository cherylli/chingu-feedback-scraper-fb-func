// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require("puppeteer");

type Row = {
  [key: string]: string
}

const runScraper = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 20000,
    ignoreHTTPSErrors: true,
    slowMo: 0,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--window-size=1280,720",
    ],
  });
  const page = await browser.newPage();
  await page.goto("https://github.com/chingu-voyages/soloproject-evaluation/blob/main/README.md");

  const allTables = await page.evaluate(() => {
    const tables = document.querySelectorAll("table");
    const categories = Array.from(document.querySelectorAll("h3")).map(
      (c) => c.innerText
    );

    const content = [];

    for (const [tableIndex, table] of tables.entries()) {
      const tds = Array.from(table.querySelectorAll("td"));
      const ths = Array.from(table.querySelectorAll("th"));
      const data = tds.map((td) => td.innerText);
      const headers = ths.map((th) => th.innerText);

      const col = headers.length;
      const rows: Row[] = [];

      for (let i = 0; i < data.length; i = i + col) {
        const row: Row = {};
        for (let j = 0; j < col; j++) {
          row[headers[j]] = data[i + j];
        }
        rows.push(row);
      }
      content.push({
        name: categories[tableIndex],
        content: rows,
      });
    }
    return content;
  });
  await browser.close();
  return {categories: allTables};
};

/*
runScraper().then((res)=>{
  console.log(res);
});
*/
exports.runScraper = runScraper;

