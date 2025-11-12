import express from "express";
import admin from "firebase-admin";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

// ✅ Build Firebase credentials from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

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
    const { tokens, title, body } = req.body; // ✅ Expect list of tokens

    if (!tokens || tokens.length === 0) {
      return res.status(400).json({ error: "No tokens provided" });
    }

    const message = {
      notification: { title, body },
      tokens, // ✅ Send to multiple
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("✅ Notifications sent:", response.successCount, "successes");
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.listen(5050, () => console.log("🚀 Server running on port 5050"));
