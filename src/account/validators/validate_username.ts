import { 
  invalidUsernameRegex,
  maxUsernameLength,
  minUsernameLength,
  validUsernameRegex } from './constants';

export const validate_username = (username: string) => {
  // Returns and array of two values:
  // [0]: <Error description> : string
  // [1]: <Error display> : boolean
  if (!username) return ['', false] as const;

  if (!validUsernameRegex.test(username)) {
    let forbiddenCharacter = username.match(invalidUsernameRegex)![0];
    if (forbiddenCharacter === ' ') {
      forbiddenCharacter = 'space';
    }
    return [`Username cannot contain '${forbiddenCharacter}'`, true] as const;
  } else if (username.length < minUsernameLength) {
    return ['Username is too short', false] as const;
  } else if (username.length > maxUsernameLength) {
    return [`Username is too long: ${username.length} > ${maxUsernameLength}`, true] as const;
  } else {
    return ['', false] as const;
  }
};
