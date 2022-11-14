import { ChangePasswordTypes } from './change_password';

export const handleChangePasswordOverlay = (
  state: ChangePasswordTypes,
  action: { 
    type: string;
    value?: string;}
): ChangePasswordTypes => {
  switch (action.type) {
    case 'changeCurrentPassword':
      return {
        ...state,
        password: action.value as string
      };

    case 'changeNewPassword':
      return {
        ...state,
        newPassword: action.value as string,
        newPasswordError: '',
        confirmNewPasswordError: (state.confirmNewPassword 
          && state.confirmNewPassword !== action.value)
          ? 'Passwords do not match'
          : ''
      };

    case 'newPasswordError':
      return {
        ...state,
        newPasswordError: action.value as string
      };

    case 'changeConfirmNewPassword':
      return {
        ...state,
        confirmNewPassword: action.value as string,
        confirmNewPasswordError: ''
      };

    case 'confirmPasswordError':
      return {
        ...state,
        confirmNewPasswordError: action.value as string
      };

    case 'submitNewPassword':
      return {
        ...state,
        submitting: action.value === 'true'
      };

    case 'newPasswordFormError':
      return {
        ...state,
        submitting: false,
        formError: action.value as string
      };    
    
    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};

