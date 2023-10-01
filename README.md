## Chingu Solo Project Feedback Scraper

This firebase function scrapes feedback from [soloproject-evaluation](https://github.com/chingu-voyages/soloproject-evaluation) using Puppeteer.

For Puppeteer to work with firebase functions, 
1. Make sure enough memory is allocated (512Mb in this case)
2. Use Puppeteer `16.2.0`. Version 18 might work according to some reports. However, the latest version (21), does not work.
3. `.puppeteerrc.cjs` to configure cache
4. `"gcp-build": "node node_modules/puppeteer/install.js"` to add a custom build step

The function does 4 things
1. Scrapes the Github repo for feedback
2. Stores the json file in firebase store
3. Revalidates feedback tags in the next.js Evaluation app
   https://chingu-soloproject-evaluation-app.vercel.app/
   https://github.com/cherylli/chingu-soloproject-evaluation-app
4. Returns the scrape results (in JSON)
