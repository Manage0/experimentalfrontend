import React, { Component } from "react";
import { StackActions } from "@react-navigation/native";
import {
  ScrollView,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  FlatList,
} from "react-native";
import {
  Button,
  Appbar,
  Headline,
  Title,
  Caption,
  Paragraph,
  Divider,
  Subheading,
  IconButton,
  FAB,
} from "react-native-paper";
import Markdown, {
  getUniqueID,
  openUrl,
  hasParents,
} from "react-native-markdown-renderer";
import colors from "../Colors";
const { width, height } = Dimensions.get("window");

const rules = {
  heading1: (node, children, parent, styles) => (
    <Headline key={getUniqueID()}>{children}</Headline>
  ),
  heading2: (node, children, parent, styles) => (
    <Title key={getUniqueID()}>{children}</Title>
  ),
  heading3: (node, children, parent, styles) => (
    <Subheading key={getUniqueID()}>{children}</Subheading>
  ),

  text: (node, children, parent, styles) => {
    return (
      <Text
        key={node.key}
        style={{
          color: hasParents(parent, "link")
            ? colors.textColor
            : colors.textColor,
          textAlign: hasParents(parent, "heading1") ? "left" : "justify",
        }}
      >
        {node.content}
      </Text>
    );
  },
  link: (node, children, parent, styles) => (
    <Text
      key={getUniqueID()}
      style={{ color: colors.textColor, textDecorationLine: "underline" }}
      onPress={() => openUrl(node.attributes.href)}
    >
      {children}
    </Text>
  ),
};

const NewPresenter = ({ navigation }) => {
  const popAction = StackActions.pop(1);

  navigation.dispatch(popAction);

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
          onPress={() => popAction}
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
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 12 }}>
          <Markdown rules={rules}>{this.props.content}</Markdown>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewPresenter;
