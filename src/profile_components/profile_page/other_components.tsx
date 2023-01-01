import {
  CloneStyleTypes,
  DraggedElementTypes,
} from '../types/profilePageTypes';
import Cards from '../../assets/svg/cards';
import LoadingIcon from '../../assets/animations/loading_icon';

export const RequestInfo: React.FC<RequestInfoTypes> = ({
  description,
  link,
  linkDescription,
  exitHandler,
  className,
  loading=false
}) => {

  return (
    <label className={'request-box'
      + (className ? ` ${className}` : '')
      + (description === ' ' ? ' empty' : '')}>
      <div className="request-text">
        {loading && <LoadingIcon elementClass="submitting" />}
        <h5>{description}{link && 
          <div className="request-link"><a href={link}> {linkDescription}</a></div>}</h5>
        <span></span>
      </div>
      <div className="request-exit-button" onClick={exitHandler}>
        <span className="fa-solid fa-xmark"></span>
      </div>
    </label>
  );
};

export const DragClone: React.FC<DragCloneTypes> = (props) => {
  // Component of ProfilePage.

  return (
    <div
      id="drag-item-clone"
      className={`dragged-${props.draggedElement.type}`}
      style={props.cloneStyle}
      onContextMenu={(e) => e.preventDefault()}
    >
      {props.draggedElement.type === 'deck' && <Cards />}
      {props.draggedElement.type === 'thematic-folder' && 
        <i id="item-icon" className={'fa-solid fa-layer-group fa-5x'}></i>}
      {props.draggedElement.type === 'folder' && 
        <i id="item-icon" className={'fas fa-folder fa-5x'}></i>}
      {props.draggedElement.type === 'category' && 
        <i id="item-icon" className={'fa-solid fa-book-open fa-2x fa-4x'}></i>}
      <div 
        className={`${props.draggedElement.type}-description`}
        style={{'order': props.draggedElement.type === 'category' ? '-1' : '1'}}>
        {props.itemName}
      </div>
    </div>
  );
};

interface DragCloneTypes {
  itemName: string;
  cloneStyle: CloneStyleTypes;
  draggedElement: DraggedElementTypes;
}

interface RequestInfoTypes {
  description: string;
  exitHandler: () => void;
  link?: string;
  linkDescription?: string;
  className?: string;
  loading?: boolean;
}
