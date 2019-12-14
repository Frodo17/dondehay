/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { createAppContainer } from "react-navigation";
import AsyncStorage from "AsyncStorage";
import Axios from "axios";
import { Provider as PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SplashScreen from "./src/components/splash";

import AppDrawerNavigator from "./src/router";

const AppContainer = createAppContainer(AppDrawerNavigator);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //apiurl: "http://10.0.3.2:8000/api/",
      //apiurl: "http://192.168.43.102:8000/api/",
      apiurl: "http://dhayservice.cimex.com.cu:1703/api/",
      favoritos: [],
      scanned: "",
      productSelected: [],
      storeSlected: [],
      dpaSelected: [],
      filterMin: "",
      filterMax: "",
      modalPrecios: false,
      primaryColor: "#0D4D29",
      rebajados: false,
      isMLC: false,
      isLoading: true,
      appTitle: "¡Donde Hay!",
      filterUpdated: false,
      fromSearch: false,
      newUpdate: false,
      newVersion: "",
      currentVersion: "1.4.191214",
      hashApklis: "",
      downloadURL: ""
    };
  }

  async componentDidMount() {
    const data = await this.loadTime();
    if (data !== null) {
      this.setState({ isLoading: false });
    }

    this.loadPriceFilter();
    this.loadDpaFilter();
    this.loadFavoritos();
    this.getHashApklis();
  }

  loadFavoritos = async () => {
    try {
      const MisFavoritos = await AsyncStorage.getItem("@Favoritos");

      if (MisFavoritos !== null) {
        // We have data!!
        favArray = JSON.parse(MisFavoritos);

        this.setFavorito(favArray);
      }
    } catch (error) {
      alert(error);
    }
  };

  loadPriceFilter = async () => {
    try {
      const PriceMin = await AsyncStorage.getItem("@PriceMin");
      const PriceMax = await AsyncStorage.getItem("@PriceMax");

      if (PriceMin !== null) {
        // We have data!!
        _PriceMin = JSON.parse(PriceMin);
        this.setFilterMin(_PriceMin);
      }

      if (PriceMax !== null) {
        // We have data!!
        _PriceMax = JSON.parse(PriceMax);
        this.setFilterMax(_PriceMax);
      }
    } catch (error) {
      alert(error);
    }
  };

  loadDpaFilter = async () => {
    try {
      const MisDpa = await AsyncStorage.getItem("@Dpa");

      if (MisDpa !== null) {
        // We have data!!
        dpaArray = JSON.parse(MisDpa);
        this.setDpaSelected(dpaArray);
      }
    } catch (error) {
      alert(error);
    }
  };

  async getHashApklis() {
    Axios({
      method: "get",
      url:
        "https://api.apklis.cu/v2/application/?package_name=com.datacimex.dondehay",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      timeout: 10000
    })
      .then(response => {
        this.setState({
          hashApklis: response.data.results[0].last_release.sha256
        });
        this.getUrlApklis();
      })
      .catch(err => {
        null;
      });
  }

  async getUrlApklis() {
    const time = await this.time2fetch();
    if (time !== null) {
      Axios({
        method: "post",
        url: "https://api.apklis.cu/v2/release/get_url/",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        data: {
          release: this.state.hashApklis
        },
        timeout: 10000
      })
        .then(response => {
          this.setState({
            downloadURL: response.data.url
          });
        })
        .catch(err => {
          null;
        });
    }
  }

  time2fetch = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve("result");
      }, 1000)
    );
  };

  setFavorito = favoritos => {
    this.setState({ favoritos: favoritos });
  };

  setScanned = scanned => {
    this.setState({ scanned: scanned });
  };

  setProductSelected = productSelected => {
    this.setState({ productSelected: productSelected });
  };

  setStoreSelected = storeSelected => {
    this.setState({ storeSelected: storeSelected });
  };

  setDpaSelected = dpaSelected => {
    this.setState({ dpaSelected: dpaSelected });
  };

  setFilterMin = filterMin => {
    this.setState({ filterMin: filterMin });
  };

  setFilterMax = filterMax => {
    this.setState({ filterMax: filterMax });
  };

  setPreciosVisible = modalPrecios => {
    this.setState({ modalPrecios: modalPrecios });
  };

  setRebajados = rebajados => {
    this.setState({ rebajados: rebajados });
  };

  setMLC = isMLC => {
    this.setState({ isMLC: isMLC });
  };

  setFilterUpdated = filterUpdated => {
    this.setState({ filterUpdated: filterUpdated });
  };

  setFromSearch = fromSearch => {
    this.setState({ fromSearch: fromSearch });
  };

  setNewUpdate = newUpdate => {
    this.setState({ newUpdate: newUpdate });
  };

  setNewVersion = newVersion => {
    this.setState({ newVersion: newVersion });
  };

  loadTime = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve("result");
      }, 2000)
    );
  };

  async time2load() {
    const data = await this.loadTime();

    if (data !== null) {
      this.setState({ isLoading: false });
    }
  }

  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }

    return (
      <PaperProvider
        settings={{
          icon: props => <MaterialCommunityIcons {...props} />
        }}
      >
        <AppContainer
          screenProps={{
            ...this.state,
            setFavorito: this.setFavorito,
            setScanned: this.setScanned,
            setProductSelected: this.setProductSelected,
            setStoreSelected: this.setStoreSelected,
            setDpaSelected: this.setDpaSelected,
            setFilterMin: this.setFilterMin,
            setFilterMax: this.setFilterMax,
            setPreciosVisible: this.setPreciosVisible,
            setRebajados: this.setRebajados,
            setMLC: this.setMLC,
            setFilterUpdated: this.setFilterUpdated,
            setFromSearch: this.setFromSearch,
            setNewUpdate: this.setNewUpdate,
            setNewVersion: this.setNewVersion
          }}
        />
      </PaperProvider>
    );
  }
}
