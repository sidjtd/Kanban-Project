var Input = React.createClass({
  getInitialState: function() {
    return {typed: ''};
  },
  onBlur: function(event) {
    this.setState({typed: event.target.value});
  },
  render: function() {
    return <div>
        <input type="text" onBlur={this.onBlur.bind(this)}/>
        You typed: <code>{this.state.typed}</code>
      </div>
  }
});
// React.render(<Input/>, document.querySelector('div'));

export default Input;