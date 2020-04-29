import React, { Component } from "react";

import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const Controls = ({
  paused,
  shuffleOn,
  repeatOn,
  onPressPlay,
  onPressPause,
  onBack,
  onForward,
  onPressShuffle,
  onPressRepeat,
  forwardDisabled,
  backDisabled,
  playDisabled
}) => (
  <View style={styles.container}>
    <TouchableOpacity activeOpacity={0.0} onPress={onPressShuffle}>
      <Image
        style={[styles.secondaryControl, shuffleOn ? [] : styles.off]}
        source={require("../img/ic_shuffle_white.png")}
      />
    </TouchableOpacity>
    <View style={{ width: 40 }} />
    <TouchableOpacity onPress={onBack} disabled={playDisabled}>
      <Image
        style={[backDisabled && { opacity: 0.3 }]}
        source={require("../img/ic_skip_previous_white_36pt.png")}
      />
    </TouchableOpacity>
    <View style={{ width: 20 }} />
    {!paused ? (
      <TouchableOpacity onPress={onPressPause} disabled={playDisabled}>
        <View style={[(playDisabled && { opacity: 0.3 }) || styles.playButton]}>
          <Image source={require("../img/ic_pause_white_48pt.png")} />
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={onPressPlay} disabled={playDisabled}>
        <View style={[(playDisabled && { opacity: 0.3 }) || styles.playButton]}>
          <Image source={require("../img/ic_play_arrow_white_48pt.png")} />
        </View>
      </TouchableOpacity>
    )}
    <View style={{ width: 20 }} />
    <TouchableOpacity
      onPress={onForward}
      disabled={forwardDisabled || playDisabled}
    >
      <Image
        style={[forwardDisabled && { opacity: 0.3 }]}
        source={require("../img/ic_skip_next_white_36pt.png")}
      />
    </TouchableOpacity>
    <View style={{ width: 40 }} />
    <TouchableOpacity activeOpacity={0.0} onPress={onPressRepeat}>
      <Image
        style={[styles.secondaryControl, repeatOn ? [] : styles.off]}
        source={require("../img/ic_repeat_white.png")}
      />
    </TouchableOpacity>
  </View>
);

export default Controls;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8
  },
  playButton: {
    height: 72,
    width: 72,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 72 / 2,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryControl: {
    height: 18,
    width: 18
  },
  off: {
    opacity: 0.3
  }
});
