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
import colors from "../Colors";

const { width, height } = Dimensions.get("window");

export default class AllNews extends Component {
  state = { posts: [] };

  async componentWillMount() {
    firebase
      .firestore()
      .collection("news")
      .orderBy("createdDate", "desc")
      .limit(4)
      .onSnapshot((qs) => {
        const upPosts = [];
        const posts = [];
        qs.forEach((doc) => {
          console.log(doc.data());
          let post = doc.data();
          if (post.type === "up") {
            upPosts.push({
              key: doc.id,
              id: doc.id,
              ...post,
            });
          } else {
            posts.push({
              key: doc.id,
              id: doc.id,
              ...post,
            });
          }
        });

        this.setState({
          posts,
          upPosts,
        });
      });
  }

  renderSlide({ item, index }) {
    return (
      <TouchableOpacity
        key={item.key}
        style={{ width, margin: 12 }}
        onPress={() => {
          firebase.analytics().logEvent("article_open", {});
          Actions.new_presenter({
            title: item.title,
            image: item.image,
            content: item.content,
          });
        }}
      >
        <ImageBackground
          source={{ uri: item.image }}
          style={{
            height: width / 2,
            width: width - 24,
            justifyContent: "flex-end",
          }}
        >
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
            style={{ borderRadius: 15, borderWidth: 2, margin: 12 }}
          >
            Vissza
          </Button>
        </View>
        <Divider />
        <FlatList
          renderItem={this.renderSlide.bind(this)}
          data={this.state.posts}
          extraData={this.state}
          showsHorizontalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }
}
