const HOP = new Set([
  'connection','keep-alive','proxy-authenticate','proxy-authorization',
  'te','trailer','transfer-encoding','upgrade','host','content-length','accept-encoding'
]);

export default {
  async fetch(request: Request): Promise<Response> {
    const reqUrl = new URL(request.url);
    const after = reqUrl.pathname.replace(/^\/api\/homeassistant/, '') || '';
    const region = (reqUrl.searchParams.get('region') || 'eu').toLowerCase();
    reqUrl.searchParams.delete('region');

    const upstream = new URL(`https://px1.tuya${region}.com/homeassistant${after}`);
    reqUrl.searchParams.forEach((v, k) => upstream.searchParams.append(k, v));

    const method = request.method.toUpperCase();
    if (method === 'OPTIONS') {
      const origin = request.headers.get('origin') || '';
      const resp = new Response(null, { status: 204 });
      if (origin) {
        resp.headers.set('Access-Control-Allow-Origin', origin);
        resp.headers.set('Access-Control-Allow-Headers', request.headers.get('access-control-request-headers') || '*');
        resp.headers.set('Access-Control-Allow-Methods', request.headers.get('access-control-request-method') || '*');
        resp.headers.set('Access-Control-Max-Age', '86400');
        resp.headers.set('Vary', 'Origin');
      }
      return resp;
    }

    const headers = new Headers();
    request.headers.forEach((v, k) => { if (!HOP.has(k.toLowerCase())) headers.set(k, v); });

    const init: RequestInit = { method, headers };
    if (!['GET','HEAD'].includes(method)) init.body = request.body;

    const upstreamResp = await fetch(upstream.toString(), init);
    const respHeaders = new Headers(upstreamResp.headers);

    return new Response(upstreamResp.body, { status: upstreamResp.status, headers: respHeaders });
  }
}

