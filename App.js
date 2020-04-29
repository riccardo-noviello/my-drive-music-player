import React, { Component } from "react";
import Player from "./components/Player";
import Login from "./components/Login";

export const TRACKS = [
  {
    title: "Track 1",
    artist: "Test 1",
    albumArtUrl: "https://picsum.photos/200/300/?random",
    audioUrl:
      "https://freemusicarchive.org/music/download/b95ecf581f5b7c6d3237bfb91c6652aff29d4cad"
  },
  {
    title: "Track 2",
    artist: "Test 2",
    albumArtUrl: "https://picsum.photos/200/300/?random",
    audioUrl:
      "https://freemusicarchive.org/music/download/bccecf494865a85a1878b619249732eff8c69a4d"
  }
];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      isLoggedIn: false,
      loginUrl: "",
      userId: "",
      token: ""
    };
  }

  componentDidMount() {
    console.log("Fetching login");
    fetch("http://my-drive-player.herokuapp.com/auth")
      .then(response => response.text())
      .then(responseJson => {
        this.setState({ loginUrl: responseJson });
      })
      .catch(error => {
        console.error(error);
      });
  }

  fetchList(userId, token) {
    console.log("Fetching list of tracks");
    console.log(userId);
    console.log(token);
    fetch(
      "http://my-drive-player.herokuapp.com/list?userId=" +
        userId +
        "&token=" +
        token
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ tracks: responseJson, isLoggedIn: true });
      })
      .catch(error => {
        console.error(error);
      });
  }

  getLoginScreen() {
    console.log("rendering login screen");
    return (
      <Login
        onLoginCompletion={this.fetchList.bind(this)}
        loginUrl={this.state.loginUrl}
      />
    );
  }

  getPlayer() {
    console.log("rendering player");
    return <Player tracks={this.state.tracks} />;
  }
  render() {
    return this.state.isLoggedIn ? this.getPlayer() : this.getLoginScreen();
  }
}
