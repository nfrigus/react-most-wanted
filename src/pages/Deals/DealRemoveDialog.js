import React from 'react'
import { compose } from 'redux'
import { injectIntl } from 'react-intl'
import { withTheme } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { setDialogIsOpen } from 'rmw-shell/lib/store/dialogs/actions'
import { connect } from 'react-redux'
import { withFirebase } from 'firekit-provider'


const dialogKey = 'deals_remove_dialog'


function DealRemoveDialog({
  afterRemove = () => {},
  dealKey,
  firebaseApp,
  intl,
  setDialogIsOpen,
}) {
  return (
    <Dialog
      open={!!dealKey}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{intl.formatMessage({ id: 'deals.remove.title' })}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {intl.formatMessage({ id: 'deals.remove.message' })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {intl.formatMessage({ id: 'cancel' })}
        </Button>
        <Button onClick={compose(onRemove, onClose)} color="secondary">
          {intl.formatMessage({ id: 'delete' })}
        </Button>
      </DialogActions>
    </Dialog>
  );

  function onClose() { setDialogIsOpen(dialogKey, undefined) }
  function onRemove() {
    if (dealKey === true) return afterRemove()

    firebaseApp.database().ref(`deals/${dealKey}`)
      .remove()
      .then(afterRemove)
  }
}


export default compose(
  connect(state => ({ dealKey: state.dialogs[dialogKey] }), { setDialogIsOpen }),
  injectIntl,
  withFirebase,
  withTheme(),
  withWidth(),
)(DealRemoveDialog)
