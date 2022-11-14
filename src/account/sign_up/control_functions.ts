import axios from 'axios';
import { isProduction, serverUrl } from '../../constants';
import { SignUpFormTypes } from './sign_up';

export async function checkUsernameExists (
  signUpFormState: SignUpFormTypes): Promise<{data: {username_exists: boolean}} | false> {
  
  if (
    signUpFormState.username.error
    || !signUpFormState.username.value.trim()) return false;

  return await axios
    .get(`${isProduction ? serverUrl : ''}/username_exists/${signUpFormState.username.value}`);   
};

export async function checkEmailExists (
  signUpFormState: SignUpFormTypes): Promise<{data: {email_exists: boolean}} | false> {

  if (signUpFormState.email.existsInDatabase
    || !signUpFormState.email.value.trim()) return false;

  return await axios
    .post(`${isProduction ? serverUrl : ''}/email_exists`, {email: signUpFormState.email.value});
};
