const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Create express app.
const app = express();

// Use body parser which we will use to parse request body that sending from client.
app.use(bodyParser.json());
app.use(cors());
// We will store our client files in ./client directory.
app.use(express.static(path.join(__dirname, "client")));

const publicVapidKey =
  "BCr2JJBJYivpM_QdUNd130Ox0XZVMmU4IJGoJIwcGAGgTALSW8N1qqJrrBll7CIwmSnqQ2BhKUicirigENn0ij0";

const privateVapidKey = "-6WoFfmL6MD0-DVX5SKgE6U7ENhP-d6Mpsu064eoPvE";

// Setup the public and private VAPID keys to web-push library.
webpush.setVapidDetails(
  "mailto:kiranpjr97@gmail.com",
  publicVapidKey,
  privateVapidKey
);

// Create route for allow client to subscribe to push notification.
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  console.log({ subscription });
  const payload = JSON.stringify({
    title: "Subscribed",
    body: " ZLITE notification subscription successful.",
  });
  if (subscription?.endpoint) {
    console.log("Subscribed successfully", { subscription });
    // test notification
    webpush.sendNotification(subscription, payload).catch(console.log);
    res.send("Subscribed successfully");
  } else res.status(500).json({ error: "No subscription end point" });
});

app.post("/push", (req, res) => {
  try {
    const { subscription, payload } = req?.body;
    if (subscription.endpoint) {
      webpush
        .sendNotification(subscription, JSON.stringify(payload))
        .catch(console.log);
      res.send("Notification sent successfuly");
    } else res.status(500).json({ error: "No subscription end point" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
