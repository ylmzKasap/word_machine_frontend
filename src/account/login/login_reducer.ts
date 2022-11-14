import { LoginTypes } from './login';

export const loginReducer = (
  state: LoginTypes,
  action: {
    type: string;
    value: string;
  }
): LoginTypes => {
  switch (action.type) {
    case 'username':
      return {
        ...state,
        username: action.value,
        formError: ''
      };

    case 'password':
      return {
        ...state,
        password: action.value,
        formError: ''
      };

    case 'submitting':
      return {
        ...state,
        submitting: action.value === 'true'
      };

    case 'sessionChecked':
      return {
        ...state,
        sessionChecked: action.value === 'true'
      };

    case 'formError':
      return {
        ...state,
        formError: action.value,
        submitting: false
      };

    case 'showForgottenPassword':
      return {
        ...state,
        showForgottenPassword: action.value === 'true'
      };

    case 'showForgottenUsername':
      return {
        ...state,
        showForgottenUsername: action.value === 'true'
      };

    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};
