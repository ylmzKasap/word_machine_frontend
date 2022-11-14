import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isProduction, serverUrl } from '../../constants';
import { CheckVerification } from './check_verification';

export const VerifyEmail: React.FC = () => {
  const { verification_string } = useParams();
  const [verified, setVerified] = useState<null | boolean>(null);

  useEffect(() => {
    axios.get(`${isProduction ? serverUrl : ''}/verify/${verification_string}`)
      .then(() => setVerified(true))
      .catch(() => setVerified(false));
  }, []);

  return (
    <CheckVerification
      status={verified}
      header="Verify your account"
      validDescription="Your account has been successfully verified"
      invalidDescription="Verification url is invalid or expired"
      waitingDescirption="Verifying..."
    />
  );
};


