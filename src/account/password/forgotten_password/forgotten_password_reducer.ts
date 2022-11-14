import { ForgottenPasswordTypes } from './forgotten_password';

export const forgottenPasswordReducer = (
  state: ForgottenPasswordTypes,
  action: {
    type: string,
    value?: string
  }
): ForgottenPasswordTypes => {
  switch (action.type) {
    case 'email':
      return {
        ...state,
        email: action.value as string,
        emailError: '',
        formError: '',
        resetEmailSent: false,
        verificationEmailSent: false,
        showResendButton: false,
        
      };

    case 'emailError':
      return {
        ...state,
        emailError: action.value as string
      };

    case 'username':
      return {
        ...state,
        username: action.value as string,
        usernameError: '',
        formError: '',
        resetEmailSent: false,
        verificationEmailSent: false,
        showResendButton: false
      };

    case 'usernameError':
      return {
        ...state,
        usernameError: action.value as string
      };

    case 'formError':
      return {
        ...state,
        formError: action.value as string,
        submitting: false,
        submittingResend: false
      };

    case 'submitting':
      return {
        ...state,
        submitting: action.value === 'true'
      };

    case 'submittingResend':
      return {
        ...state,
        submittingResend: action.value === 'true'
      };

    case 'emailNotVerified':
      return {
        ...state,
        submitting: false,
        showResendButton: true,
        formError: 'Your email is not verified'
      };

    case 'resendEmailSuccess':
      return {
        ...state,
        verificationEmailSent: true,
        showResendButton: false,
        submittingResend: false,
        formError: ''
      };

    case 'resetEmailSuccess':
      return {
        ...state,
        submitting: false,
        formError: '',
        showResendButton: false,
        verificationEmailSent: false,
        resetEmailSent: true
      };


    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};
