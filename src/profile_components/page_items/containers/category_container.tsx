import { useContext } from 'react';
import { NavbarContext, NavbarContextTypes } from '../../../navbar/layout_with_navbar';
import { extract_int } from '../../common/utils';
import { ProfileContext } from '../../profile_page/profile_page';
import { ProfileContextTypes } from '../../types/profilePageTypes';
import { ItemContext, PageItemContextTypes } from '../page_item';

const CategoryContainer = () => {
  const { currentUserInfo } = useContext(NavbarContext) as NavbarContextTypes;
  const { directoryInfo, drag, setDeckOverlay } = useContext(
    ProfileContext
  ) as ProfileContextTypes;

  const {
    parentProps,
    itemStyle,
    handleMouseDown,
    handleMouseUp,
    handleHover,
  } = useContext(ItemContext) as PageItemContextTypes;

  const addItem = (event: React.MouseEvent) => {
    if (drag.isDragging) {
      return;
    }
    const element = event.target as HTMLElement;
    const closestElement = element.closest('.category');
    if (!closestElement) return;
    const categoryId = closestElement.id;

    setDeckOverlay({
      type: 'category',
      value: '',
      categoryInfo: {
        id: extract_int(categoryId),
        name: parentProps.name,
        sourceLanguage: parentProps.source_language,
        targetLanguage: parentProps.target_language,
        purpose: parentProps.purpose,
      },
    });
  };

  return (
    <div
      id={parentProps.id}
      className={parentProps.type}
      style={itemStyle}
      tabIndex={parentProps.order}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOver={handleHover}
      onMouseOut={handleHover}
    >
      <div className="category-header">
        <p className={`${parentProps.type}-navbar-description`}>{parentProps.name}</p>
        {currentUserInfo.username === directoryInfo.owner &&
         <i className="fas fa-plus-circle category-circle" onClick={addItem}></i>}
      </div>
      {parentProps.children}
    </div>
  );
};

export default CategoryContainer;
