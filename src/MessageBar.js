import React from 'react';

class MessageBar extends React.Component {
   render() {
       return(
        <div className = "messageBar">
            <input placeholder='Enter Message Here' onChange={this.props.handleChange}/>
        </div>
       )
   } 
}

export default MessageBar;