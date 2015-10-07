import {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

@connect(state => ({
  author: state.author,
  children: state.children
}))



export default class CommentBoxComponent extends Component {
  loadFromServer = () => {
    const data = [{
      id: 1,
      author: "Pete Hunt",
      text: "This is one comment"
    }, {
      id: 2,
      author: "Jordan Walke",
      text: "This is *another* comment"
    }];
    this.setState({
      data: data
    })
  }

  handleCommentSubmit(comment) {
    console.log(comment);
    // TODO: submit to the server and refresh the list
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: []
    };
  }


  componentDidMount = (e) => {
    setInterval(this.loadFromServer, 2000)
  }

  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    )
  }
}


export class CommentList extends Component {
  render() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author} key={comment.id} >
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
}
export class Comment extends Component {

  render() {
    const {author, children} = this.props
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {author}
        </h2>
        {children}
      </div>
    )
  }
}

export class CommentForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    )
  }
}
