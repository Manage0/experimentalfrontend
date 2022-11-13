import React, { useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Appbar, BottomNavigation } from "react-native-paper";
import News from "./News";
import Leaderboard from "./Leaderboard";
import Results from "./Results";
import Team from "./Team";
import colors from "./Colors";
import Live from "./Live";

const Main = () => {
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: "news", title: "Hírek", icon: "fire" },
    { key: "leaderboard", title: "Tabella", icon: "format-list-numbered" },
    { key: "results", title: "Mérkőzések", icon: "view-list" },
    { key: "team", title: "Csapat", icon: "account-group" },
  ]);

  const _renderScene = BottomNavigation.SceneMap({
    news: News,
    results: Results,
    leaderboard: Leaderboard,
    team: Team,
  });
  return (
    <View style={{ flex: 1 }}>
      <BottomNavigation
        shifting={false}
        activeColor={colors.menuTextLiveOptions}
        inactiveColor={colors.menuTextOtherOptions}
        navigationState={{ index, routes }}
        onIndexChange={(index) => setIndex(index)}
        renderScene={_renderScene}
        barStyle={{ backgroundColor: colors.menubackround }}
      />
    </View>
  );
};

export default Main;
