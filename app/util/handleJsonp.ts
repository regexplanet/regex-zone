export function handleJsonp(request: Request, data: NonNullable<unknown>) {
    
  const jsonStr = JSON.stringify(data);

  const u = new URL(request.url);
  const callback = u.searchParams.get("callback");
  if (callback && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(callback)) {
    return new Response(`${callback}(${jsonStr});`, {
      headers: {
        "Content-Type": "text/javascript; charset=utf-8",
      },
    });
  } else {
    return new Response(jsonStr, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET",
        "Access-Control-Max-Age": "604800",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }
}
