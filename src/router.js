import React, { Component } from "react";
import { Dimensions } from "react-native";
import { createDrawerNavigator } from "react-navigation";

import Finder from "./components/finder";
import FavPage from "./components/FavPage";
import BarScan from "./components/barscan";
import DhayStores from "./components/storesPage";
import MapPage from "./components/MapPage";
import DpaFilter from "./components/dpaFilter";
import SideBar from "./components/SideBar";
import InfoPage from "./components/infoPage";

const AppDrawerNavigator = createDrawerNavigator(
  {
    Finder: Finder,
    Favoritos: {
      screen: FavPage,
      navigationOptions: ({ navigation }) => ({
        drawerLockMode: "locked-closed"
      })
    },
    BarScan: BarScan,
    Stores: {
      screen: DhayStores,
      navigationOptions: ({ navigation }) => ({
        drawerLockMode: "locked-closed"
      })
    },
    Maps: {
      screen: MapPage,
      navigationOptions: ({ navigation }) => ({
        drawerLockMode: "locked-closed"
      })
    },
    Dpa: {
      screen: DpaFilter,
      navigationOptions: ({ navigation }) => ({
        drawerLockMode: "locked-closed"
      })
    },
    SideBar: SideBar,
    Info: {
      screen: InfoPage,
      navigationOptions: ({ navigation }) => ({
        drawerLockMode: "locked-closed"
      })
    }
  },
  {
    contentComponent: props => <SideBar {...props} />,
    initialRouteName: "Finder"
  }
);

export default AppDrawerNavigator;
