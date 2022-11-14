import axios from 'axios';
import { isProduction, serverUrl } from '../../../constants';
import {
  DraggedElementTypes,
  RequestErrorTypes,
} from '../../types/profilePageTypes';
import { ContextOpenedElemTypes } from '../handlers/create_context_menu';
import { extract_int } from '../utils';

export default function delete_item(
  itemObj: ContextOpenedElemTypes | DraggedElementTypes,
  setRender: React.DispatchWithoutAction,
  setRequestError: React.Dispatch<React.SetStateAction<RequestErrorTypes>>
) {
  // Type Guard
  if (!itemObj.type || !itemObj.id) {
    console.log('Delete failed');
    return;
  };

  // Used by './components/ItemContextMenu' and '../profile_page/CardContainer/BottomDragBar'.
  const message = ['folder', 'category'].includes(itemObj.type)
    ? `Delete '${itemObj.name}' and all of its content?`
    : `Delete '${itemObj.name}?'`;

  if (window.confirm(message)) {
    axios
      .delete(`${isProduction ? serverUrl : ''}/file`, {
        data: {
          item_id: extract_int(itemObj.id),
        },
      })
      .then(() => {
        setRender();
      })
      .catch((err) =>
        setRequestError({
          exists: true,
          description: err.response.data.errDesc,
        })
      );
  }
}
