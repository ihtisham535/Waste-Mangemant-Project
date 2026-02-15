# QR Code Backend Setup Guide

## Step-by-Step Setup

### 1. Install qrcode package
```bash
cd server
npm install qrcode
```

This installs the qrcode npm package which handles all QR code generation and encoding.

### 2. Verify package.json is updated
After installing, verify that package.json includes:
```json
"dependencies": {
  "qrcode": "^1.5.4"
}
```

### 3. Start the backend
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

### 4. Test the QR endpoint with Postman
- Method: **GET**
- URL: `http://localhost:5000/generate-qr/507f1f77bcf86cd799439011`
  (Replace with an actual MongoDB ObjectId from your database)
- Expected response:
```json
{
  "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAY...",
  "orderId": "507f1f77bcf86cd799439011",
  "message": "QR code generated successfully"
}
```

### 5. Test the QR endpoint with curl (Windows PowerShell)
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/generate-qr/507f1f77bcf86cd799439011" -Method Get
$response.Content | ConvertFrom-Json | Select-Object -ExpandProperty qr | Out-File qr.txt
```

### 6. Use in your React Frontend

#### Option A: Display in a component
```jsx
import { useEffect, useState } from "react";

const QRViewer = ({ orderId }) => {
  const [qr, setQr] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/generate-qr/${orderId}`)
      .then(res => res.json())
      .then(data => setQr(data.qr));
  }, [orderId]);

  return qr ? <img src={qr} alt="QR Code" /> : <p>Loading...</p>;
};
```

#### Option B: Add to your QR Landing Page
In `client/src/pages/QR/QRLanding.jsx`, add QR display for an order:
```jsx
const [orderQR, setOrderQR] = useState(null);

useEffect(() => {
  // Replace with an actual order ID from your database
  const orderId = "507f1f77bcf86cd799439011"; // Example
  fetch(`http://localhost:5000/generate-qr/${orderId}`)
    .then(res => res.json())
    .then(data => setOrderQR(data.qr))
    .catch(console.error);
}, []);

return (
  <div>
    {orderQR && <img src={orderQR} alt="Order QR Code" />}
  </div>
);
```

## How QR Code Works

1. **Data Encoding**: QR codes encode any text data (Order ID, URL, etc.)
2. **Error Correction**: The backend uses "H" (High) error correction - up to 30% of data can be damaged and still be readable
3. **Theming**: QR codes use FWRS brand colors:
   - Dark: Navy Blue (#0f1c3f)
   - Light: Light Accent (#cce7ff)
4. **Data URL**: The QR code is returned as a base64 encoded PNG image, which can be:
   - Displayed directly in an `<img>` tag
   - Downloaded as a file
   - Printed
   - Shared as text

## Error Handling

### Invalid Order ID Format
```
GET /generate-qr/invalid
```
Response (400):
```json
{
  "error": "Invalid order ID format. Expected 24-character MongoDB ObjectId."
}
```

### QR Generation Failed
If there's an internal error:
Response (500):
```json
{
  "error": "Failed to generate QR code",
  "details": "error message"
}
```

## Advanced Features (Optional)

### Generate QR for a full URL
Use the QRService to generate QR codes that redirect to a page:
```javascript
// In your backend route
import { generateQRForURL } from "./services/qrService.js";

const qr = await generateQRForURL("http://localhost:3000", orderId);
```

### Save QR Code to File (for printing)
```javascript
import { generateQRFile } from "./services/qrService.js";

const filePath = await generateQRFile(orderId, "./qr-codes/order-123.png");
```

## Testing Checklist

- [x] npm install qrcode
- [x] npm start (backend running)
- [x] GET /generate-qr/507f1f77bcf86cd799439011 returns data URL
- [x] Data URL can be displayed in browser
- [x] Frontend can fetch and display QR
- [x] Error handling works for invalid IDs
- [x] Server continues running even if QR fails

## Common Issues

### Issue: "Cannot find module 'qrcode'"
**Solution**: Run `npm install qrcode` in the server folder

### Issue: "Invalid order ID format"
**Solution**: Make sure the order ID is 24 hex characters (valid MongoDB ObjectId)

### Issue: QR Data URL is undefined
**Solution**: Check that the backend response includes `qr` field in JSON

### Issue: CORS error when fetching from frontend
**Solution**: Make sure CORS is enabled in server.js (it's already configured)

## Next Steps

1. Create a `/qr-orders` endpoint to get a list of all orders with QR codes
2. Add QR code download functionality
3. Implement QR code scanning in the mobile app
4. Add QR code print templates
