import axios from 'axios';

let cached = null;

export async function checkApiFeatures() {
  if (cached) return cached;
  try {
    const res = await axios.get('/api/health', { timeout: 4000 });
    cached = {
      ok: true,
      features: res.data?.features || {},
      version: res.data?.version,
    };
  } catch {
    cached = { ok: false, features: {}, version: null };
  }
  return cached;
}

export function hasIeltsApi(features) {
  return Boolean(features?.ieltsProgress && features?.ieltsTests);
}

export function clearApiHealthCache() {
  cached = null;
}
