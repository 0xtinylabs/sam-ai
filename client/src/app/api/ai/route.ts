// Eğer App Router (Next.js 13+ ile) kullanıyorsan

export async function POST(req: Request) {
  const body = await req.json();
  const { message, xmtp_id } = body;

  const backendRes = await fetch(process.env.NEXT_PUBLIC_API_URL + "/ai/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      xmtp_id: xmtp_id,
    }),
  });

  const backendJson = await backendRes.json();

  return new Response(JSON.stringify({ message: backendJson.message }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
