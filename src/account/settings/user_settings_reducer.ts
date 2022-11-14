import { 
  UserSettingsTypes } from './user_settings';

export const handleUserSettings = (
  state: UserSettingsTypes,
  action: { 
    type: string;
    value?: string;}
): UserSettingsTypes => {
  switch (action.type) {
    case 'viewEmail':
      return {
        ...state,
        showChangeEmailOverlay: action.value === 'true'
      };

    case 'viewNewPassword':
      return {
        ...state,
        showChangePasswordOverlay: action.value === 'true'
      };

    case 'requestError':
      return {
        ...state,
        requestError: action.value as string
      };
      
    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};
