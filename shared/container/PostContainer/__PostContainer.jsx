import React, { PropTypes, Component } from 'react';
import PostListView from '../PostListView/PostListView';
import PostCreateView from '../../components/PostCreateView/PostCreateView';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';

class PostContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showAddPost: false,
    };
    // Bind in constructor so they are bound once for every instance.
    this.handleClick = this.handleClick.bind(this);
    this.add = this.add.bind(this);
  }

  /**
   * Handles the "Add Post" button click which is a toggle to show the
   * user entry div
   * @param {object} e Click event object
   */
  handleClick(e) {
    this.setState({
      showAddPost: !this.state.showAddPost,
    });

    e.preventDefault();
  }

  /**
   * Passed to `PostCreateView` to handle post submission to database
   */
  add(name, title, content) {
    this.props.dispatch(Actions.addPostRequest({ name, title, content }));
      
      // Hide the new post box
    this.setState({
      showAddPost: false,
    });
  }
    
  /**
   * Runs once before initial rendering on both server and client.
   */
  componentWillMount() {}
    
  /**
   * Runs once after initial rendering on client. 
   * Timers and AJAX requests should go here.
   */
  componentDidMount() {
    if(this.props.posts.length === 0) {
      this.props.dispatch(Actions.fetchPosts());
    }
  }

  render() {
    return (
      <div>
        <Header onClick={this.handleClick} />
        <div className="container">
          <PostCreateView addPost={this.add}
                          showAddPost={this.state.showAddPost}/>
          <PostListView posts={this.props.posts}/>
        </div>
        <Footer />
      </div>
    );
  }
}

PostContainer.need = [() => { return Actions.fetchPosts(); }];
PostContainer.contextTypes = {
  router: React.PropTypes.object,
};

function mapStateToProps(store) {
  return {
    posts: store.posts,
  };
}

PostContainer.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  })).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(PostContainer);
