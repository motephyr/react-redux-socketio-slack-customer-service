import {Component, PropTypes} from 'react';
import {connect} from 'react-redux'
import _ from 'lodash'
import ReactDOM from 'react-dom';
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

export default class SettingPage extends Component {
  state = { name: '' };

  handleChange(name, value) {
    this.setState({...this.state, [name]: value});
  };

  onClick() {
      window.socketInstance.emit('change_name',  { new_name:this.state.name} );
      this.props.onClick();
  }

  render() {
    const {is_email_column_show, messages, socket} = this.props


    return (
      <div>
        <Input type='text' label='修改姓名' required={true} name='name' value={this.state.name}  onChange={this.handleChange.bind(this, 'name')} />
        <Input type='text' label='修改email'required={true} />
        <Input type='file' label='上傳圖片' required={true} />

        <Button
          type='submit'
          label='儲存'
          raised
          accent
          onClick={::this.onClick} />
      </div>
    )
  }
}
