export function create_context_menu(
  event: React.MouseEvent,
  closestItem: HTMLElement | null,
  username: string | undefined,
  directoryUsername: string | undefined
): ContextMenuInfoTypes {
  const element = event.target as HTMLInputElement;

  // Completely unrelated div.
  if (!closestItem) {
    return {
      closest: element,
      openedElem: { id: undefined, type: 'void', name: undefined },
      ops: ['no actions'],
    };
  }

  let contextMenuInfo: ContextMenuInfoTypes = contextMenuInfoDefault;
  contextMenuInfo.closest = closestItem;
  const userAtHome = username === directoryUsername;

  // Containers
  if (
    ['card-container', 'category-container'].includes(closestItem.className)
  ) {
    contextMenuInfo.openedElem = {
      id: undefined,
      type: 'container',
      name: undefined,
    };
    contextMenuInfo.ops = userAtHome ? ['paste'] : [];
  } else {
    // Page item like deck, folder, thematic-folder, category.
    const categoryHeader = closestItem.querySelector(
      '.category-header'
    ) as HTMLElement;
    contextMenuInfo.openedElem = {
      id: closestItem.id,
      type: closestItem.className,
      name:
        closestItem.className === 'category'
          ? categoryHeader.innerText
          : closestItem.innerText,
    };

    if (closestItem.className === 'category') {
      contextMenuInfo.ops = userAtHome ? ['cut', 'paste', 'delete'] : [];
    } else if (closestItem.className === 'deck') {
      contextMenuInfo.ops = userAtHome ? ['copy', 'cut', 'delete'] : [];
    } else {
      contextMenuInfo.ops = userAtHome ? ['cut', 'delete'] : [];
    }
  }
  return contextMenuInfo;
}

export interface ContextOpenedElemTypes {
  id: string | undefined;
  type: string | undefined;
  name: string | undefined;
}

export const contextOpenedElemDefault = {
  id: undefined,
  type: undefined,
  name: undefined,
};

export interface ContextMenuInfoTypes {
  closest: HTMLElement | null;
  openedElem: ContextOpenedElemTypes;
  ops: string[];
}

export const contextMenuInfoDefault = {
  closest: null,
  openedElem: contextOpenedElemDefault,
  ops: [''],
};
