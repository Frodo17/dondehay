import React, { Component } from "react";
import {
  View,
  Image,
  Linking,
  BackHandler,
  ScrollView,
  Alert
} from "react-native";
import { Text, Menu, Divider, Switch } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  exit_function = () => {
    Alert.alert(
      "Alerta",
      "Usted esta solicitando salir de ¡Donde Hay!. ¿Desea continuar con la operación y salir de la aplicación?",
      [
        {
          text: "No",
          style: "cancel"
        },
        { text: "Sí", onPress: () => BackHandler.exitApp() }
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <ScrollView style={{ backgroundColor: "white" }}>
        <Image
          source={require("../assets/images/menuheader.jpg")}
          style={{ height: 115, width: "100%" }}
        />
        <Menu.Item
          onPress={() => this.props.navigation.navigate("Finder")}
          title="Localizador"
          icon="search"
        />
        <Menu.Item
          onPress={() => this.props.navigation.navigate("BarScan")}
          title="Chequeaor de Precios"
          icon={() => (
            <MaterialCommunityIcons name={"barcode-scan"} size={25} />
          )}
        />

        <Menu.Item
          onPress={() => this.props.navigation.navigate("Favoritos")}
          title="Favoritos"
          icon="favorite"
        />
        <Divider />
        <View style={{ flexDirection: "row", paddingRight: 3 }}>
          <View style={{ width: "80%" }}>
            <Menu.Item
              onPress={() => this.props.navigation.navigate("Dpa")}
              title="Provincias"
              icon="map"
            />
          </View>
          <View
            style={{
              width: "20%",
              alignContent: "center",
              justifyContent: "center"
            }}
          >
            {this.props.screenProps.dpaSelected.length > 0 ? (
              <MaterialCommunityIcons name="filter" color={"green"} size={20} />
            ) : null}
          </View>
        </View>
        <View style={{ flexDirection: "row", paddingRight: 3 }}>
          <View style={{ width: "80%" }}>
            <Menu.Item
              onPress={() => {
                this.props.screenProps.setPreciosVisible(true);
                this.props.navigation.closeDrawer();
              }}
              title="Filtro de Precios"
              icon="attach-money"
            />
          </View>
          <View
            style={{
              width: "20%",
              alignContent: "center",
              justifyContent: "center"
            }}
          >
            {this.props.screenProps.filterMin > 0 ||
            this.props.screenProps.filterMax > 0 ? (
              <MaterialCommunityIcons name="filter" color={"green"} size={20} />
            ) : null}
          </View>
        </View>
        <View style={{ flexDirection: "row", paddingRight: 3 }}>
          <View style={{ width: "80%" }}>
            <Menu.Item
              onPress={() => {}}
              title="Productos Rebajados"
              icon={() => (
                <MaterialCommunityIcons name={"octagram"} size={25} />
              )}
            />
          </View>
          <View
            style={{
              width: "20%",
              alignContent: "center",
              justifyContent: "center"
            }}
          >
            <Switch
              value={this.props.screenProps.rebajados}
              onValueChange={() =>
                this.props.screenProps.setRebajados(
                  !this.props.screenProps.rebajados
                )
              }
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", paddingRight: 3 }}>
          <View style={{ width: "80%" }}>
            <Menu.Item
              onPress={() => {}}
              title="Tiendas en MLC"
              icon={() => (
                <MaterialCommunityIcons name={"shopping"} size={25} />
              )}
            />
          </View>
          <View
            style={{
              width: "20%",
              alignContent: "center",
              justifyContent: "center"
            }}
          >
            <Switch
              value={this.props.screenProps.isMLC}
              onValueChange={() => {
                this.props.screenProps.setMLC(!this.props.screenProps.isMLC);
                this.props.screenProps.setFilterUpdated(true);
              }}
            />
          </View>
        </View>
        <Divider />
        <Menu.Item
          onPress={() =>
            Linking.openURL(
              'mailto:"atencionalcliente@cimex.com.cu"?subject=Reporte desde Donde Hay'
            )
          }
          title="Atención al Cliente"
          icon="email"
        />
        <Menu.Item
          onPress={() => Linking.openURL(`tel:80000724`)}
          title="Número Único"
          icon="call"
        />
        <Menu.Item
          onPress={() => Linking.openURL("http://www.cimex.cu")}
          title="Sitio Web"
          icon={() => <MaterialCommunityIcons name={"web"} size={25} />}
        />
        <Divider />
        <Menu.Item
          onPress={() => this.props.navigation.navigate("Info")}
          title="Información al Usuario"
          icon="info"
        />
        <Menu.Item
          onPress={() => this.exit_function()}
          title="Salir"
          icon="exit-to-app"
        />
      </ScrollView>
    );
  }
}
