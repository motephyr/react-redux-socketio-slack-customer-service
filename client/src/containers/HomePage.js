import {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import Cookie from 'cookies-js'
import uuid from 'node-uuid'
import io from 'socket.io-client'
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import {List, ListItem, ListSubHeader, ListDivider, ListCheckbox} from 'react-toolbox';
import TimePicker from 'react-toolbox/lib/time_picker';
import style from '../../css/app.scss';
import Form from 'react-toolbox/lib/form';


var suid = Cookie.get('uuid');
if (!suid) {
  suid = Cookie.set('uuid', uuid.v4())
}



export default class HomePage extends Component {

  render() {
    const {is_email_column_show, messages, socket} = this.props


    return (
          <fieldset className={style.field}>
            <Input type='text' label='如何稱呼您' required={true} />
            <Button type='submit' label='送出' raised accent onClick={this.props.onClick} />
          </fieldset>

    )
  }
}
