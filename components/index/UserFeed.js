import {
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Button,
  Avatar,
  IconButton,
  Typography,
  Snackbar
} from '@material-ui/core';

import { AccountBox } from '@material-ui/icons';

import Link from 'next/link';

import withStyles from '@material-ui/core/styles/withStyles';
import { followUser, getUserFeed } from '../../lib/api';

class UserFeed extends React.Component {
  state = {
    users: [],
    openSuccess: false,
    followingMessage: ''
  };

  componentDidMount() {
    const {auth} = this.props;

    getUserFeed(auth.user._id).then(users => this.setState({users}));
  }

  handleClose = () => this.setState({openSuccess: false});

  handleFollow = (user, userIndex) => {
    followUser(user._id).then(user => {
      const updatedUsers = [
        ...this.state.users.slice(0, userIndex),
        ...this.state.users.slice(userIndex + 1)
      ];
      this.setState({
        users: updatedUsers,
        openSuccess: true,
        followingMessage: `Following ${user.name}`
      })
    })
  };

  render() {
    const {classes} = this.props;
    const {users, openSuccess, followingMessage} = this.state;


    return (
      <div>
        <Typography type="title" variant="h6" component="h2" align="center">
          Browse Users
        </Typography>
        <Divider/>

        {/*Users List*/}
        <List>
          {users.map((user, i) => (
            <span key={user._id}>
              <ListItem>
                <ListItemAvatar className={classes.avatar}>
                  <Avatar src={user.avatar}/>
                </ListItemAvatar>
                <ListItemText primary={user.name}/>
                <ListItemSecondaryAction className={classes.follow}>
                  <Link href={`/profile/${user._id}`}>
                    <IconButton variant="contained" color="secondary" className={classes.viewButton}>
                      <AccountBox/>
                    </IconButton>
                  </Link>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.handleFollow(user, i)}
                  >
                    Follow
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </span>
          ))}
        </List>

        {/*Follow User Snackbar*/}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          open={openSuccess}
          onClose={this.handleClose}
          autoHideDuration={6000}
          message={<span className={classes.snack}>{followingMessage}</span>}
        />
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    padding: theme.spacing.unit
  },
  avatar: {
    marginRight: theme.spacing.unit
  },
  follow: {
    right: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.primary.light
  },
  viewButton: {
    verticalAlign: 'middle'
  }
});

export default withStyles(styles)(UserFeed);
