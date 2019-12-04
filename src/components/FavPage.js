import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  ImageBackground,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Linking
} from "react-native";
import {
  Appbar,
  Text,
  Card,
  Badge,
  Divider,
  Avatar,
  Caption,
  Headline,
  Surface,
  Portal,
  Dialog,
  Paragraph,
  Subheading,
  Modal,
  Button
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { UIActivityIndicator } from "react-native-indicators";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationEvents } from "react-navigation";

export default class FavPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      primaryColor: "#0D4D29",
      isFetching: false,
      favoritos: this.props.screenProps.favoritos,
      searchText: "",
      modalImageVisible: false,
      productSelected: []
    };
  }

  componentWillMount() {}

  setSearchText(event) {
    searchText = event.nativeEvent.text;
    data = this.state.favoritos;
    searchText = searchText.trim().toLowerCase();
    data = data.filter(l => {
      return l.nama.toLowerCase().match(searchText);
    });
    this.setState({
      data: data
    });
  }

  storeFavoritos = async () => {
    const data = await this.time2Storage();

    if (data !== null) {
      try {
        await AsyncStorage.setItem(
          "@Favoritos",
          JSON.stringify(this.props.screenProps.favoritos)
        );
      } catch (e) {
        alert(e);
      }
    }
  };

  time2Storage = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve("result");
      }, 2000)
    );
  };

  //Setea a visible el Modal que muestra la Imagen
  setImageVisible(visible) {
    this.setState({ modalImageVisible: visible });
  }

  //Limpia la lista
  clearProductsList() {
    this.setState({ products: [] });
  }

  render() {
    const indicatorFetch = (
      <View>
        <UIActivityIndicator color="#2c3e50" />
      </View>
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationEvents
          onDidFocus={payload => {
            this.setState({
              favoritos: this.props.screenProps.favoritos
            });
          }}
        />
        <ImageBackground
          source={require("../assets/images/backpana.png")}
          style={{
            resizeMode: "contain",
            flex: 1
          }}
        >
          <View>
            <Appbar.Header style={{ backgroundColor: this.state.primaryColor }}>
              <Appbar.Action
                icon="arrow-back"
                onPress={() => this.props.navigation.navigate("Finder")}
              />
              <Appbar.Content title="¡Donde Hay!" subtitle="Favoritos" />
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
          </View>
          <View>
            <Portal>
              <Modal visible={this.state.modalImageVisible}>
                <View style={{ margin: 20 }}>
                  <Card>
                    <Card.Content>
                      <Subheading style={{ fontWeight: "bold" }}>
                        {this.state.productSelected.nombre}
                      </Subheading>
                      <Divider />
                    </Card.Content>
                    <Card.Cover
                      source={{
                        uri:
                          "http://dhayservice.cimex.com.cu:1702/images/" +
                          this.state.productSelected.imagen +
                          ".jpg"
                      }}
                    />
                    <Divider />
                    <View
                      style={{
                        alignItems: "flex-end"
                      }}
                    >
                      <Button
                        onPress={() => {
                          this.setImageVisible(!this.state.modalImageVisible);
                        }}
                      >
                        Cerrar
                      </Button>
                    </View>
                  </Card>
                </View>
              </Modal>
            </Portal>
          </View>
          <View>
            <FlatList
              contentContainerStyle={{ paddingBottom: 25 }}
              data={this.state.favoritos}
              ListHeaderComponent={() => {
                if (this.state.products == 0) {
                  return null;
                } else {
                  return (
                    <View style={{ padding: 5 }}>
                      <Surface style={styles.surface}>
                        <Paragraph style={{ paddingRight: 5 }}>
                          Favoritos
                        </Paragraph>
                        <Badge>{this.state.favoritos.length}</Badge>
                      </Surface>
                    </View>
                  );
                }
              }}
              renderItem={({ item }) => {
                return (
                  <View style={{ padding: 5 }}>
                    <Card>
                      <Card.Content>
                        <View
                          style={{
                            flex: 1
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row"
                            }}
                          >
                            <View
                              style={{
                                width: "20%",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              {item.imagen ? (
                                <Avatar.Image
                                  style={{ backgroundColor: "withe" }}
                                  source={{
                                    uri:
                                      "http://dhayservice.cimex.com.cu:1702/images/" +
                                      item.cod_barra +
                                      ".jpg"
                                  }}
                                />
                              ) : (
                                <Avatar.Image
                                  style={{ backgroundColor: "withe" }}
                                  source={require("../assets/images/jaba.jpg")}
                                />
                              )}
                            </View>
                            <View
                              style={{
                                width: "80%",
                                paddingLeft: 5
                              }}
                            >
                              <Text style={{ fontWeight: "bold" }}>
                                {item.nombre}
                              </Text>
                              <Divider />
                              <View
                                style={{
                                  flexDirection: "row",
                                  paddingLeft: 5
                                }}
                              >
                                <View
                                  style={{
                                    marginTop: 5,
                                    width: "50%"
                                  }}
                                >
                                  <Caption>[|||]{item.cod_barra}</Caption>
                                  <Caption>U/M: {item.unidad_medida}</Caption>
                                </View>
                                <View
                                  style={{
                                    width: "50%",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                >
                                  <Headline style={{ fontWeight: "bold" }}>
                                    ${item.precio}
                                  </Headline>
                                </View>
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center"
                            }}
                          >
                            <View style={styles.buttonContainer}>
                              {item.imagen ? (
                                <TouchableOpacity
                                  style={styles.cardButton}
                                  onPress={() => {
                                    this.setState({
                                      productSelected: item
                                    });
                                    this.setImageVisible(
                                      !this.state.modalImageVisible
                                    );
                                  }}
                                >
                                  <Icon
                                    name="camera-alt"
                                    size={25}
                                    style={{ color: this.state.primaryColor }}
                                  />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity style={styles.cardButton}>
                                  <Icon
                                    name="camera-alt"
                                    size={25}
                                    style={{ color: "gray" }}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                            <View style={styles.buttonContainer}>
                              <TouchableOpacity
                                style={styles.cardButton}
                                onPress={() => {
                                  Alert.alert(
                                    "Eliminar Favorito",
                                    "¿Esta seguro de querer eliminar el producto de su lista de favoritos ?",
                                    [
                                      {
                                        text: "No",
                                        onPress: () => {},
                                        style: "cancel"
                                      },
                                      {
                                        text: "Sí",
                                        onPress: () => {
                                          var ind = this.state.favoritos.indexOf(
                                            item
                                          );
                                          this.setState({
                                            productSelected: item
                                          });
                                          //this.deleteFavorito(selected);
                                          this.state.favoritos.splice(ind, 1);
                                          this.props.screenProps.setFavorito(
                                            this.state.favoritos
                                          );
                                          this.storeFavoritos();
                                        }
                                      }
                                    ],
                                    { cancelable: false }
                                  );
                                }}
                              >
                                {item.heartColor == "red" ? (
                                  <Icon name="favorite" size={25} color="red" />
                                ) : (
                                  <Icon name="favorite" size={25} />
                                )}
                              </TouchableOpacity>
                            </View>
                            <View style={styles.buttonContainer}>
                              <TouchableOpacity
                                style={styles.cardButton}
                                onPress={() => {
                                  this.setState({ productSelected: item });
                                  this.props.screenProps.setProductSelected(
                                    item
                                  );
                                  this.props.navigation.navigate("Stores");
                                }}
                              >
                                <Icon
                                  name="search"
                                  size={25}
                                  style={{ color: this.state.primaryColor }}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </Card.Content>
                    </Card>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={() => {
                return <View style={{ height: 0, marginBottom: 315 }} />;
              }}
            />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  cardFootcontainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center"
  },
  loading: {
    flex: 0,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  },
  surface: {
    padding: 5,
    backgroundColor: "#C8E6C9",
    flexDirection: "row",
    elevation: 1
  }
});
