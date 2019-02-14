import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Activity } from 'rmw-shell'
import { setDialogIsOpen } from 'rmw-shell/lib/store/dialogs/actions'
import Form from '../../components/Forms/Deal'
import { withRouter } from 'react-router-dom'
import Icon from '@material-ui/core/Icon'
import { withFirebase } from 'firekit-provider'
import FireForm from 'fireform'
import IconButton from '@material-ui/core/IconButton'
import { submit } from 'redux-form'
import DealRemoveDialog from './DealRemoveDialog'
import { compose } from 'redux'

const path = '/deals/';

class Deal extends Component {

  componentDidMount() {
    this.props.watchList('users');
  }


  handleCreateValues = (values) => {

    const { auth } = this.props;

    return {
      created: new Date(),
      userName: auth.displayName,
      userPhotoURL: auth.photoURL,
      userId: auth.uid,
      completed: false,
      ...values
    }
  }

  onAfterRemove = async () => this.props.history.goBack()

  render() {
    const { history, intl, setDialogIsOpen, firebaseApp, submit, match } = this.props

    return (
      <Activity
        appBarContent={
          <div style={{ display: 'flex' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => { submit('deal') }}
            >
              <Icon className="material-icons">save</Icon>
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                setDialogIsOpen('deals_remove_dialog', match.params.id || true)
              }}
            >
              <Icon className="material-icons">delete</Icon>
            </IconButton>

          </ div>
        }
        onBackClick={() => { history.goBack() }}
        title={intl.formatMessage({ id: this.props.match.params.id ? 'deal.label.edit' : 'deal.label.create' })}
      >
        <div style={{ margin: 15, display: 'flex' }}>
          <FireForm
            firebaseApp={firebaseApp}
            name={'deal'}
            path={path}
            onSubmitSuccess={() => { history.push('/deals'); }}
            onDelete={() => { history.push('/deals'); }}
            handleCreateValues={this.handleCreateValues}
            uid={this.props.match.params.id}>
            <Form />
          </FireForm>
        </div>

        <DealRemoveDialog afterRemove={this.onAfterRemove} />
      </Activity>
    );
  }
}


const mapStateToProps = (state) => {
  const { auth, intl, dialogs } = state;

  return {
    auth,
    intl,
    dialogs,
  };
};

export default compose(
  connect(mapStateToProps, { setDialogIsOpen, submit }),
  injectIntl,
  withFirebase,
  withRouter,
)(Deal)
