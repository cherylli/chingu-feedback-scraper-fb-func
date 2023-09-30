/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// eslint-disable-next-line @typescript-eslint/no-var-requires
const functions = require("firebase-functions");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const scrapeGithub = require("./scraper");
import {Request, Response} from "express";

exports.scrape = functions
  .runWith({
    timeoutSeconds: 120,
    memory: "512MB" || "2GB",
  }).region("australia-southeast1")
  .https.onRequest( async (req:Request, res:Response) => {
    const feedback = await scrapeGithub();
    console.log(feedback);
    res.send(feedback);
  });
