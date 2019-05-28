import React, { Component } from "react";
import "./App.css";
let defaultStyle = {
  color: "#84dab4"
};
let fakeServerData = {
  user: {
    name: "David",
    playlists: [
      {
        name: "Metal",
        songs: [
          { name: "Liege of Inveracity", duration: "1400" },
          { name: "Let the Knife do the talking", duration: "1030" },
          { name: "Shallow", duration: "1002" }
        ]
      },
      {
        name: "Jazz",
        songs: [
          { name: "Island Feeling", duration: "2230" },
          { name: "Outlier", duration: "2056" },
          { name: "Lingus", duration: "2444" }
        ]
      },
      {
        name: "Classical",
        songs: [
          { name: "Arabesque no. 1", duration: "3264" },
          { name: "Claire de Lune", duration: "3284" },
          { name: "Moonlight Sonata", duration: "7634" }
        ]
      }
    ]
  }
};
class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
        <h2>{this.props.playlists.length} Playlists</h2>
      </div>
    );
  }
}
class HoursCounter extends Component {
  render() {
    let totalDuration = this.props.playlists.reduce((s, playlist) => {
      return (
        s +
        playlist.songs.reduce((c, x) => {
          return c + parseInt(x.duration, 10);
        }, 0)
      );
    }, 0);
    return (
      <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
        <h2>
          {totalDuration / 60 > 1
            ? Math.round(totalDuration / 60) + " minutes"
            : totalDuration + " seconds"}
        </h2>
      </div>
    );
  }
}
class Filter extends Component {
  render() {
    return (
      <div>
        <img />
        <input
          type="text"
          onKeyUp={event => this.props.onTextEntry(event.target.value)}
        />
      </div>
    );
  }
}
class Playlist extends Component {
  render() {
    return (
      <div
        style={{
          ...defaultStyle,
          display: "inline-block",
          width: "25%",
          marginTop: "25px"
        }}
      >
        <img src={this.props.playlist.imageURL} style={{ width: "100px" }} />
        <h3>{this.props.playlist.name}</h3>
        <ul>
          {this.props.playlist.songs.map(song => (
            <li>{song.name}</li>
          ))}
        </ul>
      </div>
    );
  }
}
////////////////gonna do something horrible :(
class App extends Component {
  constructor() {
    super();
    this.state = { serverData: {}, filterString: "" };
  }
  componentDidMount() {
    let accessToken = new URLSearchParams(window.location.search).get(
      "access_token"
    );
    if (!accessToken) return;
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + accessToken }
    })
      .then(response => response.json())
      .then(data => this.setState({ user: { name: data.display_name } }));
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: "Bearer " + accessToken }
    })
      .then(response => response.json())
      .then(data =>
        this.setState({
          playlists: data.items.map(item => {
            return { name: item.name, imageURL: item.images[0].url, songs: [] };
          })
        })
      );
  }
  render() {
    let filteredPlaylist =
      this.state.user && this.state.playlists
        ? this.state.playlists.filter(playlist =>
            playlist.name
              .toLowerCase()
              .includes(this.state.filterString.toLowerCase())
          )
        : [];
    return (
      <div className="App">
        {this.state.user ? (
          <div>
            <h1 style={defaultStyle}>{this.state.user.name}'s Playlist</h1>
            <div>
              <PlaylistCounter playlists={filteredPlaylist} />

              <HoursCounter playlists={filteredPlaylist} />

              <Filter
                onTextEntry={text => this.setState({ filterString: text })}
              />
              {filteredPlaylist.map(playlist => (
                <Playlist playlist={playlist} />
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              window.location = "http://localhost:8888/login";
            }}
            style={{
              backgroundColor: "green",
              padding: "20px",
              fontSize: "50px",
              marginTop: "25px"
            }}
          >
            Sign in with Spotify
          </button>
        )}
      </div>
    );
  }
}
export default App;
