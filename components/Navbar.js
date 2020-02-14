import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import ShareOutlined from '@material-ui/icons/ShareOutlined';
import withStyles from '@material-ui/core/styles/withStyles';

import ActiveLink from './ActiveLink';

import { signoutUser } from '../lib/auth';

const Navbar = ({classes, router, pageProps: { auth }}) => {
  const {user = {}} = auth || {};

  return (
    <AppBar className={classes.appBar} position={router.pathname === '/' ? 'fixed' : 'static'}>
      <Toolbar>
        {/* Main title / Home button */}
        <ActiveLink href="/">
          <ShareOutlined className={classes.icon}/>
        </ActiveLink>
        <Typography variant="h5" component="h1" className={classes.toolbarTitle}>
          <ActiveLink href="/">
            NextConnect
          </ActiveLink>
        </Typography>

        {user._id ? (
          // Auth navigation
          <div>
            <Button>
              <ActiveLink href={`/profile/${user._id}`}>
                Profile
              </ActiveLink>
            </Button>
            <Button variant="outlined" onClick={signoutUser}>Sign out</Button>
          </div>
        ) : (
          // UnAuth Navigation
          <div>
            <Button>
              <ActiveLink href="/signin">
                Sign in
              </ActiveLink>
            </Button>
            <Button>
              <ActiveLink href="/signup">
                Sign up
              </ActiveLink>
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  )
};

const styles = theme => ({
  appBar: {
    // z-index 1 higher than the fixed drawer in home page to clip it under the navigation
    zIndex: theme.zIndex.drawer + 1
  },
  toolbarTitle: {
    flex: 1
  },
  icon: {
    marginRight: theme.spacing.unit
  }
});

export default withStyles(styles)(Navbar);
