import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';

import { Delete } from '@material-ui/icons';

import { deleteUser } from '../../lib/api';
import { signoutUser } from '../../lib/auth';

class DeleteUser extends React.Component {
  state = {
    open: false,
    isDeleting: false
  };

  handleDeleteUser = () => {
    const {user} = this.props;

    this.setState({isDeleting: true});
    deleteUser(user._id)
      .then(() => {
        signoutUser();
      }).catch(err => {
      console.error(err);
      this.setState({isDeleting: false});
    })
  };

  handleOpen = () => this.setState({open: true});

  handleClose = () => this.setState({open: false});

  render() {
    const {open, isDeleting} = this.state;

    return (
      <div>
        {/*Delete Button*/}
        <IconButton onClick={this.handleOpen} color="secondary">
          <Delete/>
        </IconButton>

        {/*Delete user dialog*/}
        <Dialog open={open} onClose={this.handleClose}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Confirm to delete your account
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleDeleteUser}
              color="secondary"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...': 'Confirm'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DeleteUser;
