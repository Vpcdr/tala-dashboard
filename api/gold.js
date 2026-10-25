export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const toToman = (rial) => {
    const n = Number(rial);
    return n > 10000000 ? Math.round(n / 10) : n;
  };

  const endpoints = [
    'https://call1.tgju.org/ajax.json',
    'https://call2.tgju.org/ajax.json',
    'https://call3.tgju.org/ajax.json',
  ];

  for (const url of endpoints) {
    try {
      const r = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store'
      });
      if (!r.ok) continue;
      const raw = await r.json();
      const cur = raw.current || raw;
      
      let g18 = cur.geram18?.p || 0;
      let sekkeh = cur.sekkeh?.p || cur.sekee?.p || 0;
      let ons = cur.ons?.p || 0;
      let dollar = cur.price_dollar_rl?.p || 0;

      // اگر سکه صفر بود، جستجو
      if (!sekkeh) {
        for (const k in cur) {
          if (k.includes('sekk') && cur[k]?.p > 1000000) {
            sekkeh = cur[k].p; break;
          }
        }
      }

      if (!g18) continue; // اگر طلا نداشت، endpoint بعدی

      return res.status(200).json({
        status: 'live',
        source: `TGJU via ${url}`,
        fetched_at: new Date().toISOString(),
        prices: {
          geram18_toman: toToman(g18),
          sekkeh_toman: toToman(sekkeh),
          ons_dollar: Number(ons),
          dollar_azad_toman: toToman(dollar),
        },
        raw_current: cur
      });
    } catch(e) {
      console.log(`Failed ${url}: ${e.message}`);
      continue;
    }
  }

  // اگر همه فیل شد، قیمت امروز
  return res.status(200).json({
    status: 'fallback',
    source: 'fallback',
    prices: {
      geram18_toman: 26148500,
      sekkeh_toman: 266700000,
      ons_dollar: 3996,
      dollar_azad_toman: 112500,
    }
  });
}
