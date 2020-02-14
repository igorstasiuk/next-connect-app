import {
  CircularProgress,
  Drawer,
  Typography,
  Grid,
  Fab
} from '@material-ui/core';

import Router from 'next/router';

import withStyles from '@material-ui/core/styles/withStyles';

import { authInitialProps } from '../lib/auth';

import PostFeed from '../components/index/PostFeed';
import UserFeed from '../components/index/UserFeed';

const Index = ({classes, auth}) => (
  <main className={classes.root}>
    {auth.user && auth.user._id ? (
      // Auth user Page
      <Grid container>
        <Grid item xs={12} sm={12} md={7}>
          <PostFeed auth={auth}/>
        </Grid>
        <Grid item className={classes.drawerContainer}>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            anchor="right"
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <UserFeed auth={auth}/>
          </Drawer>
        </Grid>
      </Grid>
    ) : (
      // Splash Page (UnAuth Page)
      <Grid
        justify="center"
        alignItems="center"
        direction="row"
        container
        className={classes.heroContent}
      >
        <Typography component="h1" variant="h2" align="center" gutterBottom color="textPrimary">
          A Better Social Network
        </Typography>
        <Typography component="p" variant="h6" align="center" color="textSecondary">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur ducimus eius fuga id impedit, in,
          inventore nesciunt nihil quam quasi suscipit ut vel. Consequatur dicta distinctio eligendi inventore
          necessitatibus,
          omnis quibusdam sequi voluptate! Animi beatae dolores error nobis unde.
        </Typography>
        <Fab
          className={classes.fabButton}
          variant="extended"
          color="primary"
          onClick={() => Router.push('/signup')}
        >
          Get started
        </Fab>
      </Grid>
    )}
  </main>
);

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 10,
    paddingLeft: theme.spacing.unit * 5,
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing.unit * 5
    }
  },
  progressContainer: {
    height: '80vh'
  },
  progress: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.secondary.light
  },
  drawerContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  drawer: {
    width: 350
  },
  drawerPaper: {
    marginTop: 70,
    width: 350
  },
  fabButton: {
    margin: theme.spacing.unit * 3
  },
  heroContent: {
    maxWidth: 600,
    paddingTop: theme.spacing.unit * 8,
    paddingBottom: theme.spacing.unit * 6,
    margin: '0 auto'
  }
});

Index.getInitialProps = authInitialProps();

export default withStyles(styles)(Index);
