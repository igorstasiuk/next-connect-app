import {
  Avatar,
  FormControl,
  Paper,
  Input,
  InputLabel,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Button
} from '@material-ui/core';

import {
  VerifiedUserTwoTone,
  CloudUpload,
  FaceTwoTone,
  EditSharp
} from '@material-ui/icons';

import withStyles from '@material-ui/core/styles/withStyles';
import { authInitialProps } from '../lib/auth';

import { getAuthUser, updateUser } from '../lib/api';
import Link from 'next/link';
import Router from 'next/router'

class EditProfile extends React.Component {
  state = {
    _id: '',
    name: '',
    email: '',
    about: '',
    avatar: '',
    avatarPreview: '',
    error: '',
    openError: false,
    openSuccess: false,
    updatedUser: null,
    isSaving: false,
    isLoading: true
  };

  componentDidMount() {
    const {auth} = this.props;

    this.userData = new FormData();
    getAuthUser(auth.user._id)
      .then(user => {
        this.setState({
          ...user,
          isLoading: false
        })
      }).catch(err => {
      console.error(err);
      this.setState({
        isLoading: false
      })
    })
  }

  handleChange = event => {
    let inputValue;

    if (event.target.name === 'avatar') {
      inputValue = event.target.files[0];
      this.setState({
        avatarPreview: this.createPreviewImage(inputValue)
      })
    } else {
      inputValue = event.target.value;
    }
    this.userData.set(event.target.name, inputValue);
    this.setState({
      [event.target.name]: inputValue
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      isSaving: true
    });
    updateUser(this.state._id, this.userData)
      .then(updatedUser => {
        this.setState({
          updatedUser,
          openSuccess: true,
          isSaving: false,
        });
        setTimeout(() =>  Router.push(`/profile/${this.state._id}`), 3000);
      }).catch(this.showError);
  };

  createPreviewImage = file => URL.createObjectURL(file);

  handleClose = () => this.setState({openError: false});

  showError = err => {
    const error = err.response && err.response.data || err.message;
    this.setState({error, openError: true, isSaving: false});
  };

  render() {
    const {classes} = this.props;
    const {name, email, avatar, about, avatarPreview, error, openError, openSuccess, updatedUser, isSaving, isLoading} = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <EditSharp/>
          </Avatar>
          <Typography variant="h5" component="h1">
            Edit profile
          </Typography>

          {/*Edit Profile form*/}
          <form onSubmit={this.handleSubmit} className={classes.form}>
            {isLoading ? (
              <Avatar className={classes.bigAvatar}>
                <FaceTwoTone/>
              </Avatar>
            ) : (
              <Avatar src={avatarPreview || avatar} className={classes.bigAvatar}/>
            )}
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              onChange={this.handleChange}
              className={classes.input}
            />
            <label htmlFor="avatar" className={classes.uploadButton}>
              <Button variant="contained" color="secondary" component="span">
                Upload Image <CloudUpload/>
              </Button>
            </label>
            <span className={classes.filename}>{avatar && avatar.name}</span>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel htmlFor="about">About</InputLabel>
              <Input
                type="text"
                name="about"
                value={about}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                type="text"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              disabled={isSaving || isLoading}
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </Paper>

        {/* error snackbar */}
        {error &&
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          open={openError}
          onClose={this.handleClose}
          autoHideDuration={6000}
          message={<span className={classes.snack}>{error}</span>}
        />
        }

        {/* Success Dialog */}
        <Dialog
          open={openSuccess}
          disableBackdropClick={true}
        >
          <DialogTitle>
            <VerifiedUserTwoTone className={classes.icon}/>
            Profile Updated
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              User {updatedUser && updatedUser.name} was successfully update!
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up('md')]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.25em'
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing.unit * 2
  },
  signinLink: {
    textDecoration: 'none',
    color: 'white'
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.secondary.light
  },
  icon: {
    padding: '0px 2px 2px 0px',
    verticalAlign: 'middle',
    color: 'green'
  },
  input: {
    display: 'none'
  }
});

EditProfile.getInitialProps = authInitialProps();

export default withStyles(styles)(EditProfile);
