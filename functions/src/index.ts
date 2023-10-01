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
  const feedback = await runScraper();

  const jsonFile = JSON.stringify(feedback);
  const feedbackRef = ref(storage, "feedback.json");
  uploadString(feedbackRef, jsonFile).then((snapshot)=>{
    console.log(snapshot);
  });
  res.send(feedback);
});

