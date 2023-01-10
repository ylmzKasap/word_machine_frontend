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
      openedElem: { id: '', type: 'void', name: '' },
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
      id: '',
      type: 'container',
      name: '',
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
      contextMenuInfo.ops = userAtHome ? ['cut', 'paste', 'edit', 'delete'] : [];
    } else if (closestItem.className === 'deck') {
      contextMenuInfo.ops = userAtHome 
        ? ['copy', 'cut', 'edit', 'change words', 'delete']
        : ['clone'];
    } else {
      // Folder or thematic-folder
      if (userAtHome) {
        contextMenuInfo.ops = ['cut', 'rename', 'delete'];
      } else {
        // Someone elses directory
        contextMenuInfo.ops = closestItem.className === 'thematic-folder' ? ['clone'] :  [];
      }
    }
  }
  return contextMenuInfo;
}

export interface ContextOpenedElemTypes {
  id: string;
  type: string;
  name: string;
}

export const contextOpenedElemDefault = {
  id: '',
  type: '',
  name: '',
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
