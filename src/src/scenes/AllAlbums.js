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

export default class AllAlbums extends Component {
  state = { albums: [] };

  componentWillMount() {
    firebase
      .firestore()
      .collection("albums")
      .orderBy("createdDate", "desc")
      .limit(4)
      .onSnapshot((qs) => {
        const albums = [];
        qs.forEach((doc) => {
          console.log(doc.data());

          let album = doc.data();
          albums.push({
            key: doc.id,
            id: doc.id,
            ...album,
          });
        });

        this.setState({
          albums,
        });
      });
  }

  renderGalleryItem({ item, index }) {
    return (
      <TouchableOpacity
        key={item.key}
        style={{ margin: 12, width }}
        onPress={() => {
          firebase.analytics().logEvent("album_open", {});
          Actions.album_presenter({
            title: item.title,
            photos: item.photos,
            createdDate: item.createdDate,
          });
        }}
      >
        <ImageBackground
          source={{ uri: item.photos[0] }}
          style={{
            height: width / 2,
            width: width - 24,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              padding: 6,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Paragraph
              numberOfLines={1}
              style={{ fontWeight: "bold", marginRight: 3 }}
            >
              {item.photos.length}
            </Paragraph>
            <Icon color={colors.backround} name="image" />
          </View>
          <View
            style={{ backgroundColor: colors.textShadowInButton, padding: 6 }}
          >
            <Paragraph numberOfLines={2} style={{ fontWeight: "bold" }}>
              {item.title}
            </Paragraph>
          </View>
        </ImageBackground>
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
          renderItem={this.renderGalleryItem.bind(this)}
          data={this.state.albums}
          extraData={this.state}
          showsHorizontalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }
}
