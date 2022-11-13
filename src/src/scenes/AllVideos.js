import React, { Component } from "react";
import {
  Text,
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Divider, Button, Paragraph } from "react-native-paper";
import { StackActions } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

import colors from "../Colors";

const { width, height } = Dimensions.get("window");

export default class AllVideos extends Component {
  state = { videos: [] };

  componentWillMount() {
    firebase
      .firestore()
      .collection("videos")
      .orderBy("createdDate", "desc")
      .onSnapshot((qs) => {
        const videos = [];
        qs.forEach((doc) => {
          console.log(doc.data());

          let video = doc.data();
          videos.push({
            key: doc.id,
            id: doc.id,
            ...video,
          });
        });

        this.setState({
          videos,
        });
      });
  }

  renderVideo({ item, index }) {
    return (
      <TouchableOpacity
        key={item.key}
        style={{ backgroundColor: colors.textColor, margin: 12 }}
        onPress={() => {
          firebase.analytics().logEvent("video_open", {});
          Actions.video_presenter({ video: item.video });
        }}
      >
        <ImageBackground
          source={{ uri: item.img }}
          style={{
            color: colors.textColor,
            height: width / 2,
            width: width - 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="play-circle-outline" color={colors.textColor} size={48} />
        </ImageBackground>
        <View
          style={{ backgroundColor: colors.textShadowInButton, padding: 6 }}
        >
          <Paragraph numberOfLines={2} style={{ fontWeight: "bold" }}>
            {item.title}
          </Paragraph>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.backround,
          flexDirection: "column",
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
        <Divider />
        <FlatList
          renderItem={this.renderVideo.bind(this)}
          data={this.state.videos}
          extraData={this.state}
          showsHorizontalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }
}
