import { useLayoutEffect, useState } from 'react';
import { DirInfoTypes } from '../../types/profilePageTypes';

export default function useWindowSize(
  dirInfo: DirInfoTypes,
  reload: boolean
) {
  const [columnNumber, setColumnNumber] = useState([0]);
  useLayoutEffect(() => {
    if (!dirInfo) return;
    const container =
      dirInfo.item_type === 'thematic_folder' ? '.category' : '.card-container';
    function updateSize() {
      setColumnNumber(get_column_number(container));
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [dirInfo, reload]);
  return columnNumber;
}

function get_column_number(containerName: string) {
  const container = document.querySelector(containerName);

  if (container) {
    var gridComputedStyle = window.getComputedStyle(container);
    var gridColumnCount = gridComputedStyle
      .getPropertyValue('grid-template-columns')
      .split(' ').length;
  } else {
    gridColumnCount = 0;
  }
  return [gridColumnCount];
}
