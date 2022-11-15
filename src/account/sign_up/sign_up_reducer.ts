import { minPasswordLength } from '../validators/constants';
import { validate_email } from '../validators/validate_email';
import { validate_username } from '../validators/validate_username';
import { SignUpFormTypes } from './sign_up';

export const handleSignUpForm = (
  state: SignUpFormTypes,
  action: { 
    type: string;
    value: string;
    innerType?: string }
): SignUpFormTypes => {
  switch (action.type) {
    case 'setUsername':
      // Show hidden errors when input is focused out.
      const [usernameError, displayUsernameError] = validate_username(action.value);

      return {
        ...state,
        username: {
          ...state.username,
          value: action.value,
          error: usernameError,
          existsInDatabase: null,
          showError: displayUsernameError
        },
        formError: ''
      };

    case 'focusOutUsername':
      // Show hidden errors when input is focused out.
      const [focusUsernameError] = validate_username(
        state.username.value);

      let focusOutUsernameError = '';
      if (focusUsernameError) {
        focusOutUsernameError = focusUsernameError;
      } else if (state.username.existsInDatabase) {
        focusOutUsernameError = `${state.username.value} is already taken`;
      }
      return {
        ...state,
        username: {
          ...state.username,
          value: state.username.value,
          error: focusOutUsernameError,
          existsInDatabase: state.username.existsInDatabase,
          showError: focusOutUsernameError ? true : false
        }
      };

    case 'setUsernameExists':
      let usernameExistsInDatabase = action.value === 'true';
      const [usernameErrorExists] = validate_username(state.username.value);
      if (usernameErrorExists) return state;
      
      return {
        ...state,
        username: {
          ...state.username,
          error: usernameExistsInDatabase ? `${state.username.value} is already taken` : '',
          showError: usernameExistsInDatabase,
          existsInDatabase: usernameExistsInDatabase
        }
      };

    case 'setEmail':
      const [emailError, displayEmailError] = validate_email(action.value);
      return {
        ...state,
        email: {
          ...state.email,
          value: action.value as string,
          error: emailError,
          showError: displayEmailError,
          existsInDatabase: null
        },
        formError: ''
      };

    case 'focusOutEmail':
      return {
        ...state,
        email: {
          ...state.email,
          value: state.email.value,
          error: action.value,
          showError: action.value ? true : false
        }
      };

    case 'setEmailExists':
      let emailExistsInDatabase = action.value === 'true';
      return {
        ...state,
        email: {
          ...state.email,
          error: emailExistsInDatabase ? 'Email is already in use' : '',
          showError: emailExistsInDatabase,
          existsInDatabase: emailExistsInDatabase
        }
      };

    case 'setPassword':
      let passwordError = '';

      if (action.value.length < minPasswordLength) {
        passwordError = `Enter at least ${minPasswordLength} characters`;
      }
      return {
        ...state,
        password: {
          ...state.password,
          value: action.value as string,
          error: passwordError,
          showError: false
        },
        formError: ''
      };

    case 'focusOutPassword':
      return {
        ...state,
        password: {
          ...state.password,
          showError: state.password.error ? true : false
        }
      };

    case 'setSessionCheck':
      return {
        ...state,
        sessionIsChecked: action.value === 'true'
      };

    case 'setSubmitting':
      return {
        ...state,
        submitting: action.value === 'true'
      };

    case 'setFormError':
      return {
        ...state,
        formError: action.value,
        submitting: false
      };

    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};
