import { ChangeEmailTypes } from './change_email';

export const handleChangeEmailOverlay = (
  state: ChangeEmailTypes,
  action: { 
    type: string;
    value?: string;}
): ChangeEmailTypes => {
  switch (action.type) {
    case 'changePasswordForEmail':
      return {
        ...state,
        password: action.value as string
      };

    case 'changeNewEmail':
      return {
        ...state,
        newEmail: action.value as string
      };

    case 'submitNewEmail':
      return {
        ...state,
        submitting: action.value === 'true',
        formError: ''
      };

    case 'newEmailFormError':
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

