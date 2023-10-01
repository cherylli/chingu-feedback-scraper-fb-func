import {onRequest} from "firebase-functions/v2/https";
import {initializeApp} from "firebase/app";
import {runScraper} from "./scraper";
import {getStorage, ref, uploadString} from "firebase/storage";


const firebaseConfig = {
  storageBucket: process.env.STORAGEBUCKET,
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


exports.scrape = onRequest({
  memory: "512MiB",
  region: "australia-southeast1",
}, async (req, res) => {
  // 1. Scrape
  const feedback = await runScraper();

  // 2. update firebase store
  const jsonFile = JSON.stringify(feedback);
  const feedbackRef = ref(storage, "feedback.json");
  uploadString(feedbackRef, jsonFile).then((snapshot)=>{
    console.log(snapshot);
  });

  // 3. revalidate next.js app
  await fetch(`${process.env.BASE_URL}/api/revalidate?tag=feedback&secret=
  ${process.env.NEXT_REVALIDATION_SECRET}`, {
    method: "POST",
  });

  // 4. return scrape result
  res.send(feedback);
});

