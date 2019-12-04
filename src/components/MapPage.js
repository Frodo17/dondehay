import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  Modal,
  Alert,
  WebView
} from "react-native";
import {
  Appbar,
  Card,
  Text,
  Button,
  Title,
  FAB,
  Divider
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationEvents } from "react-navigation";
import { ScrollView } from "react-native-gesture-handler";
import { BallIndicator } from "react-native-indicators";

export default class MapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      primaryColor: "#0D4D29",
      coordinates: [],
      mapUpdated: false,
      storeSelected: this.props.screenProps.storeSelected,
      productSelected: this.props.screenProps.productSelected,
      modalGeoVisible: false
    };
  }

  setGeoVisible(visible) {
    this.setState({ modalGeoVisible: visible });
  }

  render() {
    const indicatorFetch = (
      <View style={{ backgroundColor: "wite" }}>
        <BallIndicator color={this.state.primaryColor} />
      </View>
    );

    return (
      <View>
        <NavigationEvents
          onDidFocus={payload => {
            this.props.screenProps.setFromSearch(false);
          }}
          onDidBlur={payload => {
            this.setState({ mapUpdated: false });
          }}
        />
        <Appbar.Header style={{ backgroundColor: this.state.primaryColor }}>
          <Appbar.Action
            icon="arrow-back"
            onPress={() => this.props.navigation.navigate("Stores")}
          />
          <Appbar.Content title="¡Donde Hay!" subtitle="Localización" />
          <Appbar.Action
            icon="mail"
            onPress={() =>
              Linking.openURL(
                'mailto:"atencionalcliente@cimex.com.cu"?subject=Reporte desde Donde Hay'
              )
            }
          />
          <Appbar.Action
            icon="call"
            onPress={() => Linking.openURL(`tel:80000724`)}
          />
        </Appbar.Header>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalGeoVisible}
            onRequestClose={() => {
              Alert.alert("Alerta", "Debe cerrar primero la ventana actual.");
            }}
          >
            <View
              style={{
                alignItems: "center",
                alignContent: "center",
                flex: 1,
                padding: 5
              }}
            />
            <Card>
              <Card.Content>
                <View style={{ flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    name="crosshairs-gps"
                    size={20}
                    color={"black"}
                  />
                  <Text style={{ paddingLeft: 10, fontWeight: "bold" }}>
                    Información
                  </Text>
                  <Divider />
                </View>
                <View style={{ paddingLeft: 10 }}>
                  <Text note>
                    Establecimiento: {this.state.storeSelected.nombre}
                  </Text>
                  <Text note>
                    Provincia: {this.state.storeSelected.provincia}
                  </Text>
                  <Text note>
                    Municipio: {this.state.storeSelected.municipio}
                  </Text>
                  <Text note>
                    Dirección: {this.state.storeSelected.direccion}
                  </Text>
                  <Text note>
                    Producto: {this.state.productSelected.nombre}
                  </Text>
                </View>
                <Button
                  iconRight
                  transparent
                  onPress={() => {
                    this.setGeoVisible(!this.state.modalGeoVisible);
                  }}
                >
                  <Text>Cerrar</Text>
                </Button>
              </Card.Content>
            </Card>
          </Modal>
        </View>
        <View>
          <View style={{ height: "100%" }}>
            <WebView
              source={{
                uri:
                  "http://dhayservice.cimex.com.cu:1702/maphay?lat=" +
                  parseFloat(
                    this.props.screenProps.storeSelected.x_coordenada
                  ) +
                  "&lng=" +
                  parseFloat(
                    this.props.screenProps.storeSelected.y_coordenada
                  ) +
                  "&zoom=16"
              }}
              geolocationEnabled
            />
          </View>
        </View>
        <FAB
          style={styles.fab}
          medium
          icon={() => (
            <MaterialCommunityIcons
              name={"information-variant"}
              color={"white"}
              size={25}
            />
          )}
          onPress={() => this.setGeoVisible(!this.state.modalGeoVisible)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  MapContainer: {
    flex: 1
  },
  map: {
    flex: 1
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 60,
    backgroundColor: "#27ae60"
  }
});
