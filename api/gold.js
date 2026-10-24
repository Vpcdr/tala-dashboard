export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const toToman = (rial) => {
    if (!rial || isNaN(rial)) return 0;
    // TGJU returns price in Rial (e.g. 261,485,000 Rial = 26,148,500 Toman)
    // If > 10 million, it's Rial -> divide by 10
    const n = Number(rial);
    return n > 10000000 ? Math.round(n / 10) : n;
  };

  try {
    const r = await fetch('https://call3.tgju.org/ajax.json', {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (!r.ok) throw new Error('TGJU HTTP ' + r.status);
    const raw = await r.json();
    const cur = raw.current || raw;

    // Find gold18 - keys can be geram18, gold_18, 18ayar
    let g18 = cur.geram18?.p || cur.gold_18?.p || cur['18ayar']?.p || 0;
    let sekkeh = cur.sekkeh?.p || cur.sekee?.p || cur.seke?.p || cur.sekeb?.p || 0;
    let sekkeh_bahar = cur.bahar?.p || cur.sekkeh_bahar?.p || 0;
    let ons = cur.ons?.p || cur.ons_gold?.p || 0;
    let dollar = cur.price_dollar_rl?.p || cur.dollar?.p || cur.price_dollar?.p || 0;
    let dollar_azad = cur.price_dollar_rl?.p || 0;

    // If sekkeh is 0, try to find any key containing 'sekk'
    if (!sekkeh || sekkeh == 0) {
      for (const k in cur) {
        if (k.toLowerCase().includes('sekk') && cur[k]?.p > 1000000) {
          sekkeh = cur[k].p;
          break;
        }
      }
    }

    const result = {
      status: 'live',
      source: 'TGJU via Vercel',
      fetched_at: new Date().toISOString(),
      prices: {
        geram18_toman: toToman(g18),
        geram18_rial: Number(g18),
        sekkeh_toman: toToman(sekkeh),
        sekkeh_rial: Number(sekkeh),
        sekkeh_bahar_toman: toToman(sekkeh_bahar),
        ons_dollar: Number(ons),
        dollar_azad_toman: toToman(dollar_azad),
        dollar_azad_rial: Number(dollar_azad)
      },
      raw_current: cur
    };

    // Also keep backward compat for old frontend
    result.data = { current: cur };

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(result);
  } catch(e) {
    console.error(e);
    res.status(500).json({ status: 'error', message: e.message, fallback: true });
  }
}
