import express from "express";
import admin from "firebase-admin";
import bodyParser from "body-parser";
import cors from "cors";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./firebase-service-account.json");

// ✅ Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Send FCM Notification
app.post("/sendNotification", async (req, res) => {
  try {
    const { token, title, body } = req.body;

    const message = {
      token,
      notification: { title, body },
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent:", response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(5050, () => console.log("🚀 Server running on port 5050"));
