import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
// import bootstrap from 'bootstrap';

const borderStyle = {
  border: '1px black dashed'
};

const formStyle = {
  width: 200,
  height: 150,
  border: '2px green dashed'
};

const imgStyle = {
  width: 100,
  height: 100,
  boderWidth: 2
}

const less20liStyle = {
  color: 'red'
}

const liStyle = {
  color: 'black'
}

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'https://api.github.com/users/',
      filter: '',
      text: '',
      login: null,
      id: null,
      avatar_url: null,
      name: null,
      fork: null,
      repos: [],
      tmpRepos: [],
      isGoing: false,
      checkbox: 'checkbox'
    }
  }

  // handleUnload(evt){
  //   console.log("evt:")
  //   return "ddd"
  // }

  // componentDidMount(){
  //   console.log("componentDidMount:")
  //   window.addEventListener("beforeunload", this.handleUnload)
  // }

  // componentWillUnmount(){
  //   console.log("componentWillUnmount:")
  //   window.removeEventListener("beforeunload", this.handleUnload)
  // }

  getUserName = (e) => {
    this.setState({ text: e.target.value });
  }

  handelInputboxChange = (e) => {
    this.setState({ filter: e.target.value });
  }

  getData = () => {
    //url = 'http://localhost:23772/candidates/GetCandidate/';   
    let url = this.state.url;
    axios.get(this.state.url + this.state.text).then((response) => {
      //console.log('GetData:', response);
      this.setState({
        id: response.data.id,
        login: response.data.login,
        avatar_url: response.data.avatar_url
      })

      url = this.state.url + this.state.text + '/repos';

      axios.get(url).then((response) => {
        console.log('Repos:', response.data);
        this.setState({
          repos: response.data,
          tmpRepos: response.data
        })
      }).catch((err) => {
        console.log(err);
      })

    }).catch((err) => {
      console.log(err);
    })
  }

  getRepos = () => {
    if (this.state.repos && this.state.filter !== '') {

      //console.log(this.state.filter, this.state.repos.length);
      let result = [];
      // result = this.state.repos.map((cur, idx) => {
      //   if (this.state.repos[idx].name === this.state.filter) {
      //     console.log(cur);
      //   }
      // })

      for (let i = 0; i < this.state.repos.length; i++) {
        if (this.state.repos[i].name.includes(this.state.filter)) {
          result.push(this.state.repos[i]);
        }
      }
      //console.log('GetRepos result:', result);
      this.setState({
        repos: result
      })
    } else {
      let result = this.state.tmpRepos;
      this.setState({
        repos: result
      })
    }
  }

  hadleCheckboxChange = (e) => {

    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    //console.log('handle checkbox', name, value);

    if (value) {
      if (this.state.repos) {
        let result = [];
        for (let i = 0; i < this.state.repos.length; i++) {
          if (this.state.repos[i].forks_count >= 20) {
            result.push(this.state.repos[i]);
          }
        }

        this.setState({
          isGoing: value,
          repos: result
        })
      } else {
        let result = this.state.tmpRepos;
        //console.log('t1:', result);
        this.setState({
          isGoing: value,
          repos: result
        })
      }

    } else {
      let result = this.state.tmpRepos;
      //console.log('t2:', result);
      this.setState({
        isGoing: value,
        repos: result
      })
    }
  }

  render() {

    let result = null;

    if (this.state.repos) {
      result = this.state.repos.map((cur, idx) => {
        return (<div key={idx} name="這是專案內容">
          <form style={formStyle} >
            <li style={cur.forks_count < 20 ? less20liStyle : liStyle}><a>Name:{cur.name}</a></li>
            <li style={cur.forks_count < 20 ? less20liStyle : liStyle}><a>Fork count:{cur.forks_count}</a></li>
          </form>
          <br />
        </div>)
      })
    }

    return (
      <div>
        <div name='這是查詢區塊'>
          <input type='text' onChange={this.getUserName} />
          <button onClick={this.getData}>查詢</button>
          <br />
          <input type="checkbox" checked={this.state.isGoing} onChange={this.hadleCheckboxChange} /> <span>不顯示Fork數{'<'}20</span>
        </div>
        <br />
        <div width='200' height='100' style={borderStyle}>
          <h1>基本資料：</h1>
          <form>
            <li>Login:{this.state.login}</li>
            <li>ID:{this.state.id}</li>
            <img style={imgStyle} src={this.state.avatar_url} alt="這是頭像" />
          </form>
          <br />
          <input type="text" onChange={this.handelInputboxChange} />
          <button onClick={this.getRepos}>專案名稱</button>
        </div>
        <h1>專案列表：</h1>
        {result}
      </div>)
  }
}

ReactDOM.render(
  <Counter name="Testing props!" />
  , document.getElementById('app'));
