import axios from 'axios';
import { useContext, useState } from 'react';
import { isProduction, serverUrl } from '../../../constants';
import { CurrentUserTypes } from '../../../navbar/layout_with_navbar';
import { UserSettingsContext, UserSettingsContextTypes } from '../user_settings';

export const EmailSettings: React.FC<{
  currentUserInfo: CurrentUserTypes;}> = ({currentUserInfo}) => {

    const { setUserSettings } = useContext(UserSettingsContext) as UserSettingsContextTypes;
    const [resendRequest, setResendRequest] = useState(false);

    const handleResendEmail = () => {
      if (resendRequest) return;

      setResendRequest(true);
      axios.post(`${isProduction ? serverUrl : ''}/resend_verification_url`, {
        email: currentUserInfo.email
      })
        .then(() => setResendRequest(false))
        .catch(err => {
          setResendRequest(false);
          setUserSettings({type: 'requestError', value: err.response.data.errDesc});
        });
    };

    return (
      <>
        <div className="setting-info-item">
          <span className="setting-info-item-description">{currentUserInfo.email}</span>
          <span className="extra-setting-content">
            {currentUserInfo.verified
              ? <></>
              : <><button
                id="regular-button"
                className={`setting-info-button mini${resendRequest ? ' no-submit' : ''}`}
                type="button"
                onClick={handleResendEmail}>
                Resend link
              </button>
              </>}
            {currentUserInfo.verified
              ? <div>
                <i className="fa-solid fa-circle-check" />verified
              </div>
              : <div>
                <i className="fa-solid fa-circle-xmark" />not verified
              </div>}
          </span>
        </div>
        <button 
          className="setting-info-button"
          type="button"
          onClick={() => setUserSettings({type: 'viewEmail', value: 'true'})}>
          Change email
        </button>
      </>
    );
  };
