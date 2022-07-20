export function getToken(): string {
  return JSON.parse(localStorage.getItem(`bb_typewrite_token`) as string);
}
