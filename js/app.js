document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }

  const btn = document.getElementById('btn');
  btn.addEventListener('click', () => {
    alert('Button clicked!');
  });
});

// Add this code snippet to the existing js/app.js file
function subscribeUserToPush(registration, publicKey) {
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  };

  return registration.pushManager.subscribe(subscribeOptions)
    .then(pushSubscription => {
      console.log('Received PushSubscription:', JSON.stringify(pushSubscription));
      return pushSubscription;
    });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Replace 'YOUR_PUBLIC_VAPID_KEY' with your actual public Vapid key
const publicKey = 'BAEBefq5YaEGCK90GgE3jafiuyN-mULrrgyK_JonFPci0p4MjDiZWJzjpT384lLCaYFyJd-kUKRG-DeLjhFj2Q4';

// Update the service worker registration code
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);

      // Add this line to subscribe the user to push notifications
      subscribeUserToPush(registration, publicKey);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}

// Rest of the code...

// Add this code snippet to the existing js/app.js file
function sendSubscriptionToServer(subscription) {
  return fetch('/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  });
}

// Update the 'subscribeUserToPush' function
function subscribeUserToPush(registration, publicKey) {
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  };

  return registration.pushManager.subscribe(subscribeOptions)
    .then(pushSubscription => {
      console.log('Received PushSubscription:', JSON.stringify(pushSubscription));
      return sendSubscriptionToServer(pushSubscription); // Add this line
    });
}

function requestNotificationPermission() {
  return Notification.requestPermission()
    .then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.error('Notification permission denied.');
      }
      return permission;
    });
}

// Update the service worker registration code
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);

      // Call the 'requestNotificationPermission()' function
      requestNotificationPermission()
        .then(permission => {
          if (permission === 'granted') {
            // Subscribe the user to push notifications if permission is granted
            subscribeUserToPush(registration, publicKey);
          }
        });
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}

