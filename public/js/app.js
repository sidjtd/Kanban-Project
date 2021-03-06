'use strict';
// import {Input} from './models/Input.jsx';
/*==================================
=            Big Kanban            =
==================================*/
class BigKanban extends React.Component {
  constructor(){
    super();
    this.state = {
      toggler : false,
      ColData : [],
      ColDataTwo : [],
      ColDataThree : []
    }
    this.updateCard = this.updateCard.bind(this)
    this.addCard = this.addCard.bind(this)
    this.newCard = this.newCard.bind(this)
    this.deleteCard = this.deleteCard.bind(this)
    this.removeItAll = this.removeItAll.bind(this)
    this.leftMove = this.leftMove.bind(this)
    this.rightMove = this.rightMove.bind(this)
    this.seedIt = this.seedIt.bind(this)
  };
  componentDidMount() {
    this.getMongoData();
  };

  getMongoData(){
    let componentContext = this;
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function () {
      let xhrData = JSON.parse(this.response)
      componentContext.setState({
        ColData: xhrData.filter(function (card){
          return card.status === 1;
        }),
        ColDataTwo: xhrData.filter(function (card){
          return card.status === 2;
        }),
        ColDataThree: xhrData.filter(function (card){
          return card.status === 3;
        }),
      });
    });
    oReq.open("GET", "/getAll");
    oReq.send();
  }

  updateCard(cardId, status) {
    if(status<3){
      let componentContext = this;
      const oReq = new XMLHttpRequest();
      oReq.addEventListener("load", function (){
        componentContext.getMongoData();
      });
      oReq.open("PUT", "/update");
      oReq.setRequestHeader("Content-Type", "application/json");
      oReq.send(JSON.stringify({id:cardId}));
    }
  }

  leftMove(cardId, status) {
    if(status>1){
      let componentContext = this;
      const oReq = new XMLHttpRequest();
      oReq.addEventListener("load", function (){
        componentContext.getMongoData();
      });
      oReq.open("PUT", "/lefter");
      oReq.setRequestHeader("Content-Type", "application/json");
      oReq.send(JSON.stringify({id:cardId}));
    }
  }

  rightMove(cardId, status) {
    if(status<3){
      let componentContext = this;
      const oReq = new XMLHttpRequest();
      oReq.addEventListener("load", function (){
        componentContext.getMongoData();
      });
      oReq.open("PUT", "/righter");
      oReq.setRequestHeader("Content-Type", "application/json");
      oReq.send(JSON.stringify({id:cardId}));
    }
  }

  newCard(card) {
    if(this.state.toggler){
      this.state.toggler = false;
    }else{
      this.state.toggler = true;
    }this.getMongoData();
  }

  addCard(e) {
    e.preventDefault();
    var componentContext = this;
    const titleVar = document.getElementById('titleField').value;
    const descVar = document.getElementById('descriptionField').value;
    const priorityVar = document.getElementById('priorityField').value;
    const statusVar= document.getElementById('statusField').value;
    const authorVar = document.getElementById('createdByField').value;
    const assignedVar = document.getElementById('assignedToField').value;
    if(titleVar&&authorVar&&assignedVar){
      const oReq = new XMLHttpRequest();
      oReq.addEventListener('load', function(){
          componentContext.getMongoData();
      });
      oReq.open('POST', "/addACard",true);
      oReq.setRequestHeader("Content-Type", "application/json")
      oReq.send(JSON.stringify({
        title: `${titleVar}`,
        desc: `${descVar}`,
        author: `${authorVar}`,
        handler: `${assignedVar}`,
        priority: `${priorityVar}`,
        status: `${statusVar}`
      }));
    }
  }

  deleteCard(cardId) {
    let componentContext = this;
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function (){
      componentContext.getMongoData();
    });
    oReq.open("DELETE", "/delete");
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send(JSON.stringify({id:cardId}));
  }

  removeItAll(cardId) {
    let componentContext = this;
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function (){
      componentContext.getMongoData();
    });
    oReq.open("DELETE", "/removeall");
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send();
  }

  seedIt(cardId) {
    let componentContext = this;
    const seedVar = document.getElementById('seedId').value;
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function (){
      componentContext.getMongoData();
    });
    oReq.open("POST", "/seed");
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send(JSON.stringify({num:`${seedVar}`}));
  }

  render() {
    return (
      <div>
      <div id="bigk">
        <h1> ƁȉƓ ǨÅȠƁÅȠ</h1><br/>
      <button onClick={this.seedIt}>SEED (TEST ONLY)</button>
      <input type="number" name="seedNothing" id="seedId" min="1" max="9" placeholder="0"/>
      <button onClick={this.removeItAll}>DROP (TEST ONLY)</button><br/>
        {this.state.toggler ?
          <div id="inputfield">
            <div className="left"><button className="inbutton" onClick={this.newCard}>CLOSE</button></div><br/>
            <form id="theNewForm">
              Title: &emsp;
              <input type="text" id="titleField" placeholder="Task"/><br/>
              Description:&emsp;
              <input type="text" id="descriptionField" placeholder="Details"/><br/>
              Priority:&emsp;
              <select id="priorityField">
                <option value="urgent">Urgent</option>
                <option value="necessary">Necessary</option>
                <option value="mustDo">Must Do</option>
              </select><br/>
              Status:&emsp; &emsp;
              <select id="statusField">
                <option value="1">To Do</option>
                <option value="2">Doing</option>
                <option value="3">Done</option>
              </select><br/>
              Created By:&emsp; &emsp;
              <input type="text" id="createdByField" placeholder="name"/><br/>
              Assigned To:&#160;
              <input type="text" id="assignedToField" placeholder="name"/><br/><br/>
              <div className="left"><button className="inbutton" onClick={this.addCard}>SUBfMIT</button></div>
            </form>
          </div>: <div><button className="inbutton" onClick={this.newCard}>NEW MEMO</button></div>} <br/>

        <div id="postContainer">
          <PostColumns data={this.state.ColData} rightMove={this.rightMove} leftMove={this.leftMove} updateCard={this.updateCard} deleteCard={this.deleteCard} colInfo={'TO DO'}/>
          <PostColumns data={this.state.ColDataTwo} rightMove={this.rightMove} leftMove={this.leftMove} updateCard={this.updateCard} deleteCard={this.deleteCard} colInfo={'DOING'}/>
          <PostColumns data={this.state.ColDataThree} rightMove={this.rightMove} leftMove={this.leftMove} updateCard={this.updateCard} deleteCard={this.deleteCard} colInfo={'DONE'}/>
        </div>
      </div><br/>
      </div>
    );
  };
};

var vid = document.getElementById("bgvid"),
pauseButton = document.getElementById("vidpause");
function vidFade() {
    vid.classList.add("stopfade");
}
vid.addEventListener('ended', function() {
  // only functional if "loop" is removed
  vid.pause();
  vidFade();
});
pauseButton.addEventListener("click", function() {
  vid.classList.toggle("stopfade");
  if (vid.paused) {
    vid.play();
    pauseButton.innerHTML = "◇";
  }else {
    vid.pause();
    pauseButton.innerHTML = "◆";
  }
});
/*===================================
=            PostColumns            =
===================================*/
class PostColumns extends React.Component {
  render() {
    // console.log("3 tracker",this.props);
    var parent = this;
    var theNode = this.props.data.map( function (passedData) {
    return (
      <PostItems {...passedData} rightMove={parent.props.rightMove} leftMove={parent.props.leftMove} updateCard={parent.props.updateCard} deleteCard={parent.props.deleteCard} getMongoData={parent.props.getMongoData} key={passedData._id}/>
      )
    });
    return (
      <div id="list">
        <div><br/>
          <div id="notclear"><h1>{this.props.colInfo}</h1></div>
          { theNode }
        </div>
      </div>
    );
  };
};
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
  }
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
/*==================================
=            Prototypes            =
==================================*/
BigKanban.PropTypes = {
  data: React.PropTypes.array
};
BigKanban.defaultProps = {
  data: []
};
function reqListener(){
  console.log(this.responseText);
}
/*====================================
=            React Render            =
====================================*/
ReactDOM.render(
  <BigKanban />,
  document.getElementById('content')
);