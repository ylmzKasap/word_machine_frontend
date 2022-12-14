import './styling/App.css';

import axios from 'axios';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ProfilePage } from './profile_components/profile_page/profile_page';
import { CardContainer } from './profile_components/profile_page/card_container';
import NotFound from './profile_components/common/components/not_found';
import { LayoutsWithNavbar } from './navbar/layout_with_navbar';
import { VerifyEmail } from './account/verification/verify_email';
import { UserSettings } from './account/settings/user_settings';
import { RevertEmailChage } from './account/verification/revert_email';
import { ResetPassword } from './account/password/reset_password/reset_password';
import { QuestionIntro } from './question_components/question_intro/question_intro';
import { Homepage } from './homepage/homepage';

axios.defaults.withCredentials = true;

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutsWithNavbar />}>
        <Route path="/" element={<Homepage />}/>
        <Route path="/login" element={<Homepage />}/>
        <Route path="/signup" element={<Homepage />}/>
        <Route path="user/:username" element={<ProfilePage dir="home" />}>
          <Route path=":dirId" element={<CardContainer />} />
        </Route>
        <Route path="verify/:verification_string" element={<VerifyEmail />} />
        <Route path="revert_email_change/:reversion_string" element={<RevertEmailChage />} />
        <Route path="settings" element={<UserSettings />} />
        <Route path="reset_password/:reset_string" element={<ResetPassword />} /> 
      </Route>
      <Route path="deck/:username/:itemId" element={<QuestionIntro type="deck" />} />
      <Route path="category/:username/:itemId" element={<QuestionIntro type="category" />} />
      <Route path="*" element={<LayoutsWithNavbar />} >
        <Route path="*" element={<NotFound />} />  
      </Route>
    </Routes>
  );
};

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
