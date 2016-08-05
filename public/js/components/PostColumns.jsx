import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import PostItems from './PostItems.jsx';
/*===================================
=            PostColumns            =
===================================*/
class PostColumns extends React.Component {
  constructor(){
    super();
    // this.state = {
    //   toggler : false,
    //   ColData : [],
    //   ColDataTwo : [],
    //   ColDataThree : []
    // }
  };
  render() {
    var parent = this;
    var theNode = this.props.data.map( function (passedData) {
    return (
      <PostItems {...passedData} rightMove={parent.props.rightMove} leftMove={parent.props.leftMove}
      updateCard={parent.props.updateCard} deleteCard={parent.props.deleteCard}
      getMongoData={parent.props.getMongoData} key={passedData._id}/>
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

/*=====================================
=            myStateToTops            =
=====================================*/
const mapTheStateToProps = (mapState, ownProps) => {
    const stateData = mapState.reducer.toJS();
  return {
    // stateData : mapState.reducer.toJS();
    ColDataKey: stateData.ColData,
    ColDataTwoKey: stateData.ColDataTwo,
    ColDataThreeKey: stateData.ColDataThree,
    toggler: false,
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
)(PostColumns);
// export default BigKanban;
