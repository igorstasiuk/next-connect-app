import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
  CircularProgress,
  Divider
} from '@material-ui/core';

import { Edit } from '@material-ui/icons';

import { withStyles } from '@material-ui/core/styles';

import Link from 'next/link';

import { authInitialProps } from '../lib/auth';

import { addComment, deleteComment, deletePost, getPostsByUser, getUser, likePost, unlikePost } from '../lib/api';

import FollowUser from '../components/profile/FollowUser';
import DeleteUser from '../components/profile/DeleteUser';
import ProfileTabs from '../components/profile/ProfileTabs';
import Post from '../components/index/Post';

class Profile extends React.Component {
  state = {
    user: null,
    posts: [],
    isAuth: false,
    isFollowing: false,
    isLoading: true,
    isDeletingPost: false
  };

  componentDidMount() {
    const {userId, auth} = this.props;

    getUser(userId).then(async (user) => {
      const isAuth = auth.user._id === userId;
      const isFollowing = this.checkFollow(auth, user);
      const posts = await getPostsByUser(userId);
      this.setState({
        user,
        posts,
        isAuth,
        isFollowing,
        isLoading: false
      })
    })
  }

  checkFollow = (auth, user) => {
    return user.followers.findIndex(follower => follower._id === auth.user._id) > -1
  };

  toggleFollow = sendRequest => {
    const {userId} = this.props;
    const {isFollowing} = this.state;

    sendRequest(userId).then(() => {
      this.setState({
        isFollowing: !isFollowing
      })
    })
  };

  handleDeletePost = deletedPost => {
    this.setState({isDeletingPost: true});
    deletePost(deletedPost._id)
      .then(postData => {
        const postIndex = this.state.posts.findIndex(post => post._id === postData._id);
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({
          posts: updatedPosts,
          isDeletingPost: false
        })
      })
      .catch(err => {
        console.error(err);
        this.setState({isDeletingPost: false});
      })
  };

  handleToggleLike = post => {
    const {auth} = this.props;

    const isPostLiked = post.likes.includes(auth.user._id);
    const sendRequest = isPostLiked ? unlikePost : likePost;
    sendRequest(post._id)
      .then(postData => {
        const postIndex = this.state.posts.findIndex(post => post._id === postData._id);
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          postData,
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({
          posts: updatedPosts,
        })
      })
      .catch(err => {
        console.error(err);
      })
  };

  handleAddComment = (postId, text) => {
    const comment = {text};
    addComment(postId, comment)
      .then(postData => {
        const postIndex = this.state.posts.findIndex(post => post._id === postData._id);
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          postData,
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({
          posts: updatedPosts
        })
      })
      .catch(err => {
        console.error(err);
      })
  };

  handleDeleteComment = (postId, comment) => {
    deleteComment(postId, comment)
      .then(postData => {
        const postIndex = this.state.posts.findIndex(post => post._id === postData._id);
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          postData,
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({
          posts: updatedPosts
        })
      })
      .catch(err => {
        console.error(err);
      })
  };

  render() {
    const {classes, auth} = this.props;
    const {user, isLoading, isAuth, isFollowing, posts} = this.state;
    return (
      <Paper className={classes.root} elevation={4}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          className={classes.title}
          gutterBottom
        >
          Profile
        </Typography>

        {isLoading ? (
          <div className={classes.progressContainer}>
            <CircularProgress
              className={classes.progress}
              size={55}
              thickness={5}
            />
          </div>
        ) : (
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={user.avatar} className={classes.bigAvatar} />
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.email} />

              {/*Auth - Edit Buttons / UnAuth - Follow Buttons*/}
              {isAuth ? (
                <ListItemSecondaryAction>
                  <Link href="/edit-profile">
                    <a>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </a>
                  </Link>
                  <DeleteUser user={user}/>
                </ListItemSecondaryAction>
              ) : (
                <FollowUser
                  isFollowing={isFollowing}
                  toggleFollow={this.toggleFollow}
                />
              )}
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={user.about}
                secondary={`Joined: ${user.createdAt}`}
              />
            </ListItem>

            {/*Dispaly User's Posts, Following and Followers*/}
            <ProfileTabs
              auth={auth}
              user={user}
              posts={posts}
              handleDeletePost={this.handleDeletePost}
              handleToggleLike={this.handleToggleLike}
              handleAddComment={this.handleAddComment}
              handleDeleteComment={this.handleDeleteComment}
            />
          </List>
        )}
      </Paper>
    );
  }
}

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5,
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      width: 600
    }
  },
  title: {
    color: theme.palette.primary.main
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  }
});

Profile.getInitialProps = authInitialProps(true);

export default withStyles(styles)(Profile);
