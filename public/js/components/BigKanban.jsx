import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import PostColumns from './PostColumns.jsx';
// import styles from './BigKanban.scss';
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

  getMongoData(card){
    let parent = this;
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function () {
      let xhrData = JSON.parse(this.response)
      parent.setState({
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
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send();
  }

  updateCard(cardId, status) {
    if(status<3){
      let parent = this;
      const oReq = new XMLHttpRequest();
      oReq.addEventListener("load", function (){
        parent.getMongoData();
      });
      oReq.open("PUT", "/update");
      oReq.setRequestHeader("Content-Type", "application/json");
      oReq.send(JSON.stringify({id:cardId}));
    }
  }

  leftMove(cardId, status) {
    if(status>1){
      let parent = this;
      const oReq = new XMLHttpRequest();
      oReq.addEventListener("load", function (){
        parent.getMongoData();
      });
      oReq.open("PUT", "/lefter");
      oReq.setRequestHeader("Content-Type", "application/json");
      oReq.send(JSON.stringify({id:cardId}));
    }
  }

  rightMove(cardId, status) {
    if(status<3){
      let parent = this;
      const oReq = new XMLHttpRequest();
      oReq.addEventListener("load", function (){
        parent.getMongoData();
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
    var parent = this;
    const titleVar = document.getElementById('titleField').value;
    const descVar = document.getElementById('descriptionField').value;
    const priorityVar = document.getElementById('priorityField').value;
    const statusVar= document.getElementById('statusField').value;
    const authorVar = document.getElementById('createdByField').value;
    const assignedVar = document.getElementById('assignedToField').value;
    if(titleVar&&authorVar&&assignedVar){
      const oReq = new XMLHttpRequest();
      oReq.addEventListener('load', function(){
          parent.getMongoData();
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
    let parent = this;
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function (){
      parent.getMongoData();
    });
    oReq.open("DELETE", "/delete");
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send(JSON.stringify({id:cardId}));
  }

  removeItAll(cardId) {
    let parent = this;
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function (){
      parent.getMongoData();
    });
    oReq.open("DELETE", "/removeall");
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send();
  }

  seedIt(cardId) {
    console.log("Im in 1", cardId);
    let parent = this;
    const seedVar = document.getElementById('seedId').value;
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function (){
      console.log("Im in 2");
      parent.getMongoData();
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
            <PostColumns data={this.state.ColData} rightMove={this.rightMove} leftMove={this.leftMove}
            updateCard={this.updateCard} deleteCard={this.deleteCard} colInfo={'TO DO'}/>
            <PostColumns data={this.state.ColDataTwo} rightMove={this.rightMove} leftMove={this.leftMove}
            updateCard={this.updateCard} deleteCard={this.deleteCard} colInfo={'DOING'}/>
            <PostColumns data={this.state.ColDataThree} rightMove={this.rightMove} leftMove={this.leftMove}
            updateCard={this.updateCard} deleteCard={this.deleteCard} colInfo={'DONE'}/>
          </div>
        </div><br/>
      </div>
    );
  };
};

/*=====================================
=            myStateToTops            =
=====================================*/
const mapTheStateToProps = (mapState, ownProps) => {
  return {
    datMapper: mapState.reducer.toJS()
  }
}
const mapDispatchesToThoseProps = (leaveDispatchesToMe) => {
  return {
    itemSetDispatcher : (data) => {
      console.log(data,"possible state?")
      leaveDispatchesToMe({
        type : 'SET_ITEMS',
        data
      })
    }
  }
}
export default connect(
  mapTheStateToProps,
  mapDispatchesToThoseProps
)(BigKanban);
// export default BigKanban;
