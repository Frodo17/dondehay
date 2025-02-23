import React, { Component } from "react";
import { StyleSheet, Image, StatusBar, View } from "react-native";
import { UIActivityIndicator } from "react-native-indicators";
import { Text, Paragraph } from "react-native-paper";

export default class SplashScreen extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#0D4D29" barStyle="light-content" />
        <View style={styles.logoContainer}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require("../assets/images/app-icon.png")}
          ></Image>
        </View>
        <View style={styles.indicatorStyle}>
          <UIActivityIndicator color="#00793C" />
        </View>
        <View style={styles.powerbyStyle}>
          <Text note style={styles.powerbyTextStyle}>
            Datacimex
          </Text>
          <Text note style={styles.powerbyTextStyle}>
            2019
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  },
  logo: {
    marginTop: 20,
    height: 100,
    width: 100
  },
  indicatorStyle: {
    padding: 20,
    marginBottom: 40,
    justifyContent: "flex-start"
  },
  powerbyStyle: {
    padding: 20,
    marginBottom: 40,
    justifyContent: "flex-start"
  },
  powerbyTextStyle: {
    alignContent: "center",
    alignItems: "center",
    textAlign: "center"
  }
});
