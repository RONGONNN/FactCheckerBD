# FactCheck

AI সহায়তায় বাংলা ও English দাবি (claim) যাচাইয়ের ওয়েব অ্যাপ। কোনো login বা admin panel নেই।

**বর্তমান অবস্থা:** সব ফিচার, rate limit ও cache তৈরি; deploy করা হয়নি। আসল OpenAI পরীক্ষা সীমিত (দুটি claim) এবং বড় মূল্যায়ন বাকি।

## কাঠামো

| Folder | কাজ |
| --- | --- |
| `backend/` | Node.js, Express, TypeScript API |
| `frontend/` | Next.js, React, TypeScript, Tailwind |

## প্রয়োজন

Node.js 22.9 বা নতুন (LTS version ব্যবহার করা ভালো) এবং npm।

## চালানোর নিয়ম

দুটি আলাদা terminal এ চালাতে হবে।

Backend (`http://localhost:4000`):

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend (`http://localhost:3000`):

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

`Copy-Item` শুধু প্রথমবার চালাবেন, না হলে আগের মান মুছে যাবে।

Health পরীক্ষা: `http://localhost:4000/api/health`

## যাচাই command

দুই folder এই:

```powershell
npm run lint
```

```powershell
npm run typecheck
```

```powershell
npm test
```

```powershell
npm run build
```

## গোপনীয়তা

OpenAI API key শুধু `backend/.env` file এ থাকবে। `.env` file Git এ যায় না।

Visitor দের মতামত `backend/data/feedback.jsonl` file এ জমা হয় (প্রতি লাইনে একটি)। এই file Git এ যায় না।

## আসল API পরীক্ষা

`backend/.env` এ key বসানোর পর `backend` folder এ চালান। এতে OpenAI এর খরচ হবে।

```powershell
npm run smoke
```

## অনুমোদিত উৎস

তালিকা `backend/src/config/sources.json` এ। দুটি উৎস নিশ্চিত না হওয়ায় বন্ধ (`active: false`):

- **FactCheckBD:** আসল domain যাচাই করা যায়নি; তালিকার domain টি অনুমান।
- **BBC News Bangla:** স্বয়ংক্রিয়ভাবে পেজ খুলে যাচাই করা যায়নি (`bbc.com/bengali`)।

সক্রিয় উৎসগুলোর শুধু মূল পেজ খুলে যাচাই করা হয়েছে; search এ কতটা পাওয়া যায় তা পরীক্ষা হয়নি।

## খরচ ও অপব্যবহার থেকে সুরক্ষা

Login নেই, তাই `backend/.env` এ সীমা রাখা আছে:

| Setting | Default | কাজ |
| --- | --- | --- |
| `RATE_LIMIT_PER_HOUR` | 10 | প্রতি IP তে ঘণ্টায় যাচাই |
| `DAILY_CHECK_LIMIT` | 100 | ২৪ ঘণ্টায় সবার মিলিত paid যাচাই |
| `FEEDBACK_LIMIT_PER_HOUR` | 20 | প্রতি IP তে ঘণ্টায় মতামত |
| `CACHE_TTL_SECONDS` | 3600 | একই দাবির ফলাফল পুনরায় ব্যবহার |

এই হিসাব server restart হলে শূন্য হয়, তাই OpenAI dashboard এ মাসিক budget অবশ্যই রাখুন।
