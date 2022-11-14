import { validEmailRegex } from './constants';

export const validate_email = (email: string) => {
  // Returns and array of two values:
  // [0]: <Error description> : string
  // [1]: <Error display> : boolean
  if (!email) return ['', false] as const;

  if (email.length > 120) {
    return ['Invalid email', true] as const;
  } else if (!validEmailRegex.test(email)) {
    return ['Invalid email', false] as const;
  } else {
    return ['', false] as const;
  }
};
