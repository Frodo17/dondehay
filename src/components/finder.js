import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from "react-native";
import { UIActivityIndicator } from "react-native-indicators";
import AsyncStorage from "@react-native-community/async-storage";
import NumericInput from "react-native-numeric-input";
import { NavigationEvents, withNavigationFocus } from "react-navigation";
import Axios from "axios";
import DropdownAlert from "react-native-dropdownalert";
import {
  Appbar,
  Searchbar,
  Card,
  Avatar,
  Surface,
  Caption,
  Headline,
  Divider,
  FAB,
  Text,
  Dialog,
  Portal,
  Subheading,
  Button,
  Modal,
  Snackbar
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

class Finder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      primaryColor: "#0D4D29",
      loading: false,
      isFetching: false,
      products: [],
      more: [],
      total: "",
      pageFrom: "",
      pageTo: "",
      searchText: "",
      apiurl: this.props.screenProps.apiurl + "product/text-search",
      nextUrl: "",
      modalImageVisible: false,
      modalPrecios: this.props.screenProps.modalPrecios,
      productSelected: "",
      scanned: this.props.screenProps.scanned,
      favoritosIds: [],
      favoritos: this.props.screenProps.favoritos,
      snackVisible: false,
      snackColor: "#e74c3c",
      snackText: "Empty",
      filterUpdated: false,
      currentVersion: this.props.screenProps.currentVersion,
      newVersion: []
    };
  }

  componentDidMount() {
    this.getVersion();
  }

  componentDidUpdate() {
    if (
      this.props.screenProps.filterUpdated &&
      this.state.searchText.length > 0
    ) {
      this.getProducts();
    }
  }

  //busqueda
  searchFilterFunction = text => {
    const newData = this.state.favoritos.filter(item => {
      const itemData = `${item.nombre.toUpperCase()}   
      ${item.precio} ${item.cod_barra}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ data: newData });
  };

  //Setea a visible el Modal que muestra la Imagen
  setImageVisible(visible) {
    this.setState({ modalImageVisible: visible });
  }

  //trae los productos del API
  async getProducts() {
    const time = await this.time2fetch();

    if (time !== null) {
      if (this.state.searchText != "") {
        this.setState({ isFetching: true });

        //this.setState({ products: "" });

        Axios({
          method: "post",
          url: this.state.apiurl,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          data: {
            text: this.state.searchText,
            municipios: this.props.screenProps.dpaSelected,
            precio_max: this.props.screenProps.filterMax,
            precio_min: this.props.screenProps.filterMin,
            rebajados: this.props.screenProps.rebajados,
            esmlc: this.props.screenProps.isMLC
          },
          timeout: 10000
        })
          .then(response => {
            if (response.data.data.length < 1) {
              this.setState({
                isFetching: false,
                snackColor: "#e74c3c",
                snackText:
                  "No existen coincidencias para la búsqueda o para los filtros seleccionados.",
                snackVisible: true
              });
            }
            this.setState({
              products: response.data.data,
              total: response.data.total,
              pageFrom: response.data.from,
              pageTo: response.data.to,
              isFetching: false,
              nextUrl: response.data.next_page_url,
              lastUrl: response.data.last_page_url,
              pageCurrent: response.data.current_page
            });
            this.props.screenProps.setFilterUpdated(false);
          })
          .catch(err => {
            this.setState({
              isFetching: false,
              snackColor: "#e74c3c",
              snackText:
                "No se puede conectar al servidor. Verifique que su móvil se encuentre conectado.",
              snackVisible: true
            });
          });
      } else {
        this.setState({
          isFetching: false,
          snackColor: "#e74c3c",
          snackText: "Debe escribir algún criterio de búsqueda.",
          fabVisible: false,
          snackVisible: true
        });
      }
    }
  }

  //Chequea que no sean los ultimos datos antes de pedir mas.
  evaluateLoadMore() {
    if (this.state.nextUrl !== null) {
      this.loadMore();
    }
  }

  //Carga los siguientes articulos y los suma al arreglo que se renderea en la lista
  loadMore() {
    this.setState({ isFetching: true });

    Axios({
      method: "get",
      url: this.state.nextUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      timeout: 10000
    })
      .then(response => {
        const allproducts = [...this.state.products, ...response.data.data];
        this.setState({
          pageTo: response.data.to,
          isFetching: false,
          nextUrl: response.data.next_page_url,
          products: allproducts
        });
      })
      .catch(err => {
        this.setState({ isFetching: false });
        this.setState({
          isFetching: false,
          snackColor: "#e74c3c",
          snackText: "Se ha perdido lo conexión con el servidor.",
          snackVisible: true
        });
      });
  }

  async getVersion() {
    const time = await this.time2fetch();

    Axios({
      method: "get",
      url: this.props.screenProps.apiurl + "version",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      timeout: 10000
    })
      .then(response => {
        if (response.data[0].version != this.state.currentVersion) {
          this.setState({
            newVersion: response.data[0]
          });
          this.props.screenProps.setNewUpdate(true);
          this.props.screenProps.setNewVersion(this.state.newVersion.version);
          if (time !== null) {
            this.dropDownAlertRef.alertWithType(
              "custom",
              "Actualización disponible",
              "Se encuentra disponible la version " +
                JSON.stringify(this.state.newVersion.version) +
                " de fecha " +
                JSON.stringify(this.state.newVersion.fecha) +
                ". " +
                JSON.stringify(this.state.newVersion.detalles)
            );
          }
        }
      })
      .catch(err => {
        null;
      });
  }

  //Chequea que no sean los ultimos datos antes de pedir mas.
  evaluateLoadMore() {
    if (this.state.nextUrl !== null) {
      this.loadMore();
    }
  }

  //Carga los siguientes articulos y los suma al arreglo que se renderea en la lista
  loadMore() {
    this.setState({ isFetching: true });

    Axios({
      method: "get",
      url: this.state.nextUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      timeout: 10000
    })
      .then(response => {
        const allproducts = [...this.state.products, ...response.data.data];
        this.setState({
          pageTo: response.data.to,
          isFetching: false,
          nextUrl: response.data.next_page_url,
          products: allproducts
        });
      })
      .catch(err => {
        this.setState({ isFetching: false });
        this.setState({
          isFetching: false,
          snackColor: "#e74c3c",
          snackText: "Se ha perdido lo conexión con el servidor.",
          snackVisible: true
        });
      });
  }

  //Limpia la lista
  clearProductsList() {
    this.setState({ products: [] });
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

  storePriceFilter = async () => {
    const data = await this.time2Storage();

    if (data !== null) {
      try {
        await AsyncStorage.setItem(
          "@PriceMin",
          JSON.stringify(this.props.screenProps.filterMin)
        );
        await AsyncStorage.setItem(
          "@PriceMax",
          JSON.stringify(this.props.screenProps.filterMax)
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
      }, 1000)
    );
  };

  time2fetch = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve("result");
      }, 1000)
    );
  };

  closeDrawer() {
    this.drawer._root.close();
  }

  openDrawer() {
    this.drawer._root.open();
  }

  render() {
    const indicatorFetch = (
      <View>
        <UIActivityIndicator color="#2c3e50" />
      </View>
    );

    const { searchText } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={this.state.primaryColor}
          barStyle="light-content"
        />
        <NavigationEvents
          onDidFocus={payload => {
            if (this.props.screenProps.scanned.length > 0) {
              this.setState({ searchText: this.props.screenProps.scanned });
              this.getProducts();
            }

            this.props.screenProps.setFromSearch(true);
          }}
          onDidBlur={payload => {
            this.props.screenProps.setScanned("");
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
                icon="menu"
                onPress={() => {
                  this.props.navigation.toggleDrawer();
                }}
              />
              <Appbar.Content
                title="¡Donde Hay!"
                subtitle="Tiendas Panamericanas"
              />
              <Appbar.Action
                icon="favorite"
                onPress={() => this.props.navigation.navigate("Favoritos")}
              />
              <Appbar.Action
                icon={() => (
                  <MaterialCommunityIcons
                    name={"barcode-scan"}
                    color={"white"}
                    size={25}
                  />
                )}
                onPress={() => this.props.navigation.navigate("BarScan")}
              />
            </Appbar.Header>
            <View
              style={{ backgroundColor: this.state.primaryColor, padding: 8 }}
            >
              <Searchbar
                placeholder="Buscar"
                onChangeText={query => {
                  this.setState({ searchText: query });
                }}
                value={searchText}
                onIconPress={() => this.getProducts()}
                onSubmitEditing={() => this.getProducts()}
                autoCapitalize={"none"}
                returnKeyType={"search"}
                autoCorrect={false}
              />
            </View>
          </View>
          <View style={{ flex: 0, top: 75, left: 1 }}>
            <Snackbar
              visible={this.state.snackVisible}
              onDismiss={() => this.setState({ snackVisible: false })}
              style={{ backgroundColor: this.state.snackColor }}
            >
              {this.state.snackText}
            </Snackbar>
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
                      style={{
                        height: "80%",
                        resizeMode: "stretch"
                      }}
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
            <Portal>
              <Dialog visible={this.state.isFetching}>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {indicatorFetch}
                </View>
              </Dialog>
            </Portal>
          </View>
          <View>
            <Portal>
              <Modal visible={this.props.screenProps.modalPrecios}>
                <View style={{ margin: 20 }}>
                  <Card>
                    <Card.Content>
                      <Subheading style={{ fontWeight: "bold" }}>
                        Filtro de Precios
                      </Subheading>
                      <Divider />
                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <View style={{ paddingTop: 5 }}>
                          <Text note>Minimo:</Text>
                          <NumericInput
                            rounded
                            totalWidth={145}
                            totalHeight={35}
                            minValue={0.0}
                            step={1}
                            valueType="integer"
                            value={parseFloat(this.props.screenProps.filterMin)}
                            type="plus-minus"
                            iconSize={10}
                            onChange={value =>
                              this.props.screenProps.setFilterMin(value)
                            }
                          />
                        </View>
                        <View style={{ paddingLeft: 5, paddingTop: 5 }}>
                          <Text note>Máximo:</Text>
                          <NumericInput
                            rounded
                            totalWidth={145}
                            totalHeight={35}
                            step={1}
                            minValue={0}
                            valueType="integer"
                            value={parseFloat(this.props.screenProps.filterMax)}
                            type="plus-minus"
                            iconSize={10}
                            onChange={value =>
                              this.props.screenProps.setFilterMax(value)
                            }
                          />
                        </View>
                      </View>
                      <Divider />
                      <View style={{ flexDirection: "row", paddingTop: 10 }}>
                        <View style={{ flex: 1, alignItems: "center" }}>
                          <TouchableOpacity
                            style={{ width: 60, height: 40, paddingTop: 8 }}
                            onPress={() => {
                              if (
                                this.props.screenProps.filterMin == 0 &&
                                this.props.screenProps.filterMax == 0
                              ) {
                                this.setState({
                                  snackColor: "#27ae60",
                                  snackText: "Filtro deshabilitado.",
                                  snackVisible: true
                                });
                                this.storePriceFilter();
                                this.props.screenProps.setPreciosVisible(
                                  !this.props.screenProps.modalPrecios
                                );
                                if (this.state.searchText.length > 0) {
                                  this.getProducts();
                                }
                              } else {
                                if (
                                  this.props.screenProps.filterMax > 0 &&
                                  this.props.screenProps.filterMin <
                                    this.props.screenProps.filterMax
                                ) {
                                  this.storePriceFilter();
                                  this.props.screenProps.setPreciosVisible(
                                    !this.props.screenProps.modalPrecios
                                  );
                                  if (this.state.searchText.length > 0) {
                                    this.getProducts();
                                  }
                                } else {
                                  this.setState({
                                    snackColor: "#e74c3c",
                                    snackText:
                                      "El precio máximo a filtrar debe ser superior al mínimo.",
                                    snackVisible: true
                                  });
                                }
                              }
                            }}
                          >
                            <Text style={{ color: "green" }}>Aplicar</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, alignItems: "center" }}>
                          <TouchableOpacity
                            style={{ width: 60, height: 40, paddingTop: 8 }}
                            onPress={() => {
                              this.props.screenProps.setFilterMin(0);
                              this.props.screenProps.setFilterMax(0);
                              this.setState({
                                snackColor: "#27ae60",
                                snackText: "Filtro deshabilitado.",
                                snackVisible: true
                              });
                              this.props.screenProps.setPreciosVisible(false);
                              this.storePriceFilter();
                              if (this.state.searchText.length > 0) {
                                this.getProducts();
                              }
                            }}
                          >
                            <Text style={{ color: "orange" }}>Limpiar</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, alignItems: "center" }}>
                          <TouchableOpacity
                            style={{ width: 60, height: 40, paddingTop: 8 }}
                            onPress={() => {
                              this.props.screenProps.setPreciosVisible(false);
                            }}
                          >
                            <Text style={{ color: "red" }}>Cancelar</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                </View>
              </Modal>
            </Portal>
          </View>
          <View>
            <FlatList
              contentContainerStyle={{ paddingBottom: 25 }}
              data={this.state.products}
              ListHeaderComponent={() => {
                if (this.state.products.length == 0) {
                  return null;
                } else {
                  return (
                    <View style={{ padding: 5 }}>
                      <Surface style={styles.surface}>
                        <Caption>
                          Mostrando {this.state.pageTo} resultados de{" "}
                          {this.state.total}
                        </Caption>
                      </Surface>
                    </View>
                  );
                }
              }}
              renderItem={({ item }) => {
                let favoritosIds = [];
                let MisFavoritos = this.props.screenProps.favoritos;

                MisFavoritos.forEach(function(prod) {
                  favoritosIds.push(JSON.stringify(prod.id));
                });

                if (favoritosIds.includes(JSON.stringify(item.id))) {
                  item.heartColor = "red";
                } else {
                  item.heartColor = "gray";
                }

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
                                  <Caption>[|||] {item.cod_barra}</Caption>
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
                                  let favoritosIds = [];
                                  let MisFavoritos = this.props.screenProps
                                    .favoritos;

                                  MisFavoritos.forEach(function(prod) {
                                    favoritosIds.push(JSON.stringify(prod.id));
                                  });

                                  if (
                                    !favoritosIds.includes(
                                      JSON.stringify(item.id)
                                    )
                                  ) {
                                    MisFavoritos = MisFavoritos.concat(item);

                                    this.props.screenProps.setFavorito(
                                      MisFavoritos
                                    );

                                    this.storeFavoritos();
                                  } else {
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
                                    item.heartColor = "gray";
                                    this.storeFavoritos();
                                  }
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
              onEndReached={() => this.evaluateLoadMore()}
              onEndReachedThreshold={0.2}
              ListFooterComponent={() => {
                return <View style={{ height: 0, marginBottom: 100 }} />;
              }}
            />
          </View>
          {this.state.products != "" ? (
            <FAB
              style={styles.fab}
              medium
              icon={() => (
                <MaterialCommunityIcons
                  name={"trash-can"}
                  color={"white"}
                  size={25}
                />
              )}
              onPress={() => this.clearProductsList()}
            />
          ) : null}
          <DropdownAlert
            imageSrc={require("../assets/images/app-icon.png")}
            containerStyle={{ backgroundColor: "#32A54A", elevation: 3 }}
            ref={ref => (this.dropDownAlertRef = ref)}
          />
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default withNavigationFocus(Finder);

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
    alignItems: "center",
    width: "33.3%",
    paddingTop: 8
  },
  cardButton: {
    width: 60,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
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
    alignItems: "center",
    justifyContent: "center",
    elevation: 1
  },
  fab: {
    position: "absolute",
    margin: 7,
    right: 0,
    bottom: 24,
    backgroundColor: "red"
  }
});
