import puppeteer from "puppeteer";

type Row = {
  [key: string]: string
}

export const runScraper = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
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


