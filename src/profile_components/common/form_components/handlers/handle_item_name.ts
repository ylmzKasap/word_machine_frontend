export function handleItemName(
  event: React.ChangeEvent,
  maxLength: number,
  filter: RegExp
) {
  // Used by CreateDeckOverlay and CreateFolderOverlay.

  const element = event.target as HTMLInputElement;

  const itemName = element.value;
  let itemNameError = '';

  if (filter.test(itemName)) {
    const forbiddenChar = itemName.match(filter)![0];
    itemNameError = `Forbidden character ' ${
      forbiddenChar === ' ' ? 'space' : forbiddenChar
    } '`;
  } else if (itemName.length > maxLength) {
    itemNameError = `Input too long: ${itemName.length} characters > ${maxLength}`;
  } else if (itemName.replace(/[\s]/g, '') === '' && itemName !== '') {
    itemNameError = 'Input cannot only contain spaces';
  }

  return [itemName, itemNameError] as const;
}
