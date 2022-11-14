import { to_title } from '../utils';

export default function seperate_language_region (text: string) {
  // Takes a language string as an argument and returns it in a more readable form.
  // english_us > English (US)

  const splitText = to_title(text).split('_');

  if (splitText[1]) {
    return `${splitText[0]} (${splitText[1].toUpperCase()})`;
  } else {
    return splitText[0];
  }
}
