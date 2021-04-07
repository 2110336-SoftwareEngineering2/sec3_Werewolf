import { ChakraProvider } from '@chakra-ui/react';
import { Switch, Route, Redirect } from 'react-router-dom';
import theme from './theme.js';

import LogIn from './components/pages/login/login.jsx';
import SignUp from './components/pages/signup/signup.jsx';
import Home from './components/pages/home/home.jsx';
import EditProfile from './components/pages/editprofile/editprofile.jsx';
import Workspace from './components/pages/workspace/workspace.jsx';
import ProtectedRoute from './components/protectedRoute';
import Promotion from './components/pages/promotion/promotion.jsx';
import ProfilePage from './components/pages/profilepage/profilepage.jsx';
import Navbar from './components/layouts/Navbar.jsx';
import JobsPage from './components/pages/jobs/jobs.jsx';
import Post from './components/pages/post/post.jsx';
import Review from './components/pages/review/review.jsx';
import Verification from './components/pages/signup/verfification.jsx';
import { UploadImage } from './components/shared/imageUploader/upload_image_example.jsx';
import { SingleUpload } from './components/shared/imageUploader/single_image_example';
import { observer } from 'mobx-react-lite';

export const App = observer(() => {
  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <ProtectedRoute exact path="/home" component={Home} />
        <Route exact path="/login" component={LogIn} />
        <Route exact path="/profile/edit" component={EditProfile} />
        <Route exact path="/register" component={SignUp} />

        <Route exact path="/auth/verify/:token" component={Verification} />
        <ProtectedRoute exact path="/post/create" component={Postjob} />
        <ProtectedRoute exact path="/review" component={Review} />
        <ProtectedRoute exact path="/workspace" component={Workspace} />
        <ProtectedRoute permission={['admin']} path="/promotion" component={Promotion} />
        <ProtectedRoute exact path="/home" component={Home} />
        <ProtectedRoute path="/post" component={Post} />
        <ProtectedRoute path="/promotion" component={Promotion} />
        <ProtectedRoute exact path="/profile" component={ProfilePage} />
        <ProtectedRoute exact path="/profile/edit" component={EditProfile} />

        <ProtectedRoute exact path="/workspace" component={Workspace} />
        <ProtectedRoute exact path="/jobs" component={JobsPage} />

        <Route path="/image" component={UploadImage} />
        <Route path="/single_img" component={SingleUpload} />
      </Switch>
    </ChakraProvider>
  );
});
