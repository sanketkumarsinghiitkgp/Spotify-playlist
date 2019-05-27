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
      <div style={{ ...defaultStyle, display: "inline-block", width: "25%" }}>
        <img />
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
    this.setState({ serverData: fakeServerData });
    this.setState({ filterString: "" });
  }
  render() {
    let filteredPlaylist = this.state.serverData.user
      ? this.state.serverData.user.playlists.filter(playlist =>
          playlist.name
            .toLowerCase()
            .includes(this.state.filterString.toLowerCase())
        )
      : [];
    return (
      <div className="App">
        {this.state.serverData.user ? (
          <div>
            <h1 style={defaultStyle}>
              {this.state.serverData.user.name}'s Playlist
            </h1>

            <PlaylistCounter playlists={filteredPlaylist} />
            <HoursCounter playlists={filteredPlaylist} />
            <Filter
              onTextEntry={text => this.setState({ filterString: text })}
            />
            {filteredPlaylist.map(playlist => (
              <Playlist playlist={playlist} />
            ))}
          </div>
        ) : (
          <h1 style={defaultStyle}>Hi! Your Playlist is loading</h1>
        )}
      </div>
    );
  }
}
export default App;
