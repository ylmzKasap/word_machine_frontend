import React, { useContext, useState } from 'react';
import axios from 'axios';

import { ProfileContext } from '../profile_page/profile_page';
import OverlayNavbar from './common/components/overlay_navbar';
import InputField from '../common/form_components/input_field';
import SubmitForm from '../common/form_components/submit_form';
import { ProfileContextTypes } from '../types/profilePageTypes';
import { handleItemName } from '../common/form_components/handlers/handle_item_name';
import { itemNameFilter } from '../common/regex';
import DoubleChoice from '../common/form_components/double_choice';
import { isProduction, serverUrl } from '../../constants';


export const CreateFolderOverlay: React.FC = () => {
  // Component of ProfileNavbar.

  const [submitRequest, setSubmitRequest] = useState(false);
  const { directory, setReRender, folderOverlay, setFolderOverlay } =
    useContext(ProfileContext) as ProfileContextTypes;

  const handleNameChange = (event: React.ChangeEvent) => {
    const [itemName, itemNameError] = handleItemName(event, 40, itemNameFilter);
    setFolderOverlay({ type: 'folderName', value: itemName });
    setFolderOverlay({
      type: 'errors',
      innerType: 'name',
      value: itemNameError,
    });
  };

  const handleFolderType = (selectedType: string) => {
    setFolderOverlay({ type: 'folderType', value: selectedType });
  };

  const handleOverlayExitByFocus = (event: React.MouseEvent) => {
    const element = event.target as HTMLDivElement;
    if (element.className === 'input-overlay') {
      setFolderOverlay(({type: 'view', value: 'hide'}));
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    if (event.type === 'keydown') {
      const keyboardEvent = event as React.KeyboardEvent;
      if (keyboardEvent.key !== 'Enter') {
        return;
      }
    }

    event.preventDefault();

    if (folderOverlay.folderName === '') {
      setFolderOverlay({
        type: 'errors',
        innerType: 'form',
        value: 'Enter a folder name',
      });
    } else if (folderOverlay.errors.nameError) {
      setFolderOverlay({
        type: 'errors',
        innerType: 'form',
        value: 'Fix the problem above',
      });
    } else {
      setSubmitRequest(true);
      let serverFolderType = folderOverlay.folderType.toLowerCase().replace(' ', '_');
      axios
        .post(`${isProduction ? serverUrl : ''}/folder`, {
          folder_name: folderOverlay.folderName,
          folder_type:
            serverFolderType === 'regular_folder'
              ? 'folder'
              : serverFolderType,
          parent_id: `${directory}`,
        })
        .then(() => {
          setFolderOverlay({ type: 'clear', value: '' });
          setSubmitRequest(false);
          setReRender();
        })
        .catch((err) => {
          setSubmitRequest(false);
          setFolderOverlay({
            type: 'errors',
            innerType: 'form',
            value: err.response.data.errDesc,
          });
        });
    }
  };

  return (
    <div className="input-overlay" onClick={handleOverlayExitByFocus}>
      <form
        className="create-item-info"
        onSubmit={handleSubmit}
        onKeyDown={handleSubmit}
      >
        <OverlayNavbar
          setOverlay={setFolderOverlay}
          description="Create a new folder"
        />
        <div className="form-content">
          {/* Folder name */}
          <InputField
            description="Folder Name:"
            error={folderOverlay.errors.nameError}
            value={folderOverlay.folderName}
            handler={handleNameChange}
            placeholder="Enter a folder name"
          />
          <DoubleChoice
            description="Folder Type:"
            choice_one="Regular folder"
            choice_two="Thematic folder"
            chosen={folderOverlay.folderType}
            handler={handleFolderType}
          />
          {/* Submit & Error */}
          <SubmitForm
            description="Create Folder"
            formError={folderOverlay.errors.formError}
            submitting={submitRequest}
          />
        </div>
      </form>
    </div>
  );
};
