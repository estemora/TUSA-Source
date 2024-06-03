import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthProvider'; 
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './ProtectedRoute'
import Login from './Login';
import Signup from './Signup';
import Signup2 from './Signup2';
import ForgotPassword from './ForgotPassword';
import Home from './Student/Home/home';
import Profile from './Student/Profile/Profile';
import DeclareMajor from './Student/Declare/DeclareMajor';
import DeclareAdvisor from './Student/Declare/DeclareAdvisor';
import Catalog from './Student/Catalog/Catalog';
import MyCalendar from './Student/Calendar/Calendar';
import FAQ from './Student/FAQs/FAQs';
import Notifications from './Student/Notifications/Notifications';
import Notes from './Student/Notes/Notes';
import ReceivedNotes from './Student/Notes/ReceivedNotes';
import PreviousCourses from './Student/PreviousCourses/PreviousCourses';
import AutoScheduler from './Student/AutoScheduler/AutoScheduler';
import Preferences from './Student/Preferences/Preferences';
import Progress from './Student/Progress/Progress';
import Voting from './Student/Voting/Voting';
import About from './Student/About/About';

import ProfHome from './Professor/Home/home';
import ProfCalendar from './Professor/Calendar/Calendar';
import ProfCatalog from './Professor/Catalog/Catalog';
import ProfYourNotes from './Professor/Notes/Notes';
import ProfAddCourses from './Professor/Courses/AddCourses';
import ProfNotifs from './Professor/Notifications/Notifications';
import ProfProfile from './Professor/Profile/Profile';
import ProfAllCourses from './Professor/Courses/AllCourses';
import ProfCreatePoll from './Professor/Surveys/CreateAPoll';
import ProfManagePolls from './Professor/Surveys/ManagePolls';
import ProfStudentSuggestions from './Professor/Surveys/StudentSuggestions';
import ProfStudentNotes from './Professor/Notes/ReceivedNotes';
import ProfFAQs from './Professor/FAQs/FAQs';
import ProfAddMyCourses from './Professor/Courses/AddMyCourses';
import ProfAbout from './Professor/About/About';

import AdvHome from './Advisor/Home/home';
import AdvCatalog from './Advisor/Catalog/Catalog';
import AdvCalendar from './Advisor/Calendar/Calendar';
import AdvYourNotes from './Advisor/Notes/Notes';
import AdvStudNotes from './Advisor/Notes/ReceivedNotes';
import AdvProfile from './Advisor/Profile/Profile';
import AdvAdvisees from './Advisor/ManageAdvisees/ManageAdvisees';
import AdvFAQs from './Advisor/FAQs/FAQs';
import AdvNotifs from './Advisor/Notifications/Notifications';
import AdvAbout from './Advisor/About/About';

import TestStudHome from './TestStudent/Home/home';
import TestStudAutoScheduler from './TestStudent/AutoScheduler/AutoScheduler';
import TestStudCalendar from './TestStudent/Calendar/Calendar';
import TestStudCatalog from './TestStudent/Catalog/Catalog';
import TestStudDeclare from './TestStudent/Declare/Declare';
import TestStudFAQs from './TestStudent/FAQs/FAQs';
import TestStudNotes from './TestStudent/Notes/Notes';
import TestStudRecNotes from './TestStudent/Notes/ReceivedNotes';
import TestStudNotifs from './TestStudent/Notifications/Notifications';
import TestStudPrefs from './TestStudent/Preferences/Preferences';
import TestStudPrevCourses from './TestStudent/PreviousCourses/PreviousCourses';
import TestStudProfile from './TestStudent/Profile/Profile';
import TestStudProgress from './TestStudent/Progress/Progress';
import TestStudAbout from './TestStudent/About/About';

import AdminHome from './Admin/Home/home';
import AdminCatalog from './Admin/Catalog/Catalog';
import AdminCalendar from './Admin/Calendar/Calendar';
import AdminYourNotes from './Admin/Notes/Notes';
import AdminReceivedNotes from './Admin/Notes/ReceivedNotes';
import AdminDeleteAccount from './Admin/ManageAccounts/DeleteAccounts';
import AdminCreateAccount from './Admin/ManageAccounts/CreateAccounts';
import AdminUploadCatalog from './Admin/MassUploads/CatalogUpload';
import AdminDeleteACourse from './Admin/MassUploads/DeleteACourse';
import AdminFAQs from './Admin/FAQs/FAQs';
import AdminNotifs from './Admin/Notifications/Notifications';
import AdminAbout from './Admin/About/About';

import RegistrarHome from './Registrar/Home/home';
import RegistrarCatalog from './Registrar/Catalog/Catalog';
import RegistrarCalendar from './Registrar/Calendar/Calendar';
import RegistrarNotifications from './Registrar/Notifications/Notifications';
import RegistrarNotes from './Registrar/Notes/Notes';
import RegistrarRecNotes from './Registrar/Notes/ReceivedNotes';
import RegistrarAllNotes from './Registrar/Notes/AllNotes';
import RegistrarSuggestions from './Registrar/Voting/StudentSuggestions';
import RegistrarPolls from './Registrar/Voting/AllPolls';
import RegistrarAddCourse from './Registrar/Courses/AddCourses';
import RegistrarDeleteCourse from './Registrar/Courses/DeleteCourse';
import RegistrarUploadCatalog from './Registrar/Courses/CatalogUpload';
import RegistrarFAQs from './Registrar/FAQs/FAQs';
import RegistrarAbout from './Registrar/About/About';

function App() {

  const [token, setToken] = useState(null); 

  const handleSetToken = (newToken) => {
    setToken(newToken);
  };

  return (
    <AuthProvider token={token}> 
    <BrowserRouter basename={'/TUSA/js-login/front/build'}>
      <Routes>
        <Route path='/' element={<Login setToken={handleSetToken} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signup2' element={<Signup2 />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />  
        <Route path='/student-home' element={<ProtectedRoute/>}> <Route path='/student-home' element={<Home/>} /> </Route>
        <Route path='/student-profile' element={<ProtectedRoute/>}> <Route path='/student-profile' element={<Profile/>} /> </Route>
        <Route path='/student-declare-major' element={<ProtectedRoute/>}> <Route path='/student-declare-major' element={<DeclareMajor/>} /> </Route> 
        <Route path='/student-declare-advisor' element={<ProtectedRoute/>}> <Route path='/student-declare-advisor' element={<DeclareAdvisor/>} /> </Route> 
        <Route path='/student-catalog' element={<ProtectedRoute/>}> <Route path='/student-catalog' element={<Catalog/>} /> </Route>
        <Route path='/student-calendar' element={<ProtectedRoute/>}> <Route path='/student-calendar' element={<MyCalendar/>} /> </Route>
        <Route path='/student-faqs' element={<ProtectedRoute/>}> <Route path='/student-faqs' element={<FAQ/>} /> </Route>
        <Route path='/student-notifications' element={<ProtectedRoute/>}> <Route path='/student-notifications' element={<Notifications/>} /> </Route>
        <Route path='/student-notes' element={<ProtectedRoute/>}> <Route path='/student-notes' element={<Notes/>} /> </Route>
        <Route path='/student-received-notes' element={<ProtectedRoute/>}> <Route path='/student-received-notes' element={<ReceivedNotes/>} /> </Route>
        <Route path='/student-previouscourses' element={<ProtectedRoute/>}> <Route path='/student-previouscourses' element={<PreviousCourses/>} /> </Route>
        <Route path='/student-autoscheduler' element={<ProtectedRoute/>}> <Route path='/student-autoscheduler' element={<AutoScheduler/>} /> </Route>
        <Route path='/student-preferences' element={<ProtectedRoute/>}> <Route path='/student-preferences' element={<Preferences/>} /> </Route>
        <Route path='/student-progress' element={<ProtectedRoute/>}> <Route path='/student-progress' element={<Progress/>} /> </Route>
	  <Route path='/student-voting' element={<ProtectedRoute/>}> <Route path='/student-voting' element={<Voting/>} /> </Route>
	  <Route path='/student-about' element={<ProtectedRoute/>}> <Route path='/student-about' element={<About/>} /> </Route>
	  
	<Route path='/professor-home' element={<ProtectedRoute/>}> <Route path='/professor-home' element={<ProfHome/>} /> </Route>
	<Route path='/professor-calendar' element={<ProtectedRoute/>}> <Route path='/professor-calendar' element={<ProfCalendar/>} /> </Route>
	<Route path='/professor-catalog' element={<ProtectedRoute/>}> <Route path='/professor-catalog' element={<ProfCatalog/>} /> </Route>
	<Route path='/professor-my-notes' element={<ProtectedRoute/>}> <Route path='/professor-my-notes' element={<ProfYourNotes/>} /> </Route>
	<Route path='/professor-add-courses' element={<ProtectedRoute/>}> <Route path='/professor-add-courses' element={<ProfAddCourses/>} /> </Route>
	<Route path='/professor-notifications' element={<ProtectedRoute/>}> <Route path='/professor-notifications' element={<ProfNotifs/>} /> </Route>
	<Route path='/professor-profile' element={<ProtectedRoute/>}> <Route path='/professor-profile' element={<ProfProfile/>} /> </Route>
	<Route path='/professor-my-courses' element={<ProtectedRoute/>}> <Route path='/professor-my-courses' element={<ProfAllCourses/>} /> </Route>
        <Route path='/professor-create-poll' element={<ProtectedRoute/>}> <Route path='/professor-create-poll' element={<ProfCreatePoll/>} /> </Route>
        <Route path='/professor-manage-polls' element={<ProtectedRoute/>}> <Route path='/professor-manage-polls' element={<ProfManagePolls/>} /> </Route>
	<Route path='/professor-student-suggestions' element={<ProtectedRoute/>}> <Route path='/professor-student-suggestions' element={<ProfStudentSuggestions/>} /> </Route>
	<Route path='/professor-recived-notes' element={<ProtectedRoute/>}> <Route path='/professor-recived-notes' element={<ProfStudentNotes/>} /> </Route>
	<Route path='/professor-faqs' element={<ProtectedRoute/>}> <Route path='/professor-faqs' element={<ProfFAQs/>} /> </Route>
	  <Route path='/professor-add-my-courses' element={<ProtectedRoute/>}> <Route path='/professor-add-my-courses' element={<ProfAddMyCourses/>} /> </Route>
	  <Route path='/professor-about' element={<ProtectedRoute/>}> <Route path='/professor-about' element={<ProfAbout/>} /> </Route>
	  
	<Route path='/advisor-home' element={<ProtectedRoute/>}> <Route path='/advisor-home' element={<AdvHome/>} /> </Route>
        <Route path='/advisor-catalog' element={<ProtectedRoute/>}> <Route path='/advisor-catalog' element={<AdvCatalog/>} /> </Route>
        <Route path='/advisor-calendar' element={<ProtectedRoute/>}> <Route path='/advisor-calendar' element={<AdvCalendar/>} /> </Route>
	<Route path='/advisor-my-notes' element={<ProtectedRoute/>}> <Route path='/advisor-my-notes' element={<AdvYourNotes/>} /> </Route>
	<Route path='/advisor-recieved-notes' element={<ProtectedRoute/>}> <Route path='/advisor-recieved-notes' element={<AdvStudNotes/>} /> </Route>
	<Route path='/advisor-profile' element={<ProtectedRoute/>}> <Route path='/advisor-profile' element={<AdvProfile/>} /> </Route>
        <Route path='/advisor-manage-advisees' element={<ProtectedRoute/>}> <Route path='/advisor-manage-advisees' element={<AdvAdvisees/>} /> </Route>
        <Route path='/advisor-faqs' element={<ProtectedRoute/>}> <Route path='/advisor-faqs' element={<AdvFAQs/>} /> </Route>
          <Route path='/advisor-notifications' element={<ProtectedRoute/>}> <Route path='/advisor-notifications' element={<AdvNotifs/>} /> </Route>
	  <Route path='/advisor-about' element={<ProtectedRoute/>}> <Route path='/advisor-about' element={<AdvAbout/>} /> </Route>
	  
	<Route path='/test-student-home' element={<ProtectedRoute/>}> <Route path='/test-student-home' element={<TestStudHome/>} /> </Route>
	<Route path='/test-student-autoscheduler' element={<ProtectedRoute/>}> <Route path='/test-student-autoscheduler' element={<TestStudAutoScheduler/>} /> </Route>
	<Route path='/test-student-calendar' element={<ProtectedRoute/>}> <Route path='/test-student-calendar' element={<TestStudCalendar/>} /> </Route>
	<Route path='/test-student-catalog' element={<ProtectedRoute/>}> <Route path='/test-student-catalog' element={<TestStudCatalog/>} /> </Route>
	<Route path='/test-student-declare-major' element={<ProtectedRoute/>}> <Route path='/test-student-declare-major' element={<TestStudDeclare/>} /> </Route>
	<Route path='/test-student-faqs' element={<ProtectedRoute/>}> <Route path='/test-student-faqs' element={<TestStudFAQs/>} /> </Route>
	<Route path='/test-student-my-notes' element={<ProtectedRoute/>}> <Route path='/test-student-my-notes' element={<TestStudNotes/>} /> </Route>
	<Route path='/test-student-received-notes' element={<ProtectedRoute/>}> <Route path='/test-student-received-notes' element={<TestStudRecNotes/>} /> </Route>
	<Route path='/test-student-notifications' element={<ProtectedRoute/>}> <Route path='/test-student-notifications' element={<TestStudNotifs/>} /> </Route>
	<Route path='/test-student-preferences' element={<ProtectedRoute/>}> <Route path='/test-student-preferences' element={<TestStudPrefs/>} /> </Route>
	<Route path='/test-student-previouscourses' element={<ProtectedRoute/>}> <Route path='/test-student-previouscourses' element={<TestStudPrevCourses/>} /> </Route>
	<Route path='/test-student-profile' element={<ProtectedRoute/>}> <Route path='/test-student-profile' element={<TestStudProfile/>} /> </Route>
	  <Route path='/test-student-progress' element={<ProtectedRoute/>}> <Route path='/test-student-progress' element={<TestStudProgress/>} /> </Route>
	  <Route path='/test-student-about' element={<ProtectedRoute/>}> <Route path='/test-student-about' element={<TestStudAbout/>} /> </Route>
	  
	  <Route path='/admin-home' element={<ProtectedRoute/>}> <Route path='/admin-home' element={<AdminHome/>} /> </Route>
	  <Route path='/admin-catalog' element={<ProtectedRoute/>}> <Route path='/admin-catalog' element={<AdminCatalog/>} /> </Route>
	  <Route path='/admin-calendar' element={<ProtectedRoute/>}> <Route path='/admin-calendar' element={<AdminCalendar/>} /> </Route>
	  <Route path='/admin-my-notes' element={<ProtectedRoute/>}> <Route path='/admin-my-notes' element={<AdminYourNotes/>} /> </Route>
	  <Route path='/admin-received-notes' element={<ProtectedRoute/>}> <Route path='/admin-received-notes' element={<AdminReceivedNotes/>} /> </Route>
	  <Route path='/admin-delete-account' element={<ProtectedRoute/>}> <Route path='/admin-delete-account' element={<AdminDeleteAccount/>} /> </Route>
	  <Route path='/admin-create-account' element={<ProtectedRoute/>}> <Route path='/admin-create-account' element={<AdminCreateAccount/>} /> </Route>
	  <Route path='/admin-delete-courses' element={<ProtectedRoute/>}> <Route path='/admin-delete-courses' element={<AdminDeleteACourse/>} /> </Route>
	  <Route path='/admin-upload-catalog' element={<ProtectedRoute/>}> <Route path='/admin-upload-catalog' element={<AdminUploadCatalog/>} /> </Route>
	  <Route path='/admin-faqs' element={<ProtectedRoute/>}> <Route path='/admin-faqs' element={<AdminFAQs/>} /> </Route>
	  <Route path='/admin-notifications' element={<ProtectedRoute/>}> <Route path='/admin-notifications' element={<AdminNotifs/>} /> </Route>
	  <Route path='/admin-about' element={<ProtectedRoute/>}> <Route path='/admin-about' element={<AdminAbout/>} /> </Route>
	  
	  <Route path='/registrar-home' element={<ProtectedRoute/>}> <Route path='/registrar-home' element={<RegistrarHome/>} /> </Route>
	  <Route path='/registrar-catalog' element={<ProtectedRoute/>}> <Route path='/registrar-catalog' element={<RegistrarCatalog/>} /> </Route>
	  <Route path='/registrar-calendar' element={<ProtectedRoute/>}> <Route path='/registrar-calendar' element={<RegistrarCalendar/>} /> </Route>
	  <Route path='/registrar-notifications' element={<ProtectedRoute/>}> <Route path='/registrar-notifications' element={<RegistrarNotifications/>} /> </Route>
	  <Route path='/registrar-my-notes' element={<ProtectedRoute/>}> <Route path='/registrar-my-notes' element={<RegistrarNotes/>} /> </Route>
	  <Route path='/registrar-received-notes' element={<ProtectedRoute/>}> <Route path='/registrar-received-notes' element={<RegistrarRecNotes/>} /> </Route>
	  <Route path='/registrar-all-notes' element={<ProtectedRoute/>}> <Route path='/registrar-all-notes' element={<RegistrarAllNotes/>} /> </Route>
	  <Route path='/registrar-all-polls' element={<ProtectedRoute/>}> <Route path='/registrar-all-polls' element={<RegistrarPolls/>} /> </Route>
	  <Route path='/registrar-all-suggestions' element={<ProtectedRoute/>}> <Route path='/registrar-all-suggestions' element={<RegistrarSuggestions/>} /> </Route>
	  <Route path='/registrar-upload-catalog' element={<ProtectedRoute/>}> <Route path='/registrar-upload-catalog' element={<RegistrarUploadCatalog/>} /> </Route>
	  <Route path='/registrar-delete-course' element={<ProtectedRoute/>}> <Route path='/registrar-delete-course' element={<RegistrarDeleteCourse/>} /> </Route>
	  <Route path='/registrar-add-course' element={<ProtectedRoute/>}> <Route path='/registrar-add-course' element={<RegistrarAddCourse/>} /> </Route>
	  <Route path='/registrar-faqs' element={<ProtectedRoute/>}> <Route path='/registrar-faqs' element={<RegistrarFAQs/>} /> </Route>
	  <Route path='/registrar-about' element={<ProtectedRoute/>}> <Route path='/registrar-about' element={<RegistrarAbout/>} /> </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


