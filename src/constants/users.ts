export const USERNAME_RULES = {
  regex: /^[a-z0-9_]{3,20}$/,
  minLength: 3,
  maxLength: 20,
} as const
