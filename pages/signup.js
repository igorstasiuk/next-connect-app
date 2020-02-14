import {
  Typography,
  Avatar,
  FormControl,
  Paper,
  Input,
  InputLabel,
  Button,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@material-ui/core';

import {
  Gavel,
  VerifiedUserTwoTone
} from '@material-ui/icons';

import Link from 'next/link';

import withStyles from '@material-ui/core/styles/withStyles';

import { signupUser } from '../lib/auth';

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class Signup extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    error: '',
    createdUser: '',
    openError: false,
    openSuccess: false,
    isLoading: false
  };

  handleClose = () => this.setState({openError: false});

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  };

  handleSubmit = event => {
    const {name, email, password} = this.state;

    event.preventDefault();
    const user = {
      name,
      email,
      password
    };
    this.setState({isLoading: true, error: ''});
    signupUser(user)
      .then(createdUser => {
        this.setState({
          createdUser,
          error: '',
          openSuccess: true,
          isLoading: false
        })
      }).catch(this.showError);
  };

  showError = err => {
    const error = err.response && err.response.data || err.message;
    this.setState({error, openError: true, isLoading: false});
  };

  render() {
    const {classes} = this.props;
    const {error, openError, openSuccess, createdUser, isLoading} = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Gavel/>
          </Avatar>
          <Typography variant="h5" component="h1">
            Sign up
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">
                Name
              </InputLabel>
              <Input
                name="name"
                type="text"
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">
                Email
              </InputLabel>
              <Input
                name="email"
                type="email"
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">
                Password
              </InputLabel>
              <Input
                name="password"
                type="password"
                onChange={this.handleChange}
              />
            </FormControl>
            <Button type="submit" fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>

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
        </Paper>

        {/* Success Dialog */}
        <Dialog
          open={openSuccess}
          disableBackdropClick={true}
          transitionComponent={Transition}
        >
          <DialogTitle>
            <VerifiedUserTwoTone className={classes.icon}/>
            New Account
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              User {createdUser.name} successfully created!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" variant="contained">
              <Link href="/signin">
                <a className={classes.signinLink}>
                  Sign in
                </a>
              </Link>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
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
  }
});

export default withStyles(styles)(Signup);
