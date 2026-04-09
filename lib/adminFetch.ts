const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY!

export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': ADMIN_KEY,
      ...options.headers,
    },
  })
}