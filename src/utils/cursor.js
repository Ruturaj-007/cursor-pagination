export function encodeCursor(createdAt, id) {
  const payload = JSON.stringify({
     createdAt, id
  });
  return Buffer.from(payload).toString('base64url');
}

export function decodeCursor(cursor) {
  try {
    const payload = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    if (!payload.createdAt || !payload.id) return null;
    return payload;
  } catch {
    return null;
  }
}