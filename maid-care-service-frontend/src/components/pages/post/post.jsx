import { Link } from '@chakra-ui/layout';
import { Link as RouterLink, Switch as RouterSwitch, Route, useRouteMatch } from 'react-router-dom';
import { Postjob } from '../postjob/postjob';

const Post = () => {
  const { path } = useRouteMatch();
  return (
    <RouterSwitch>
      <Route exact path={path}>
        <div>Hello this is post pages.</div>
        <Link as={RouterLink} to={`${path}/create`}>
          Create A Post
        </Link>
      </Route>
      <Route path={`${path}/create`}>
        <Postjob />
      </Route>
    </RouterSwitch>
  );
};

export default Post;
