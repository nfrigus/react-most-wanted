import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { withTheme } from '@material-ui/core/styles'
import { injectIntl, intlShape } from 'react-intl'
import { Activity } from 'rmw-shell'
import { setDialogIsOpen } from 'rmw-shell/lib/store/dialogs/actions'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import { withRouter } from 'react-router-dom'
import { withFirebase } from 'firekit-provider'
import green from '@material-ui/core/colors/green'
import Scrollbar from 'rmw-shell/lib/components/Scrollbar'
import withWidth from '@material-ui/core/withWidth'
import moment from 'moment'
import DealRemoveDialog from './DealRemoveDialog'


class Deals extends Component {

  constructor(props) {
    super(props);
    this.name = null;
    this.listEnd = null
    this.state = { value: '' }
  }

  scrollToBottom = () => {
    const node = ReactDOM.findDOMNode(this.listEnd);
    if (node) {
      node.scrollIntoView({ behavior: "smooth" });
    }

  }

  componentDidUpdate(prevProps, prevState) {

    this.scrollToBottom();

  }

  componentDidMount() {
    const { watchList, firebaseApp } = this.props;

    const itemRef = firebaseApp.database().ref('deals').orderByKey().limitToLast(20);
    watchList(itemRef)
    this.scrollToBottom();
  }

  handleKeyDown = (event, onSucces) => {
    if (event.keyCode === 13) {
      onSucces();
    }
  }

  handleAddDeal = () => {
    const { auth, firebaseApp } = this.props;

    const newDeal = {
      completed: false,
      created: moment.now(),
      title: this.state.value,
      userId: auth.uid,
      userName: auth.displayName,
      userPhotoURL: auth.photoURL,
    };

    if (this.state.value.length > 0) {
      firebaseApp.database().ref('deals').push(newDeal).then(() => {
        this.setState({ value: '' })
      })
    }
  }

  handleUpdate = (key, item) => {
    const { firebaseApp } = this.props;
    firebaseApp.database().ref(`deals/${key}`).update(item);
  }


  userAvatar = (key, item) => {

    if (item.completed) {
      return <Avatar style={{ backgroundColor: green[500] }}> <Icon> done </Icon> </Avatar>
    }
    return <div>
      {item.userPhotoURL && <Avatar src={item.userPhotoURL} alt='person' />}
      {!item.userPhotoURL && <Avatar> <Icon> person </Icon> </Avatar>}
    </div>
  }

  render() {
    const { intl, deals, theme } = this.props;

    return (
      <Activity
        isLoading={deals === undefined}
        containerStyle={{ overflow: 'hidden' }}
        title={intl.formatMessage({ id: 'deals' })}>

        <Scrollbar>

          <div style={{ overflow: 'none', backgroundColor: theme.palette.convasColor, paddingBottom: 56 }}>
            <List id='test' style={{ height: '100%' }} ref={(field) => { this.list = field; }}>
              {this.renderList(deals)}
            </List>
            <div style={{ float: "left", clear: "both" }}
                 ref={(el) => { this.listEnd = el; }}
            />
          </div>

        </Scrollbar>

        {deals && this.renderBottomNavigation(theme)}

        <DealRemoveDialog />
      </Activity>
    );

  }

  renderList(items) {
    const { auth, intl, history, setDialogIsOpen } = this.props;

    if (items === undefined) {
      return <div></div>
    }

    return items.map(row => {
      const item = row.val;
      const key = row.key;

      return (
        <div key={key}>
          <ListItem
            id={key}
            key={key}
            onClick={auth.uid === item.userId ? () => {
              this.handleUpdate(key, {
                ...item,
                completed: !item.completed
              })
            } : undefined}>
            {this.userAvatar(key, item)}
            <ListItemText primary={item.title}
                          secondary={`${item.userName} ${item.created ? intl.formatRelative(new Date(item.created)) : undefined}`} />
            <ListItemSecondaryAction>
              {
                item.userId === auth.uid ?
                  <IconButton
                    color='primary'
                    onClick={item.userId === auth.uid ? () => { history.push(`/deals/${key}`) } : undefined}>
                    <Icon>{'edit'}</Icon>
                  </IconButton> : undefined
              }
              {
                item.userId === auth.uid ?
                  <IconButton
                    color='secondary'
                    onClick={() => { setDialogIsOpen('deals_remove_dialog', key); }}>
                    <Icon>{'delete'}</Icon>
                  </IconButton> : undefined
              }
            </ListItemSecondaryAction>
          </ListItem>
          <Divider inset={true} />
        </div>
      );
    });
  }

  renderBottomNavigation() {
    const { theme } = this.props;

    return (
      <BottomNavigation style={{ width: '100%', position: 'absolute', bottom: 0, right: 0, left: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 15 }}>
          <TextField
            value={this.state.value}
            onKeyDown={(event) => { this.handleKeyDown(event, this.handleAddDeal) }}
            onChange={e => this.setState({ value: e.target.value })}
            type="Text"
          />
          <IconButton
            disabled={this.state.value === ''}
            onClick={this.handleAddDeal}>
            <Icon className="material-icons" color={theme.palette.primary1Color}>send</Icon>
          </IconButton>
        </div>
      </BottomNavigation>
    );
  }
}

Deals.propTypes = {
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const { lists, auth, dialogs } = state;

  return {
    auth,
    dialogs,
    deals: lists.deals || [],
  };
};

export default compose(
  connect(mapStateToProps, { setDialogIsOpen }),
  injectIntl,
  withWidth(),
  withTheme(),
  withRouter,
  withFirebase,
)(Deals)
