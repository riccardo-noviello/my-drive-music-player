import React, { Component } from "react";
import { Text, View, Alert, StatusBar } from "react-native";
import Header from "./Header";
import AlbumArt from "./AlbumArt";
import TrackDetails from "./TrackDetails";
import SeekBar from "./SeekBar";
import Controls from "./Controls";
import Sound from "react-native-sound";

const SERVER_URL = "http://my-drive-player.herokuapp.com";

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paused: true,
      totalLength: 1,
      currentPosition: 0,
      selectedTrack: 0,
      selectedTrackObj: null,
      repeatOn: false,
      shuffleOn: false,
      sound: null,
      playDisabled: true,
      updateInterval: null
    };
  }

  setDuration(data) {
    this.setState({
      totalLength: Math.floor(data._duration)
    });
  }

  startInterval() {
    let interval = setInterval(
      () => this.updateCurrentTime(this.state.sound),
      300
    );
    this.setState({ updateInterval: interval });
  }

  stopInterval() {
    clearInterval(this.state.updateInterval);
    this.setState({ updateInterval: null });
  }

  updateCurrentTime(data) {
    if (data) {
      data.getCurrentTime(seconds => {
        this.setState({ currentPosition: Math.floor(seconds) });
      });
    }
  }

  seek(time) {
    console.log("seek called");
    time = Math.round(time);
    this.state.sound && this.state.sound.setCurrentTime(time);
    this.setState({
      currentPosition: time,
      paused: true
    });
  }

  onBack() {
    this.state.isChanging
      ? null
      : this.loadTrack(this.getTrack(), this.state.selectedTrack);

    let fn = () => {
      console.log("onBack");
      if (this.state.currentPosition < 10 && this.state.selectedTrack > 0) {
        this.state.sound && this.state.sound.setCurrentTime(0);
        this.setState({ isChanging: true });
        setTimeout(() => {
          this.setState({
            currentPosition: 0,
            paused: true,
            totalLength: 1,
            isChanging: false,
            selectedTrack: this.state.selectedTrack - 1,
            sound: null
          });
          this.loadTrack(this.getTrack(), this.state.selectedTrack);
        }, 0);
      } else {
        this.state.sound.setCurrentTime(0);
        this.setState({ currentPosition: 0 });
      }
    };

    this.stop(fn);
  }

  onForward() {
    this.state.isChanging
      ? null
      : this.loadTrack(this.getTrack(), this.state.selectedTrack);

    let fn = () => {
      console.log("onForward");
      if (this.state.selectedTrack < this.props.tracks.length - 1) {
        this.state.sound && this.state.sound.setCurrentTime(0);
        this.setState({ isChanging: true });
        setTimeout(() => {
          this.setState({
            currentPosition: 0,
            totalLength: 1,
            paused: true,
            isChanging: false,
            selectedTrack: this.state.selectedTrack + 1,
            sound: null
          });
          this.loadTrack(this.getTrack(), this.state.selectedTrack);
        }, 0);
      }
    };
    this.stop(fn);
  }

  loadTrack(track, selectedTrack) {
    // handle tracks not loaded in state yet
    if (!track || this.state.isChanging) {
      console.log("Track not available.");
      return;
    }

    // avoid duplicate calls to load track
    if (
      this.state.selectedTrack === selectedTrack &&
      this.state.sound != null
    ) {
      console.log("Track already loaded.");
      return;
    }

    console.log("Loading track:", track.title);

    // If the audio is a 'require' then the second parameter must be the callback.
    if (track.isRequire) {
      const sound = new Sound(SERVER_URL + track.audioUrl, error =>
        this.callback(error, sound)
      );
    } else {
      const sound = new Sound(
        SERVER_URL + track.audioUrl,
        track.basePath,
        error => this.callback(error, sound)
      );
    }
    this.setState({ isChanging: true });
  }

  callback(error, sound) {
    if (error) {
      console.log("Error playing ", sound);
      Alert.alert("error", JSON.stringify(error));
      return;
    }
    // Run optional pre-play callback
    //track.onPrepared && track.onPrepared(sound, component);
    this.setState({ sound: sound, playDisabled: false });
    this.setDuration(sound);

    console.log("Track loaded");
    this.play();
  }

  play() {
    if (this.state.sound) {
      console.log("playing");
      this.startInterval();
      this.setState({ paused: false });
      this.state.sound.play(() => {
        this.stopInterval();
        //this.setState({ currentPosition: 0 });
        this.setState({ paused: true });
        // play next
        this.onForward();
      });
    }
  }

  stop(fn) {
    console.log("stopping");
    if (!this.state.sound) {
      // already stopped
      fn.apply();
    } else {
      this.stopInterval();
      this.setState({ paused: true });
      this.state.sound.pause(() => {
        setTimeout(() => {
          // give it time to actually pause
          fn.apply();
        }, 200);
      });
    }
  }

  pause() {
    console.log("pausing");
    if (this.state.sound) {
      this.stopInterval();
      this.setState({ paused: true });
      this.state.sound.pause(() => {
        //  this.state.sound.release();
      });
    }
  }

  componentDidMount() {
    if (this.props.tracks.length < 1) {
      // wait a moment
      setTimeout(() => {
        console.log("waiting a sec to load ");
        this.loadTrack(this.getTrack(), this.state.selectedTrack);
      }, 2000);
    } else {
      this.state.isChanging;
      this.loadTrack(this.getTrack(), this.state.selectedTrack);
    }
  }

  getTrack() {
    console.log("Tracks: ", this.props.tracks[this.state.selectedTrack]);
    const track = this.props.tracks[this.state.selectedTrack];
    this.setState({ selectedTrackObj: track });
    return track;
  }

  render() {
    if (this.state.selectedTrackObj == null) {
      return (
        <View style={styles.container}>
          <StatusBar hidden={true} />
          <Header message="Loading From My Drive" />
          <TrackDetails title="loading..." artist="please wait" />
        </View>
      );
    } else {
      const { albumArtUrl, title, artist } = this.state.selectedTrackObj;
      return (
        <View style={styles.container}>
          <StatusBar hidden={true} />
          <Header message="Playing From My Drive" />
          <AlbumArt url={albumArtUrl} />
          <TrackDetails title={title} artist={artist} />
          <SeekBar
            onSeek={this.seek.bind(this)}
            trackLength={this.state.totalLength}
            onSlidingStart={() => this.setState({ paused: true })}
            currentPosition={this.state.currentPosition}
          />
          <Controls
            onPressRepeat={() =>
              this.setState({
                repeatOn: !this.state.repeatOn
              })
            }
            repeatOn={this.state.repeatOn}
            shuffleOn={this.state.shuffleOn}
            forwardDisabled={
              this.state.selectedTrack === this.props.tracks.length - 1
            }
            backDisabled={this.state.selectedTrack === 0}
            onPressShuffle={() =>
              this.setState({ shuffleOn: !this.state.shuffleOn })
            }
            onPressPlay={() => {
              this.play();
            }}
            onPressPause={() => {
              this.pause();
            }}
            onBack={this.onBack.bind(this)}
            onForward={this.onForward.bind(this)}
            paused={this.state.paused}
            playDisabled={this.state.playDisabled}
          />
        </View>
      );
    }
  }
}

const styles = {
  container: {
    flex: 1,
    // backgroundColor: "rgb(4,4,4)"
    backgroundColor: "#2c3e50"
  },
  audioElement: {
    height: 0,
    width: 0
  }
};
