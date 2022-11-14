import { ResetPasswordTypes } from './reset_password';

export const resetPasswordReducer = (
  state: ResetPasswordTypes,
  action: {
    type: string;
    value?: string;
    error?: string;
  }
): ResetPasswordTypes => {
  switch (action.type) {
    case 'resetExists':
      return {
        ...state,
        resetStringExists: action.value === 'true',
        formError: action.error ? action.error : ''
      };

    case 'newPassword':
      return {
        ...state,
        newPassword: action.value as string,
        newPasswordError: '',
        confirmPasswordError: (state.confirmPassword 
          && state.confirmPassword !== action.value)
          ? 'Passwords do not match'
          : ''
      };

    case 'newPasswordError':
      return {
        ...state,
        newPasswordError: action.value as string
      };

    case 'confirmPassword':
      return {
        ...state,
        confirmPassword: action.value as string,
        confirmPasswordError: ''
      };

    case 'confirmPasswordError':
      return {
        ...state,
        confirmPasswordError: action.value as string
      };

    case 'formError':
      return {
        ...state,
        formError: action.value as string,
        submitting: false
      };

    case 'submitting':
      return {
        ...state,
        submitting: action.value === 'true'
      };

    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};
