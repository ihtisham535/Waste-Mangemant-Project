# ⚡ QUICK START - 5 MINUTE SETUP

## 🚀 Get Your FWRS Backend Running in 5 Minutes

---

## STEP 1: Fix MongoDB Connection (2 minutes)

### Problem: Your Current .env is Wrong
```
❌ WRONG:  mongodb://atlas-sql-...
✅ RIGHT:  mongodb+srv://fwrs-admin:password@cluster0.xxx.mongodb.net/fwrsDB...
```

### Solution: Get Real URI from MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Login → **Databases** → **Connect**
3. Click **"Drivers"** → Select **"Node.js"**
4. Copy the connection string
5. Replace `<username>` with `fwrs-admin`
6. Replace `<password>` with your MongoDB password
7. Replace `<cluster>` with your actual cluster URL

### Update server/.env
```env
MONGO_URI=mongodb+srv://fwrs-admin:YOUR_PASSWORD@cluster0.abc123xyz.mongodb.net/fwrsDB?retryWrites=true&w=majority
PORT=5000
```

⚠️ **Important:** If password has special characters like `@` or `!`, URL-encode them:
- `@` → `%40`
- `!` → `%21`

Example: `Pass@123!` becomes `Pass%40123%21`

---

## STEP 2: Install Dependencies (1 minute)

```bash
cd FWRS-Project/server
npm install
```

Wait for completion (you'll see: `added X packages`)

---

## STEP 3: Start Backend Server (30 seconds)

```bash
npm start
```

### ✅ Success = See This:
```
========== FWRS BACKEND SERVER ==========
✓ Connected to MongoDB Atlas
✓ QR code generation endpoint ready: GET /generate-qr/:id
✓ Order CRUD routes ready: /orders
✓ Server running on http://localhost:5000
========================================
```

---

## STEP 4: Test It Works (1 minute)

### Test 1: Health Check
```bash
# In a NEW terminal:
curl http://localhost:5000/health
```
Expected: `{"status":"ok",...}`

### Test 2: Create Order
```bash
curl -X POST http://localhost:5000/orders \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Order","items":["Item1"],"total":25.99}'
```
Response will include an `_id` like: `507f1f77bcf86cd799439011`

### Test 3: Generate QR Code
```bash
# Replace with the _id you got above
curl http://localhost:5000/generate-qr/507f1f77bcf86cd799439011
```
Expected: `{"qr":"data:image/png;base64,...",...}`

---

## 🎉 DONE! You Have:

✅ MongoDB connection  
✅ Express server running  
✅ CRUD API working  
✅ QR code generation ready  

---

## NEXT: Use from React Frontend

### In Your React Component:

```jsx
import { useEffect, useState } from 'react';

function ShowQR({ orderId }) {
  const [qr, setQr] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/generate-qr/${orderId}`)
      .then(res => res.json())
      .then(data => setQr(data.qr));
  }, [orderId]);

  return qr ? <img src={qr} alt="QR" /> : <p>Loading...</p>;
}
```

---

## 🆘 TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| `Cannot connect to MongoDB` | Check MONGO_URI in .env - must use `mongodb+srv://` not `atlas-sql` |
| `Authentication failed` | Verify username/password match MongoDB user created in Atlas |
| `Port 5000 already in use` | Change PORT in .env or kill process: `netstat -ano \| findstr :5000` |
| `Connection timeout` | Go to Network Access → Allow 0.0.0.0/0 (allow all IPs) |
| `QR generation failed` | OrderId must be 24 hex chars: `507f1f77bcf86cd799439011` |

---

## 📁 FILE STRUCTURE

```
FWRS-Project/
├── client/               (React frontend - running on 3000)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── server/               (Express backend - running on 5000)
│   ├── server.js         ← Main file
│   ├── .env              ← Your MongoDB URI here
│   ├── package.json
│   ├── models/
│   │   └── Order.js
│   ├── routes/
│   │   └── orders.js
│   └── services/
│       └── qrService.js
│
├── BACKEND_MASTER_SETUP_GUIDE.md      (📖 Full guide)
├── COMPLETE_BACKEND_CODE.md           (💻 All code explained)
└── MONGODB_URI_FIX.md                 (🔧 Fix connection string)
```

---

## 🔗 API ENDPOINTS

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Check server is alive |
| POST | `/orders` | Create new order |
| GET | `/orders` | Get all orders |
| GET | `/orders/:id` | Get single order |
| PUT | `/orders/:id` | Update order |
| DELETE | `/orders/:id` | Delete order |
| GET | `/generate-qr/:id` | Generate QR code |

---

## ⏭️ WHAT'S NEXT?

1. **Production Database**: Upgrade from M0 (free) to M2+ tier
2. **Authentication**: Add JWT tokens for user login
3. **Input Validation**: Add Joi or Zod for data validation
4. **Error Logging**: Add Winston or Morgan for logging
5. **Deployment**: Deploy to Heroku, Render, or Railway
6. **Frontend Integration**: Connect React to all endpoints
7. **Environment Sync**: Use different .env for dev/prod

---

## 📚 USEFUL LINKS

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Express Docs: https://expressjs.com/
- Mongoose Docs: https://mongoosejs.com/
- QRCode NPM: https://www.npmjs.com/package/qrcode
- Your Complete Guide: Open `BACKEND_MASTER_SETUP_GUIDE.md`

---

## 💾 SAVING YOUR SETUP

```bash
# Save .env (but NEVER commit to Git!)
echo "MONGO_URI=..." > server/.env

# Add to .gitignore so it's not exposed
echo ".env" >> server/.gitignore

# Commit other files
git add -A
git commit -m "Add FWRS backend with MongoDB and QR codes"
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Fixed MONGO_URI in .env (not `atlas-sql`, uses `mongodb+srv://`)
- [ ] Ran `npm install` in server folder
- [ ] Ran `npm start` and saw "Connected to MongoDB Atlas"
- [ ] `curl /health` returned `{"status":"ok"}`
- [ ] Created test order with `POST /orders`
- [ ] Generated QR code with `GET /generate-qr/:id`
- [ ] React component can fetch and display QR

---

**🎯 Once this ✅ works, your backend is production-ready!**
