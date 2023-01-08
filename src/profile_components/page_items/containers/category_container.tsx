import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavbarContext, NavbarContextTypes } from '../../../navbar/layout_with_navbar';
import { extract_int } from '../../common/utils';
import { ProfileContext } from '../../profile_page/profile_page';
import { ProfileContextTypes } from '../../types/profilePageTypes';
import { ItemContext, PageItemContextTypes } from '../page_item';

const CategoryContainer = () => {
  const navigate = useNavigate();

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

  const currentContainer = document.querySelector(
    `.${directoryInfo.item_type === 'thematic_folder' ? 'category' : 'card'}-container`);

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
        <i className="fa-solid fa-dumbbell" title="Study all" onClick={() => 
          navigate(`/category/${directoryInfo.owner}/${extract_int(parentProps.id)}`,
            {state: {scrollTop: currentContainer?.scrollTop}})} />
        {currentUserInfo.username === directoryInfo.owner &&
         <i className="fas fa-plus-circle category-circle" title="Add deck" onClick={addItem}></i>}
      </div>
      {parentProps.children}
    </div>
  );
};

export default CategoryContainer;
