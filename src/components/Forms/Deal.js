import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { setDialogIsOpen } from 'rmw-shell/lib/store/dialogs/actions'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import BottomNavigation from '@material-ui/core/BottomNavigation'


class Form extends Component {
  state = {}

  render() {
    const {
      handleSubmit,
      initialized,
      intl,
      theme,
    } = this.props

    return (
      <form onSubmit={handleSubmit} style={{
        height: '100%',
        alignItems: 'strech',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button type='submit' style={{ display: 'none' }} />

        <div>
          <div>
            <Field
              name='title'
              disabled={!initialized}
              component={TextField}
              placeholder={intl.formatMessage({ id: 'title_hint' })}
              label={intl.formatMessage({ id: 'title_label' })}
              ref='title'
              withRef
            />
          </div>

          <div>
            <Field
              name='description'
              disabled={!initialized}
              component={TextField}
              multiline
              placeholder={intl.formatMessage({ id: 'description_hint' })}
              label={intl.formatMessage({ id: 'description_label' })}
              ref='description'
              withRef
            />
          </div>
        </div>

        <BottomNavigation style={{ width: '100%', position: 'absolute', bottom: 0, right: 0, left: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 15 }}>
            <IconButton
              disabled={this.state.value === ''}
              onClick={this.handleAddDeal}>
              <Icon className="material-icons" color={theme.palette.primary1Color}>backward</Icon>
              <Icon className="material-icons" color={theme.palette.primary1Color}>forward</Icon>
            </IconButton>
          </div>
        </BottomNavigation>

      </form>
    )
  }
}


const mapStateToProps = state => ({});

export default compose(
  reduxForm({ form: 'deal' }),
  connect(mapStateToProps, { setDialogIsOpen }),
  injectIntl,
  withRouter,
  withTheme(),
)(Form)
