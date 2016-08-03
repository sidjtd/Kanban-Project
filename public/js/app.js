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
          return card.status === 'todo';
        }),
        ColDataTwo: xhrData.filter(function (card){
          return card.status === 'doing';
        }),
        ColDataThree: xhrData.filter(function (card){
          return card.status === 'done';
        }),
      });
    });
    oReq.open("GET", "http://localhost:2459/getAll");
    oReq.send();
  }

  updateCard(card) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function (){
      console.log("Update button calls for u");
    });
    oReq.open("GET", "http://localhost:2459/test");
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send(JSON.stringify({status: 'statusButtonNext'}));
  }

  newCard(card) {
    if(this.state.toggler){
      this.state.toggler = false;
    }else{
      this.state.toggler = true;
    }
    this.getMongoData();
  }

  addCard(cardId) {
      var componentContext = this;
      const titleVar = document.getElementById('titleField').value;
      const descVar = document.getElementById('descriptionField').value;
      const priorityVar = document.getElementById('priorityField').value;
      const statusVar= document.getElementById('statusField').value;
      const authorVar = document.getElementById('createdByField').value;
      const assignedVar = document.getElementById('assignedToField').value;
      const oReq = new XMLHttpRequest();
      oReq.addEventListener('load', function(){
          componentContext.getMongoData();
      });
      oReq.open('POST', "/addACard");
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
      <div id="bigk">
        <h1> ƁȉƓ ǨÅȠƁÅȠ</h1>
        {this.state.toggler ?
          <div id="inputfield">
            <button onClick={this.newCard}>CLOSE</button> <br/><br/>
            <form>
              Title:<br/>
              <input type="text" id="titleField" placeholder="Task"/><br/><br/>
              Description:<br/>
              <input type="text" id="descriptionField" placeholder="Details"/><br/><br/>
              Priority:<br/>
              <select id="priorityField">
                <option value="urgent">Urgent</option>
                <option value="necessary">Necessary</option>
                <option value="mustDo">Must Do</option>
              </select><br/><br/>
              Status:<br/>
              <select id="statusField">
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select><br/><br/>
              Created By:<br/>
              <input type="text" id="createdByField" placeholder="name"/><br/><br/>
              Assigned To:<br/>
              <input type="text" id="assignedToField" placeholder="name"/><br/><br/>
              <button onClick={this.addCard}>SUBMIT</button><br/><br/>
            </form>
          </div>: <div><button onClick={this.newCard}>NEW MEMO</button></div>} <br/>

        <div id="postContainer">
          <PostColumns data={this.state.ColData} updateCard={this.updateCard} deleteCard={this.deleteCard} colInfo={'TO DO'}/>
          <PostColumns data={this.state.ColDataTwo}  updateCard={this.updateCard} deleteCard={this.deleteCard} colInfo={'DOING'}/>
          <PostColumns data={this.state.ColDataThree} updateCard={this.updateCard} deleteCard={this.deleteCard} colInfo={'DONE'}/>
        </div>
           <br/><button onClick={this.seedIt}>SEED (TEST ONLY)</button>
           <input type="number" name="seedNothing" id="seedId" min="1" max="9" placeholder="0"/>
           <button onClick={this.removeItAll}>DROP (TEST ONLY)</button>
      </div>
    );
  };
};

/*===================================
=            PostColumns            =
===================================*/
class PostColumns extends React.Component {
  render() {
    // console.log("3 tracker",this.props);
    var parent = this;
    var theNode = this.props.data.map( function (passedData) {
      return (
        <PostItems {...passedData}
          updateCard={parent.props.updateCard}
          deleteCard={parent.props.deleteCard}
          getMongoData={parent.props.getMongoData}
          key={passedData._id}
        />
        )
    });
    return (
      <div id="list">
        <h1>{this.props.colInfo}</h1>
        { theNode }
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
  updateCard(){
    this.props.updateCard(this.state)
  }

  deleteCard(){
    this.props.deleteCard(this.state._id);
  }

  render() {
    return (
      <div
      className='theposts'

      id={this.state._id}>
        <h3>{this.state.title}</h3>
            {this.state.priority}<br/>

          <div className="buttonDiv">
            {/*<a className="updateButton" href={this.updateCard}>Update Status</a>*/}
            <button onClick={this.updateCard}>Update</button>
            <button onClick={this.deleteCard}>Delete</button>
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