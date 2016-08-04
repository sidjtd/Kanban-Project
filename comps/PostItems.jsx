import React from 'react';
/*==================================
=            Post Items            =
==================================*/
class PostItems extends React.Component {
  constructor(){
    super()
    this.state = {_id: 0, title: '', priority: '', status: '', createdBy: '', assignedTo: ''}
    this.updateCard = this.updateCard.bind(this)
    this.deleteCard = this.deleteCard.bind(this)
    this.leftMove = this.leftMove.bind(this)
    this.rightMove = this.rightMove.bind(this)
  };
  componentDidMount() {
    this.setState({
      _id: this.props._id,
      title: this.props.title,
      priority: this.props.priority,
      status:this.props.status,
      createdBy:this.props.createdBy,
      asssignedTo:this.props.assignedTo
    })
  }
  rightMove(){
    this.props.rightMove(this.state._id, this.state.status);
  }
  leftMove(){
    this.props.leftMove(this.state._id, this.state.status);
  }
  updateCard(){
    this.props.rightMove(this.state._id, this.state.status);
  }
  deleteCard(){
    this.props.deleteCard(this.state._id);
  }
  render() {
    return (
      <div className='theposts'>
        <div id={this.state._id}>
          <span className="boldme">Task:</span> {this.state.title}<br/>
          <span className="boldme">By: &emsp;&nbsp; </span> {this.state.createdBy}<br/>
          <span className="boldme">For: &emsp; </span>{this.state.assignedTo}<br/>
          <span className="boldme">Priority:</span> {this.state.priority}<br/>
        </div><br/>
        <div className="buttonDiv"><br/>
          {/*<a className="updateButton" href={this.updateCard}>Update Status</a>*/}
          <button className="arrowbutton" onClick={this.leftMove}>←</button>
          <button className="upbutton" onClick={this.updateCard}>Update</button>
          <button className="delbutton" onClick={this.deleteCard}>Delete</button>
          <button className="arrowbutton" onClick={this.rightMove}>→</button>
        </div>
      </div>
    );
  };
};

export default PostItems;