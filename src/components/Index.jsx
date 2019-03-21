import React, { Component, Fragment, useState, useEffect, useRef } from 'react';
import IO from 'socket.io-client';

// Create Store
const HistoryContext = React.createContext({
  history: [],
  addNewMsg: () => { }
});

// Utils
const timeFormat = (time) => {
  const date = new Date(time);
  const _num = (n) => n < 10 ? `0${n}` : n;
  let month = date.getMonth() + 1;
  return `${_num(month)}/${_num(date.getDate())} 
  ${_num(date.getHours())}:${_num(date.getMinutes())}`;
};

const { Provider, Consumer } = HistoryContext;

const User = (props) => {
  const ref = useRef(null);
  const [msg, changeMsg] = useState('');
  const { name, history, addNewMsg } = props;
  useEffect(() => {
    const { current } = ref;
    setTimeout(() => current.scrollTo(0, current.scrollHeight), 100);
  });
  return (
    <div className="container">
      <div className="title">
        <i className="icon icon-avatar" />
        <div className="right">
          <span><i className="icon icon-bar" /></span>
          <span><i className="icon icon-frame" /></span>
          <span><i className="icon icon-close" /></span>
        </div>
      </div>
      <div className="avatar">
        <span className="icon icon-avatar" />
        <span>{name}</span>
      </div>
      <div className="content" ref={ref}>
        <ul>
          {
            history.map((his, index) =>
              (<li key={`historyKey->${index}`}
                className={his.sender == name ? 'self' : ''}>
                <span className="icon icon-avatar" />
                <div className="msgContent">
                  <span className="arrow" />
                  <p>{timeFormat(his.time)}</p>
                  <div>{his.msg}</div>
                </div>
              </li>))
          }
        </ul>
      </div>
      <div className="sendBar">
        <p><textarea value={msg} onChange={(e) => {
          e.persist(); changeMsg(e.target.value);
        }} /></p>
        <button onClick={() => addNewMsg({ sender: name, msg }, () => changeMsg(''))}>
          <i className="icon icon-paper" />
        </button>
      </div>
    </div>
  );
};

const Sok = IO('localhost:3001');
const App = () => {
  const [history, change] = useState([]);
  Sok.on('message', (his) => {
    change(his);
  });
  Sok.on('new message', his => {
    change(history.concat([his]));
  });
  return (
    <Provider value={{
      history,
      addNewMsg: ({ sender, msg }, cb) => {
        Sok.emit('chat message', { sender, msg });
        cb();
      }
    }}>
      <Fragment>
        <Consumer>
          {param => <User {...param} name="A" />}
        </Consumer>
        <Consumer>
          {param => <User {...param} name="B" />}
        </Consumer>
      </Fragment>
    </Provider>
  );
};

// class App extends Component {
//   constructor() {
//     super();
//     this.addNewMsg = ({ sender, msg }, cb) => {
//       this.state.socket.emit('chat message', { sender, msg });
//       cb();
//     };
//     this.state = {
//       socket: IO('localhost:3001'),
//       history: [],
//       addNewMsg: this.addNewMsg
//     };
//   }
//   componentDidMount() {
//     this.state.socket.on('message', (history) => this.setState({ history }));
//     this.state.socket.on('new message', (his) =>
//       this.setState({ history: [...this.state.history, his] })
//     );
//   }
//   render() {
//     const { history,addNewMsg } = this.state;
//     return (<Provider value={{ history, addNewMsg }}>
//       <Fragment>
//         <Consumer>
//           {param => <User {...param} name="A" />}
//         </Consumer>
//         <Consumer>
//           {param => <User {...param} name="B" />}
//         </Consumer>
//       </Fragment>
//     </Provider>);
//   }
// };

export default App;
