import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imagePresets } from './image-presets.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inquiriesPath = path.join(__dirname, 'inquiries.json');
const generatedAssetsPath = path.join(__dirname, '..', 'assets', 'generated');

if (!fs.existsSync(inquiriesPath)) {
  fs.writeFileSync(inquiriesPath, '[]', 'utf-8');
}

if (!fs.existsSync(generatedAssetsPath)) {
  fs.mkdirSync(generatedAssetsPath, { recursive: true });
}

const cars = [
  {
    id: 'aventador-sv',
    name: 'Aventador SV',
    category: 'Super Sport',
    pricePerDay: 899,
    accent: 'cyan',
    performance: { acceleration: '2.8s', horsepower: '740 HP', topSpeed: '350 km/h' }
  },
  {
    id: 'urus-performante',
    name: 'Urus Performante',
    category: 'Performance SUV',
    pricePerDay: 540,
    accent: 'magenta',
    performance: { acceleration: '3.3s', horsepower: '657 HP', topSpeed: '306 km/h' }
  },
  {
    id: 's-class-maybach',
    name: 'S-Class Maybach',
    category: 'Luxury Sedan',
    pricePerDay: 399,
    accent: 'cyan',
    performance: { acceleration: '4.5s', horsepower: '496 HP', topSpeed: '250 km/h' }
  }
];

const faq = [
  {
    id: 'insurance',
    question: 'Insurance',
    answer:
      'All rentals include comprehensive collision damage waiver and third-party liability insurance.'
  },
  {
    id: 'deposit',
    question: 'Security Deposit',
    answer: 'Held on credit card at pickup. Amount varies by car class from $1,500 to $5,000.'
  },
  {
    id: 'cancellation',
    question: 'Cancellation',
    answer: 'Free up to 48 hours before booking. Late cancellations incur a 20% processing fee.'
  }
];

const recentBookings = [
  {
    id: 'booking-1',
    vehicle: 'Lamborghini Huracan',
    status: 'Completed',
    duration: 'Jun 18 — Jun 19, 2023',
    total: '$1,900.00'
  },
  {
    id: 'booking-2',
    vehicle: 'McLaren 720S',
    status: 'Priority Member',
    duration: 'Oct 24 — Oct 27, 2024',
    total: '$3,058.26'
  }
];

function isValidInquiry(body) {
  const requiredFields = [
    'fullName',
    'email',
    'phone',
    'pickupLocation',
    'pickupDate',
    'returnDate',
    'carId',
    'planId'
  ];

  return requiredFields.every((field) => typeof body[field] === 'string' && body[field].trim().length > 0);
}

function saveInquiry(payload) {
  const inquiries = JSON.parse(fs.readFileSync(inquiriesPath, 'utf-8'));
  inquiries.push({
    id: Date.now(),
    ...payload,
    createdAt: new Date().toISOString()
  });
  fs.writeFileSync(inquiriesPath, JSON.stringify(inquiries, null, 2), 'utf-8');
}

async function generateImage({ prompt, size = '1536x1024', quality = 'medium', filename, model }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY.');
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || process.env.OPENAI_IMAGE_MODEL || 'chatgpt-image-latest',
      prompt,
      size,
      quality,
      n: 1
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error?.message || 'Image generation failed.');
  }

  const imageBase64 = result?.data?.[0]?.b64_json;

  if (!imageBase64) {
    throw new Error('Image generation returned no image payload.');
  }

  const imageBuffer = Buffer.from(imageBase64, 'base64');
  const safeFilename = filename.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
  const outputPath = path.join(generatedAssetsPath, `${safeFilename}.png`);

  fs.writeFileSync(outputPath, imageBuffer);

  return {
    filename: `${safeFilename}.png`,
    outputPath,
    relativePath: path.join('assets', 'generated', `${safeFilename}.png`)
  };
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/generated-assets', express.static(generatedAssetsPath));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/fleet', (_request, response) => {
  response.json(cars);
});

app.get('/api/faq', (_request, response) => {
  response.json(faq);
});

app.get('/api/recent-bookings', (_request, response) => {
  response.json(recentBookings);
});

app.get('/api/images/presets', (_request, response) => {
  response.json(imagePresets);
});

app.post('/api/inquiries', (request, response) => {
  if (!isValidInquiry(request.body)) {
    response.status(400).json({ message: 'Missing required booking inquiry fields.' });
    return;
  }

  saveInquiry(request.body);

  response.status(201).json({
    message: 'Inquiry saved successfully.',
    bookingReference: `NFC-${Date.now().toString().slice(-6)}`
  });
});

app.post('/api/images/generate', async (request, response) => {
  const { prompt, filename, size, quality, model } = request.body ?? {};

  if (typeof prompt !== 'string' || prompt.trim().length === 0 || typeof filename !== 'string' || filename.trim().length === 0) {
    response.status(400).json({ message: 'Both prompt and filename are required.' });
    return;
  }

  try {
    const result = await generateImage({
      prompt: prompt.trim(),
      filename: filename.trim(),
      size: typeof size === 'string' ? size : undefined,
      quality: typeof quality === 'string' ? quality : undefined,
      model: typeof model === 'string' ? model : undefined
    });

    response.status(201).json({
      message: 'Image generated successfully.',
      ...result
    });
  } catch (error) {
    response.status(500).json({
      message: error instanceof Error ? error.message : 'Unable to generate image.'
    });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`CarsForHire backend listening on http://localhost:${port}`);
});
