import {
  AppBar,
  Typography,
  Tabs,
  Tab
} from "@material-ui/core";

import Post from '../index/Post';
import FollowTab from './FollowTab';

class ProfileTabs extends React.Component {
  state = {
    tab: 0
  };

  handleTabChange = (event, value) => {
    this.setState({
      tab: value
    })
  };

  render() {
    const {tab} = this.state;
    const {
      posts,
      user,
      auth,
      handleDeletePost,
      handleAddComment,
      handleDeleteComment,
      handleToggleLike
    } = this.props;

    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={tab}
            onChange={this.handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
          >
            <Tab label="Posts" />
            <Tab label="Following" />
            <Tab label="Followers" />
          </Tabs>
        </AppBar>
        {tab === 0 && (
          <TabContainer>
            {posts.map(post => (
              <Post
                key={post._id}
                post={post}
                auth={auth}
                handleDeletePost={handleDeletePost}
                handleToggleLike={handleToggleLike}
                handleAddComment={handleAddComment}
                handleDeleteComment={handleDeleteComment}
              />
            ))}
          </TabContainer>
        )}
        {tab === 1 && (
          <TabContainer>
            <FollowTab users={user.following}/>
          </TabContainer>
        )}
        {tab === 2 && (
          <TabContainer>
            <FollowTab users={user.followers}/>
          </TabContainer>
        )}
      </div>
    )
  }
}

const TabContainer = ({children}) => (
  <Typography component="div" style={{padding: '1em'}}>
    {children}
  </Typography>
);

export default ProfileTabs;
