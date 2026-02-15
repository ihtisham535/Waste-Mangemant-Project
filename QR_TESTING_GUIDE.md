# FWRS Backend - QR Code Testing Guide

## Quick Start

### 1. Install dependencies
```bash
cd server
npm install
npm install qrcode
```

### 2. Start the server
```bash
npm start
```

You should see:
```
✓ Connected to MongoDB Atlas
✓ QR code generation endpoint ready: GET /generate-qr/:id
✓ Order CRUD routes ready: /orders
✓ Server running on http://localhost:5000
```

---

## Testing QR Code Endpoint

### Method 1: Using Postman (GUI)

1. Open Postman
2. Create a new **GET** request
3. URL: `http://localhost:5000/generate-qr/507f1f77bcf86cd799439011`
4. Click **Send**
5. You should receive:
```json
{
  "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "orderId": "507f1f77bcf86cd799439011",
  "message": "QR code generated successfully"
}
```

### Method 2: Using cURL (Command Line)

**Windows PowerShell:**
```powershell
$response = Invoke-WebRequest `
  -Uri "http://localhost:5000/generate-qr/507f1f77bcf86cd799439011" `
  -Method Get
$response.Content | ConvertFrom-Json | ForEach-Object { $_.qr }
```

**macOS/Linux:**
```bash
curl http://localhost:5000/generate-qr/507f1f77bcf86cd799439011
```

### Method 3: Using JavaScript/Fetch

```javascript
// In browser console or Node.js
fetch('http://localhost:5000/generate-qr/507f1f77bcf86cd799439011')
  .then(res => res.json())
  .then(data => {
    console.log('QR Code Data URL:', data.qr);
    // Display or download the QR code
  });
```

### Method 4: Using Fetch in React

```jsx
import { useEffect, useState } from 'react';

function TestQRCode() {
  const [qr, setQr] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/generate-qr/507f1f77bcf86cd799439011')
      .then(res => res.json())
      .then(data => setQr(data.qr));
  }, []);

  return qr ? <img src={qr} alt="QR" /> : <p>Loading...</p>;
}
```

---

## Testing Valid vs Invalid Order IDs

### Test 1: Valid MongoDB ObjectId (24 hex characters)
```
GET /generate-qr/507f1f77bcf86cd799439011
```
✓ Should return QR code Data URL

### Test 2: Too short ID
```
GET /generate-qr/123
```
⚠ Should return 400:
```json
{
  "error": "Invalid order ID format. Expected 24-character MongoDB ObjectId."
}
```

### Test 3: Invalid characters
```
GET /generate-qr/507f1f77bcf86cd799439xyz
```
⚠ Should return 400:
```json
{
  "error": "Invalid order ID format. Expected 24-character MongoDB ObjectId."
}
```

---

## Sample Valid MongoDB ObjectIds for Testing

These are real 24-character MongoDB ObjectIds you can use for testing:

```
507f1f77bcf86cd799439011
507f1f77bcf86cd799439012
507f1f77bcf86cd799439013
507f1f77bcf86cd799439014
507f1f77bcf86cd799439015
```

Generate your own:
- Option 1: Use MongoDB Compass and copy an ID from your database
- Option 2: Use an online ObjectId generator: https://www.epochconverter.com/
- Option 3: In Node.js: `require('mongoose').Types.ObjectId()`

---

## Display QR Code from Response

### In HTML
```html
<img id="qr-image" src="" alt="QR Code" />

<script>
  fetch('http://localhost:5000/generate-qr/507f1f77bcf86cd799439011')
    .then(res => res.json())
    .then(data => {
      document.getElementById('qr-image').src = data.qr;
    });
</script>
```

### In React
```jsx
const [qr, setQr] = useState(null);

useEffect(() => {
  const orderId = "507f1f77bcf86cd799439011";
  fetch(`http://localhost:5000/generate-qr/${orderId}`)
    .then(r => r.json())
    .then(d => setQr(d.qr))
    .catch(console.error);
}, []);

return <img src={qr} alt="QR Code" style={{ maxWidth: '300px' }} />;
```

---

## Download/Save QR Code

### Download in Frontend
```javascript
function downloadQR(qrDataUrl, orderId) {
  const link = document.createElement('a');
  link.href = qrDataUrl;
  link.download = `order-${orderId}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Usage
fetch('http://localhost:5000/generate-qr/507f1f77bcf86cd799439011')
  .then(r => r.json())
  .then(d => downloadQR(d.qr, d.orderId));
```

---

## Error Scenarios

### Scenario 1: Malformed URL
```
GET /generate-qr/
```
Result: `Cannot GET /generate-qr/`

### Scenario 2: QR generation actually fails (rare)
```
GET /generate-qr/507f1f77bcf86cd799439011
```
Result (500):
```json
{
  "error": "Failed to generate QR code",
  "details": "specific error message"
}
```

### Fix: Ensure server is running and MongoDB is connected

---

## End-to-End Testing Checklist

Use this checklist to verify everything works:

- [ ] Backend starts without errors: `npm start`
- [ ] Health check works: `GET /health` → `{ "status": "ok" }`
- [ ] QR endpoint works: `GET /generate-qr/507f1f77bcf86cd799439011` → returns `qr` field
- [ ] QR data URL is valid: Can open the base64 image in browser
- [ ] Invalid ID returns 400: `GET /generate-qr/invalid`
- [ ] Frontend can fetch QR: React component successfully gets QR data
- [ ] QR can be displayed: `<img src={qr}>` shows the image
- [ ] QR can be downloaded: Click download, file saves
- [ ] Multiple QR generations work: No memory leaks or errors
- [ ] Server stays running: No crashes after QR errors

---

## Troubleshooting

### Q: "Cannot find module 'qrcode'"
**A:** Run `npm install qrcode` in server folder

### Q: QR endpoint returns 500, not 400
**A:** Check MongoDB connection. QR generation itself failed due to internal error.

### Q: QR Data URL is extremely long
**A:** That's correct! Base64 encoded PNG images are large. It's still valid.

### Q: Can't display QR image
**A:** Check if the data URL is complete. It should start with `data:image/png;base64,`

### Q: CORS error when calling from frontend
**A:** CORS is already enabled in server.js. Make sure you're calling the correct port (5000)

---

## Next: Integrate with Frontend

1. Open `client/src/pages/QR/QRDisplay.jsx` (already created)
2. Replace the mock data with real order IDs from your DB
3. Test the QR display in your React app
4. Add download/copy buttons

**Happy QR Testing!** 🎉
