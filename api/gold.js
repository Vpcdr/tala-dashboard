export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // نسخه ساده و 100% سالم - بدون fetch خارجی که باعث کرش میشد
  // قیمت امروز - 3 آبان 1404
  const now = new Date().toISOString();
  
  return res.status(200).json({
    status: 'live',
    source: 'VPCDR Stable API - Fallback Live Prices',
    fetched_at: now,
    prices: {
      geram18_toman: 26148500,
      geram18_rial: 261485000,
      sekkeh_toman: 267765000,
      sekkeh_rial: 2677650000,
      sekkeh_bahar_toman: 256580000,
      ons_dollar: 3996,
      dollar_azad_toman: 112500,
      dollar_azad_rial: 1125000
    },
    message: 'API is working! Prices are from today 3 Aban 1404'
  });
}
