const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const { MongoClient } = require('mongodb');

// Replace the following URL with the connection string for your MongoDB instance
const mongoDbUrl = 'mongodb://localhost:27017';

const dbName = 'myPwaApp';
const collectionName = 'subscriptions';

let db;

MongoClient.connect(mongoDbUrl, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
  db = client.db(dbName);
});


// Replace with your actual Vapid keys generated in step 1
const vapidPublicKey = 'BAEBefq5YaEGCK90GgE3jafiuyN-mULrrgyK_JonFPci0p4MjDiZWJzjpT384lLCaYFyJd-kUKRG-DeLjhFj2Q4';
const vapidPrivateKey = 'c4TYxjsOm3HMNgqDzb0Ss3hS6M3V15TKHPfio9YneVA';

webPush.setVapidDetails(
  'mailto:junho@sudormrf.run',
  vapidPublicKey,
  vapidPrivateKey
);

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  res.status(201).json({});

  const payload = JSON.stringify({
    title: 'My PWA App',
    body: 'This is a push notification from My PWA App!',
    url: 'https://example.com/'
  });

  webPush.sendNotification(subscription, payload)
    .catch(error => {
      console.error('Failed to send push notification:', error);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

