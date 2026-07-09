/// <reference types="node" />
import { createClient } from '@supabase/supabase-js';

console.log('--- OCR ROUTE LOADED ---');
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log('VITE_SUPABASE_URL exists:', !!process.env.VITE_SUPABASE_URL);
console.log('SUPABASE_PUBLISHABLE_KEY exists:', !!process.env.SUPABASE_PUBLISHABLE_KEY);
console.log('VITE_SUPABASE_PUBLISHABLE_KEY exists:', !!process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
console.log('GOOGLE_CLOUD_VISION_API_KEY exists:', !!process.env.GOOGLE_CLOUD_VISION_API_KEY);
console.log('------------------------');

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];

    const { imageBase64, mimeType, fileName } = req.body;

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: 'Missing imageBase64 or mimeType in request body' });
    }

    if (!mimeType.startsWith('image/')) {
      return res.status(400).json({ error: 'Invalid file type. Please upload an image.' });
    }

    // Rough size check: base64 size * 0.75 gives approximate byte size. 5MB = 5 * 1024 * 1024 = 5242880 bytes
    const approxSize = imageBase64.length * 0.75;
    if (approxSize > 5 * 1024 * 1024) {
      return res.status(413).json({ error: 'Image must be under 5 MB.' });
    }

    // Supabase backend setup (allows VITE_ prefix if user already set it in Vercel)
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const visionApiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('DEBUG - Available env keys:', Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('VITE_')));
      console.error('DEBUG - supabaseUrl:', supabaseUrl);
      console.error('DEBUG - supabaseKey:', supabaseKey ? 'PRESENT' : 'MISSING');
      console.error('Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in backend env.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    if (!visionApiKey) {
      console.error('Missing GOOGLE_CLOUD_VISION_API_KEY in backend env.');
      return res.status(500).json({ error: 'Cloud OCR is not configured yet.' });
    }

    // Initialize Supabase client acting as the authenticated user
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      auth: {
        persistSession: false
      }
    });

    // Compute a simple hash to prevent identical spam, or just use substring
    const imageHash = imageBase64.substring(0, 64) + imageBase64.length.toString();

    // Call the RPC to reserve OCR unit
    const { data: rpcData, error: rpcError } = await supabase.rpc('reserve_ocr_unit', {
      p_image_hash: imageHash
    });

    if (rpcError) {
      console.error('Supabase RPC Error:', rpcError);
      return res.status(500).json({ error: 'Failed to verify OCR limits.' });
    }

    if (!rpcData.allowed) {
      if (rpcData.reason === 'not_authenticated') {
        return res.status(401).json({ error: 'Sign in to use cloud OCR.' });
      } else if (rpcData.reason === 'daily_limit_reached') {
        return res.status(429).json({ error: 'You’ve reached today’s scan limit. Try again tomorrow.' });
      } else if (rpcData.reason === 'monthly_app_limit_reached') {
        return res.status(429).json({ error: 'Cloud scanning is temporarily unavailable. Try typing, dictating, or uploading a typed PDF.' });
      } else {
        return res.status(403).json({ error: 'OCR request not allowed.' });
      }
    }

    // Allowed to proceed with Google Vision
    // Base64 string from frontend might include data URI scheme (e.g., data:image/jpeg;base64,...), we need to strip it if present.
    let base64Data = imageBase64;
    if (base64Data.includes(',')) {
      base64Data = base64Data.split(',')[1];
    }

    const visionPayload = {
      requests: [
        {
          image: {
            content: base64Data
          },
          features: [
            {
              type: 'TEXT_DETECTION'
            }
          ]
        }
      ]
    };

    const visionResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(visionPayload)
    });

    if (!visionResponse.ok) {
      console.error('Google Vision API Error:', await visionResponse.text());
      return res.status(502).json({ error: 'Couldn’t read this image. Try a clearer photo or type your response.' });
    }

    const visionData = await visionResponse.json();
    const responses = visionData.responses || [];
    const firstResponse = responses[0] || {};
    
    if (firstResponse.error) {
      console.error('Google Vision Image Error:', firstResponse.error);
      return res.status(502).json({ error: 'Couldn’t read this image. Try a clearer photo or type your response.' });
    }

    const extractedText = firstResponse.fullTextAnnotation?.text || '';

    return res.status(200).json({
      extractedText: extractedText.trim(),
      remainingToday: rpcData.remaining_today,
      remainingMonth: rpcData.remaining_month
    });

  } catch (error: any) {
    console.error('OCR Endpoint Error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred during OCR.' });
  }
}
