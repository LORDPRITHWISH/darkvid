const SESSION_KEY = "session_key";

export function getSessionKey(): string {
  let key = sessionStorage.getItem(SESSION_KEY);

  if (!key) {
    key = crypto.randomUUID(); // secure, modern
    sessionStorage.setItem(SESSION_KEY, key);
  }

    return key;
//   return key ? " | got" : " | not got";
}
