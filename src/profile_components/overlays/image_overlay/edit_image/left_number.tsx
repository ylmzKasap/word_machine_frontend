import { useContext } from 'react';
import { ProfileContext } from '../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../types/profilePageTypes';
import Trash from '../../../../assets/font_awesome/Trash';
import axios from 'axios';
import { isProduction, serverUrl } from '../../../../constants';
import { RowTypes } from './edit_image_overlay';

const LeftNumber: React.FC<{
  order: number;
  wordInfo: RowTypes[];
  errorIndex: number;
}> = (props) => {
  // Rendered by "./image_info" -> ImageInfo
  const { setEditImageOverlay, setRequestError } = useContext(
    ProfileContext
  ) as ProfileContextTypes;

  const handleTrash = () => {
    const wordId = props.wordInfo[props.order].imageRow[0].word_id;

    if (!wordId) {
      // word_id is only present while editing.
      // It will not make an http request while creating a new deck.
      setEditImageOverlay({ type: 'deleteRow', value: props.order });
      return;
    };
    axios.delete(`${isProduction ? serverUrl : ''}/word`, {
      data: {
        word_id: wordId
      }
    }).then(
      () => setEditImageOverlay({ type: 'deleteRow', value: props.order })
    ).catch((err) => setRequestError({
      exists: true,
      description: err.response.data.errDesc,
    }));
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
