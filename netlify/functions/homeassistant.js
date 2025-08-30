// netlify/functions/homeassistant.js
const HOP = new Set([
  'connection','keep-alive','proxy-authenticate','proxy-authorization',
  'te','trailer','transfer-encoding','upgrade','host','content-length','accept-encoding'
]);

exports.handler = async (event) => {
  const method = (event.httpMethod || 'GET').toUpperCase();
  const reqUrl = new URL(event.rawUrl);
  const region = (reqUrl.searchParams.get('region') || 'eu').toLowerCase();
  reqUrl.searchParams.delete('region');

  const splat = event.path.replace(/^.*\/homeassistant/, '');
  const upstream = new URL(`https://px1.tuya${region}.com/homeassistant${splat}`);
  reqUrl.searchParams.forEach((v, k) => upstream.searchParams.append(k, v));

  if (method === 'OPTIONS') {
    const origin = event.headers && (event.headers.origin || event.headers.Origin) || '';
    return {
      statusCode: 204,
      headers: origin ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': event.headers['access-control-request-headers'] || '*',
        'Access-Control-Allow-Methods': event.headers['access-control-request-method'] || '*',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin'
      } : {}
    };
  }

  const headers = {};
  for (const [k, v] of Object.entries(event.headers || {})) {
    if (!HOP.has(String(k).toLowerCase())) headers[k] = v;
  }

  const init = { method, headers };
  if (!['GET','HEAD'].includes(method)) {
    init.body = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64') : event.body;
  }

  const res = await fetch(upstream.toString(), init);
  const resHeaders = Object.fromEntries(
    [...res.headers].filter(([k]) => !HOP.has(k.toLowerCase()))
  );

  return {
    statusCode: res.status,
    headers: resHeaders,
    body: await res.text()
  };
};

