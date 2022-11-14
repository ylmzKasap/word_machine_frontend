import { useContext } from 'react';
import { ProfileContext } from '../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../types/profilePageTypes';
import Trash from '../../../../assets/font_awesome/Trash';

const LeftNumber: React.FC<{
  order: number;
  errorIndex: number;
}> = (props) => {
  // Rendered by "./image_info" -> ImageInfo
  const { setEditImageOverlay } = useContext(
    ProfileContext
  ) as ProfileContextTypes;

  const handleTrash = () => {
    setEditImageOverlay({ type: 'deleteRow', value: props.order });
  };

  return (
    <div
      id="left-number-box"
      className={props.errorIndex === props.order ? 'error' : undefined}
      style={{
        minWidth: `${
          props.order + 1 < 10 ? 50 : 38 + Math.log10(props.order + 1) * 12
        }px`,
      }}
    >
      <div id="left-number">{props.order + 1}</div>
      <Trash elementClass="left-number" clickHandler={handleTrash} />
    </div>
  );
};

export default LeftNumber;
