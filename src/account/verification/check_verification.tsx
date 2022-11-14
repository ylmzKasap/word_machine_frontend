import LoadingIcon from '../../assets/animations/loading_icon';
import { ResponseWithIcon } from './response_with_icon';

export const CheckVerification: React.FC<CheckVerificationTypes> = (
  {status, header, validDescription, invalidDescription, waitingDescirption}) => {
  return (
    <div id="user-verify-container">
      <div id="user-verify-box">
        <header id="verify-header">{header}</header>
        <div id="verify-response">
          {status === true 
            ? <ResponseWithIcon
              description={validDescription ? validDescription : ''}
              icon={<i className="fa-solid fa-square-check" />} />           
            : status === false
              ? <ResponseWithIcon
                description={invalidDescription}
                icon={<i className="fa-solid fa-square-xmark" />} /> 
              : <ResponseWithIcon
                description={waitingDescirption ? waitingDescirption : ''}
                icon={<LoadingIcon elementClass="submitting"/>} />  
          }
        </div>
      </div>
    </div>
  );
};

interface CheckVerificationTypes {
  header: string;
  status: boolean | null;
  validDescription?: string;
  invalidDescription: string;
  waitingDescirption?: string;
}
