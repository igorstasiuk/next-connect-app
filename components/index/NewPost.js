import {
  Card,
  Typography,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  TextField,
  Avatar,
  IconButton
} from "@material-ui/core";

import {AddAPhoto} from "@material-ui/icons";

import withStyles from "@material-ui/core/styles/withStyles";

const NewPost = ({classes, auth, text, image, handleChange, isAddingPost, handleAddPost}) => {

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar src={auth.user.avatar} />}
        title={<Typography variant="h6" component="h2">
          {auth.user.name}
        </Typography>}
        className={classes.cardHeader}
      />
      <CardContent className={classes.cardContent}>
        <TextField
          label="Add a status"
          value={text}
          name="text"
          multiline
          row="2"
          placeholder={`What's on your mind, ${auth.user.name}?`}
          fullWidth
          margin="normal"
          onChange={handleChange}
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
        />
        <input
          accept="image/*"
          name="image"
          id="image"
          onChange={handleChange}
          className={classes.input}
          type="file"
        />
        <label htmlFor="image">
          <IconButton
            color="secondary"
            component="span"
          >
            <AddAPhoto />
          </IconButton>
        </label>
        <span>{image && image.name}</span>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          color="primary"
          variant="contained"
          disabled={!text || isAddingPost}
          className={classes.submit}
          onClick={handleAddPost}
        >
          {isAddingPost ? 'Sending...' : 'Post'}
        </Button>
      </CardActions>
    </Card>
  )
};

const styles = theme => ({
  card: {
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: theme.palette.primary.light
  },
  cardContent: {
    backgroundColor: "white"
  },
  input: {
    display: "none"
  },
  cardActions: {
    display: "flex",
    flexDirection: "row-reverse"
  }
});

export default withStyles(styles)(NewPost);
