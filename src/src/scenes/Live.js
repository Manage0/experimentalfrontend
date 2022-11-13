import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
//import YouTube from "react-native-youtube";
//some ViewProptypes error
import colors from "../Colors";
import { Button } from "react-native-paper";
import { StackActions } from "@react-navigation/native";
import Colors from "react-native/Libraries/NewAppScreen/components/Colors";

export default class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      status: "",
      quality: "",
      error: "",
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.backround,
          colors: colors.textColor,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Button
            icon="chevron-left"
            color={colors.textColor}
            mode="outlined"
            onPress={() => Actions.pop()}
            style={{
              borderColor: colors.textColor,
              borderRadius: 15,
              borderWidth: 2,
              margin: 12,
            }}
          >
            Vissza
          </Button>
        </View>
        <View style={{ color: colors.textColor }}></View>
        {/*<YouTube
          apiKey="AIzaSyAfAbNuxcf18NPvOupZh5ozFFY8aa-WxTw"
          videoId="gKY0KxRpXao" // The YouTube video ID
          play // control playback of video with true/false
          fullscreen={false} // video should play in fullscreen or inline
          loop={false} // control whether the video should loop when ended
          onReady={(e) => this.setState({ isReady: true })}
          onChangeState={(e) => this.setState({ status: e.state })}
          onChangeQuality={(e) => this.setState({ quality: e.quality })}
          onError={(e) => this.setState({ error: e.error })}
          style={styles.youtube}
        />*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  youtube: {
    alignSelf: "stretch",
    height: 500,
  },
});
