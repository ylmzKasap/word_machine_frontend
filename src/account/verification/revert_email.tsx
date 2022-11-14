import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckVerification } from './check_verification';

export const RevertEmailChage: React.FC = () => {
  const { reversion_string } = useParams();
  const [verified, setVerified] = useState<null | boolean>(null);

  useEffect(() => {
    axios.get(`/revert_email_change/${reversion_string}`)
      .then(() => setVerified(true))
      .catch(() => setVerified(false));
  }, []);

  return (
    <CheckVerification
      status={verified}
      header="Revert email change"
      validDescription="Email address is successfully reverted"
      invalidDescription="Verification url is invalid or expired"
      waitingDescirption="Reverting..."
    />
  );
};


