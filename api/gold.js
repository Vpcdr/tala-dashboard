export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const r = await fetch('https://call3.tgju.org/ajax.json', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!r.ok) throw new Error('TGJU failed');
    const data = await r.json();
    res.status(200).json({ status: 'live', source: 'TGJU', data: data.current, fetched_at: new Date().toISOString() });
  } catch(e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
}
