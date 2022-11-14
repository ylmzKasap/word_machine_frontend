import { useContext } from 'react';
import Cards from '../../../assets/svg/cards';
import { ItemContext, PageItemContextTypes } from '../page_item';

const ItemContainer = () => {
  const {
    parentProps,
    itemStyle,
    folderStyle,
    handleDoubleClick,
    handleClick,
    handleMouseDown,
    handleMouseUp,
    handleHover,
  } = useContext(ItemContext) as PageItemContextTypes;

  return (
    <div
      id={parentProps.id}
      className={parentProps.type}
      type="item"
      style={itemStyle}
      tabIndex={parentProps.order}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOver={handleHover}
      onMouseOut={handleHover}
    >
      {parentProps.type === 'folder' && 
        <i id="item-icon" className={`fas fa-folder fa-5x ${folderStyle}`}></i>
      }
      {parentProps.type === 'thematic-folder' && 
        <i id="item-icon" className={`fa-solid fa-layer-group fa-5x ${folderStyle}`}></i>
      }
      {parentProps.type === 'deck' && <Cards />}
      <p className={`${parentProps.type}-description`}>{parentProps.name}</p>
    </div>
  );
};

export default ItemContainer;
