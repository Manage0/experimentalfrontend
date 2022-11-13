import React, { Component } from "react";
import {
  ScrollView,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  FlatList,
  WebView,
} from "react-native";
import {
  Appbar,
  Headline,
  Title,
  Caption,
  Paragraph,
  Divider,
  Subheading,
  IconButton,
  FAB,
  Button,
} from "react-native-paper";
import { StackActions } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
import VideoPlayer from "react-native-video-controls";
const VideoPresenter = ({ navigation }) => {
  const popAction = StackActions.pop(1);

  navigation.dispatch(popAction);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black", flexDirection: "column" }}
    >
      <VideoPlayer
        onBack={() => {
          popAction;
        }}
        source={{ uri: this.props.video }}
        navigator={this.props.navigator}
      />
    </SafeAreaView>
  );
};

// Later on in your styles..
var styles = {
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
};

export default VideoPresenter;
