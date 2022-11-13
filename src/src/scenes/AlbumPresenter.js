import React, { Component } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
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
import _ from "lodash";
import { Modal } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import moment from "moment";
import colors from "../Colors";

const AlbumPresenter = ({ navigation }, props) => {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(1);
  const [photos, setPhotos] = useState(
    _.map(props.photos, (url) => {
      return {
        key: url,
        url,
      };
    })
  );

  function renderPhoto({ item, index }) {
    return (
      <TouchableOpacity
        key={item.url}
        onPress={() => {
          this.setState({
            index,
            visible: true,
          });
        }}
      >
        <Image
          source={{ uri: item.url }}
          style={{
            width: width / 2 - 12,
            height: width / 2 - 12,
            margin: 6,
          }}
        />
        {/* <Paragraph>TEST</Paragraph> */}
      </TouchableOpacity>
    );
  }
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
            borderWidth: 2,
            margin: 12,
          }}
        >
          Vissza
        </Button>
      </View>
      <Divider />

      <FlatList
        ListHeaderComponent={() => {
          return (
            <View style={{ margin: 12 }}>
              <Title>{this.props.title}</Title>
              <Caption>
                {moment(this.props.createdDate).format("YYYY. MM. DD.")}
              </Caption>
            </View>
          );
        }}
        style={{ paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        windowSize={2}
        data={this.state.photos}
        extraData={this.state}
        renderItem={this.renderPhoto.bind(this)}
      />
      <Modal visible={this.state.visible} transparent={true}>
        <ImageViewer
          index={this.state.index}
          imageUrls={this.state.photos}
          renderFooter={() => {
            return (
              <SafeAreaView
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Button
                  icon="close"
                  color={colors.backround}
                  mode="outlined"
                  onPress={() => {
                    this.setState({
                      visible: false,
                    });
                  }}
                  style={{ backgroundColor: colors.textColor, margin: 12 }}
                >
                  Bezárás
                </Button>
              </SafeAreaView>
            );
          }}
          loadingRender={() => {
            return <ActivityIndicator color={colors.backround} />;
          }}
          enableSwipeDown
          onSwipeDown={() => {
            this.setState({
              visible: false,
            });
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default AlbumPresenter;
