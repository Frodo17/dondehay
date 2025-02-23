import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ImageBackground,
  Alert,
  Share,
  TouchableOpacity,
  SafeAreaView,
  Linking
} from "react-native";
import {
  Appbar,
  Text,
  Card,
  Divider,
  Avatar,
  Caption,
  Headline,
  Snackbar,
  Portal,
  Dialog
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { UIActivityIndicator } from "react-native-indicators";
import moment from "moment";
import "moment/locale/es";
import { NavigationEvents } from "react-navigation";
import Axios from "axios";

export default class DhayStores extends Component {

                 constructor(props) {
                   super(props);

                   this.state = {
                     primaryColor: "#0D4D29",
                     loading: false,
                     isFetching: false,
                     stores: [],
                     more: [],
                     total: "",
                     pageFrom: "",
                     pageTo: "",
                     apiurl: this.props.screenProps.apiurl + "product-details/",
                     nextUrl: "",
                     departamentos: [],
                     municipios: [],
                     storeSelected: [],
                     productSelected: this.props.screenProps.productSelected,
                     appTitle: this.props.screenProps.appTitle,
                     snackVisible: false,
                     snackColor: "#e74c3c",
                     snackText: "Empty"
                   };
                   moment().locale("es");
                 }

                 onShare = async () => {
                   const time = await this.time2fetch();
                   if (time !== null) {
                     try {
                       const result = await Share.share({
                         message:
                           "¡DONDE HAY!, Producto: " +
                           this.state.productSelected.nombre +
                           ", Precio: $ " +
                           this.state.productSelected.precio +
                           ", Disponibilidad: " +
                           this.state.storeSelected.disponibilidad +
                           ", Tienda: " +
                           this.state.storeSelected.nombre +
                           ", Dirección: " +
                           this.state.storeSelected.direccion +
                           ", " +
                           this.state.storeSelected.municipio +
                           ", " +
                           this.state.storeSelected.provincia
                       });

                       if (result.action === Share.sharedAction) {
                         if (result.activityType) {
                           // shared with activity type of result.activityType
                         } else {
                           // shared
                         }
                       } else if (result.action === Share.dismissedAction) {
                         // dismissed
                       }
                     } catch (error) {
                       this.setState({
                         isFetching: false,
                         snackColor: "#e74c3c",
                         snackText: "Error al compartir.",
                         snackVisible: true
                       });
                     }
                   }
                 };

                 //trae los productos del API
                 async getStores() {
                   this.setState({ isFetching: true });

                   const time = await this.time2fetch();

                   if (time !== null) {
                     await Axios({
                       method: "post",
                       url: this.state.apiurl + this.state.productSelected.id,
                       headers: {
                         Accept: "application/json",
                         "Content-Type": "application/json"
                       },
                       data: {
                         municipios: this.props.screenProps.dpaSelected,
                         esmlc: this.props.screenProps.isMLC
                       },
                       timeout: 10000
                     })
                       .then(response => {
                         this.setState({
                           stores: response.data.data,
                           total: response.data.total,
                           pageFrom: response.data.from,
                           pageTo: response.data.to,
                           isFetching: false,
                           nextUrl: response.data.next_page_url,
                           lastUrl: response.data.last_page_url,
                           pageCurrent: response.data.current_page
                         });
                       })
                       .catch(err => {
                         this.setState({ isFetching: false });
                         this.setState({
                           isFetching: false,
                           snackColor: "#e74c3c",
                           snackText:
                             "Se ha perdido lo conexión con el servidor.",
                           snackVisible: true
                         });
                         this.props.navigation.navigate("Finder");
                       });
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
                       const allstores = [
                         ...this.state.stores,
                         ...response.data.data
                       ];
                       this.setState({
                         pageTo: response.data.to,
                         isFetching: false,
                         nextUrl: response.data.next_page_url,
                         stores: allstores
                       });
                     })
                     .catch(err => {
                       this.setState({ isFetching: false });
                       this.setState({
                         isFetching: false,
                         snackColor: "#e74c3c",
                         snackText:
                           "Se ha perdido lo conexión con el servidor.",
                         snackVisible: true
                       });
                     });
                 }

                 time2fetch = async () => {
                   return new Promise(resolve =>
                     setTimeout(() => {
                       resolve("result");
                     }, 1000)
                   );
                 };

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
                             productSelected: this.props.screenProps
                               .productSelected
                           });
                           if (this.props.screenProps.fromSearch === true) {
                             this.setState({ stores: [] });
                             this.getStores();
                           }
                         }}
                         onDidBlur={payload => {}}
                       />
                       <ImageBackground
                         source={require("../assets/images/backpana.png")}
                         style={{
                           resizeMode: "contain",
                           flex: 1
                         }}
                       >
                         <View>
                           <Appbar.Header
                             style={{
                               backgroundColor: this.state.primaryColor
                             }}
                           >
                             <Appbar.Action
                               icon="arrow-back"
                               onPress={() =>
                                 this.props.navigation.navigate("Finder")
                               }
                             />
                             <Appbar.Content
                               title="¡Donde Hay!"
                               subtitle="Establecimientos"
                             />
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
                         <View style={{ flex: 0, top: 75, left: 1 }}>
                           <Snackbar
                             visible={this.state.snackVisible}
                             onDismiss={() =>
                               this.setState({ snackVisible: false })
                             }
                             style={{ backgroundColor: this.state.snackColor }}
                           >
                             {this.state.snackText}
                           </Snackbar>
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
                           <FlatList
                             data={this.state.stores}
                             ListHeaderComponent={() => {
                               product = this.state.productSelected;
                               if (this.state.stores == 0) {
                                 return null;
                               } else {
                                 return (
                                   <View style={{ padding: 5 }}>
                                     <Card>
                                       <Card.Content>
                                         <View>
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
                                               {product.imagen ? (
                                                 <Avatar.Image
                                                   style={{
                                                     backgroundColor: "withe"
                                                   }}
                                                   source={{
                                                     uri:
                                                       "http://dhayservice.cimex.com.cu:1702/images/" +
                                                       product.cod_barra +
                                                       ".jpg"
                                                   }}
                                                 />
                                               ) : (
                                                 <Avatar.Image
                                                   style={{
                                                     backgroundColor: "withe"
                                                   }}
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
                                               <Text
                                                 style={{ fontWeight: "bold" }}
                                               >
                                                 {product.nombre}
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
                                                   <Caption>
                                                     [|||]{product.cod_barra}
                                                   </Caption>
                                                   <Caption>
                                                     U/M:{" "}
                                                     {product.unidad_medida}
                                                   </Caption>
                                                 </View>
                                                 <View
                                                   style={{
                                                     width: "50%",
                                                     alignItems: "center",
                                                     justifyContent: "center"
                                                   }}
                                                 >
                                                   <Headline
                                                     style={{
                                                       fontWeight: "bold"
                                                     }}
                                                   >
                                                     ${product.precio}
                                                   </Headline>
                                                 </View>
                                               </View>
                                             </View>
                                           </View>
                                           <View
                                             style={{
                                               padding: 5,
                                               backgroundColor: "#C8E6C9",
                                               elevation: 1
                                             }}
                                           >
                                             <Divider />
                                             <Text note>
                                               Listando {this.state.pageTo}{" "}
                                               establecimientos de{" "}
                                               {this.state.total}.
                                             </Text>
                                           </View>
                                         </View>
                                       </Card.Content>
                                     </Card>
                                   </View>
                                 );
                               }
                             }}
                             renderItem={({ item }) => {
                               /*var fechaini = new Date(item.ultima_venta);
                                var fechafin = new Date(item.fecha);
                                var diasdif = fechafin.getTime() - fechaini.getTime();
                                var contdias = Math.round(diasdif / (1000 * 60 * 60 * 24));*/
                               return (
                                 <View style={{ padding: 5 }}>
                                   <Card>
                                     <Card.Content>
                                       <View
                                         style={{
                                           flexDirection: "row"
                                         }}
                                       >
                                         <View
                                           style={{
                                             width: "20%",
                                             justifyContent: "center",
                                             alignItems: "center"
                                           }}
                                         >
                                           {item.mlc === false &&
                                             item.es_ocasion === false && (
                                               <Avatar.Image
                                                 style={{
                                                   backgroundColor: "withe"
                                                 }}
                                                 source={require("../assets/images/shop.png")}
                                               />
                                             )}
                                           {item.mlc === true &&
                                             item.es_ocasion === false && (
                                               <Avatar.Image
                                                 style={{
                                                   backgroundColor: "withe"
                                                 }}
                                                 source={require("../assets/images/shopusd.png")}
                                               />
                                             )}
                                           {item.es_ocasion && (
                                             <Avatar.Image
                                               style={{
                                                 backgroundColor: "withe"
                                               }}
                                               source={require("../assets/images/tagprice.png")}
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
                                           <View style={{ paddingTop: 5 }}>
                                             <Caption>
                                               Dirección: {item.direccion}
                                             </Caption>
                                             <Caption>
                                               Municipio: {item.municipio}
                                             </Caption>
                                             <Caption>
                                               Provincia: {item.provincia}
                                             </Caption>
                                             <Caption>
                                               Disponibilidad Total:{" "}
                                               {item.disponibilidad}
                                             </Caption>
                                             <View>
                                               <View
                                                 style={{
                                                   paddingTop: 10,
                                                   paddingBottom: 10,
                                                   flexDirection: "row",
                                                   alignContent: "center"
                                                 }}
                                               >
                                                 <View
                                                   style={{
                                                     width: "50%",
                                                     alignContent: "center",
                                                     alignItems: "center",
                                                     backgroundColor: "#bdc3c7",
                                                     borderBottomLeftRadius: 8,
                                                     borderTopLeftRadius: 8,
                                                     paddingTop: 5,
                                                     paddingBottom: 5
                                                   }}
                                                 >
                                                   <View
                                                     style={{
                                                       flexDirection: "row"
                                                     }}
                                                   >
                                                     <MaterialCommunityIcons
                                                       name="package-variant"
                                                       size={20}
                                                     />
                                                     <Text
                                                       note
                                                       style={{
                                                         paddingLeft: 10
                                                       }}
                                                     >
                                                       Almacen
                                                     </Text>
                                                   </View>
                                                   <Text
                                                     title
                                                     style={{
                                                       fontWeight: "bold",
                                                       color: "gray",
                                                       fontSize: 20
                                                     }}
                                                   >
                                                     {item.cant_almacen}
                                                   </Text>
                                                 </View>
                                                 {item.cant_areaventa != 0 ? (
                                                   <View
                                                     style={{
                                                       width: "50%",
                                                       alignContent: "center",
                                                       alignItems: "center",
                                                       borderBottomRightRadius: 8,
                                                       borderTopRightRadius: 8,
                                                       backgroundColor:
                                                         "#ecf0f1",
                                                       paddingTop: 5,
                                                       paddingBottom: 5
                                                     }}
                                                   >
                                                     <View
                                                       style={{
                                                         flexDirection: "row"
                                                       }}
                                                     >
                                                       <MaterialCommunityIcons
                                                         name="shopping"
                                                         size={20}
                                                       />
                                                       <Text
                                                         note
                                                         style={{
                                                           paddingLeft: 10
                                                         }}
                                                       >
                                                         A la Venta
                                                       </Text>
                                                     </View>
                                                     <Text
                                                       title
                                                       style={{
                                                         fontWeight: "bold",
                                                         color: "gray",
                                                         fontSize: 20
                                                       }}
                                                     >
                                                       {item.cant_areaventa}
                                                     </Text>
                                                   </View>
                                                 ) : (
                                                   <View
                                                     style={{
                                                       width: "50%",
                                                       alignContent: "center",
                                                       alignItems: "center",
                                                       borderBottomRightRadius: 8,
                                                       borderTopRightRadius: 8,
                                                       backgroundColor:
                                                         "#e74c3c",
                                                       paddingTop: 5,
                                                       paddingBottom: 5
                                                     }}
                                                   >
                                                     <View
                                                       style={{
                                                         flexDirection: "row"
                                                       }}
                                                     >
                                                       <MaterialCommunityIcons
                                                         name="shopping"
                                                         size={20}
                                                         color={"white"}
                                                       />
                                                       <Text
                                                         note
                                                         style={{
                                                           paddingLeft: 10,
                                                           color: "white"
                                                         }}
                                                       >
                                                         A la Venta
                                                       </Text>
                                                     </View>
                                                     <Text
                                                       title
                                                       style={{
                                                         fontWeight: "bold",
                                                         color: "white",
                                                         fontSize: 20
                                                       }}
                                                     >
                                                       {item.cant_areaventa}
                                                     </Text>
                                                   </View>
                                                 )}
                                               </View>
                                               <View>
                                                 {item.cant_areaventa == 0 ? (
                                                   <View
                                                     style={{
                                                       flexDirection: "row",
                                                       paddingBottom: 8,
                                                       justifyContent:
                                                         "flex-end"
                                                     }}
                                                   >
                                                     <TouchableOpacity
                                                       style={{
                                                         width: 40,
                                                         height: 40,
                                                         backgroundColor:
                                                           "orange",
                                                         borderRadius: 8,
                                                         alignItems: "center",
                                                         justifyContent:
                                                           "center"
                                                       }}
                                                       onPress={() =>
                                                         Linking.openURL(
                                                           'mailto:"atencionalcliente@cimex.com.cu"?subject=Mercancía no representada&body=Reporto que el establecimiento ' +
                                                             item.nombre +
                                                             " ubicado en " +
                                                             item.direccion +
                                                             ", " +
                                                             item.provincia +
                                                             ", " +
                                                             item.municipio +
                                                             "," +
                                                             " posee una existencia en Almacen de " +
                                                             item.cant_almacen +
                                                             " " +
                                                             this.state
                                                               .productSelected
                                                               .unidad_medida +
                                                             " del producto " +
                                                             this.state
                                                               .productSelected
                                                               .nombre +
                                                             ", del cual no hay existencia en el área de venta. Atentamente, su Cliente."
                                                         )
                                                       }
                                                     >
                                                       <MaterialCommunityIcons
                                                         name="email"
                                                         color={"white"}
                                                         size={20}
                                                       />
                                                     </TouchableOpacity>
                                                     <TouchableOpacity
                                                       style={{
                                                         width: 40,
                                                         height: 40,
                                                         backgroundColor: "red",
                                                         borderRadius: 8,
                                                         alignItems: "center",
                                                         justifyContent:
                                                           "center",
                                                         marginLeft: 3
                                                       }}
                                                       onPress={() =>
                                                         Linking.openURL(
                                                           `tel:80000724`
                                                         )
                                                       }
                                                     >
                                                       <MaterialCommunityIcons
                                                         name="phone"
                                                         color={"white"}
                                                         size={20}
                                                       />
                                                     </TouchableOpacity>
                                                   </View>
                                                 ) : null}

                                                 <Divider />
                                                 {item.ultima_venta !== "1900-01-01" ? (
                                                   <Caption>
                                                     Última Venta:{" "}
                                                     {moment(
                                                       item.ultima_venta,
                                                       "YYYY-MM-DD"
                                                     ).fromNow()}
                                                   </Caption>
                                                 ) : (
                                                   <Caption
                                                     style={{ color: "red" }}
                                                   >
                                                     Última Venta: Sin registro
                                                     de ventas
                                                   </Caption>
                                                 )}
                                               </View>
                                               {item.cant_areaventa != 0 &&
                                               item.ultima_venta == "1900-01-01" ? (
                                                 <View
                                                   style={{
                                                     flexDirection: "row",
                                                     paddingBottom: 8,
                                                     justifyContent: "flex-end"
                                                   }}
                                                 >
                                                   <TouchableOpacity
                                                     style={{
                                                       width: 40,
                                                       height: 40,
                                                       backgroundColor:
                                                         "orange",
                                                       borderRadius: 8,
                                                       alignItems: "center",
                                                       justifyContent: "center"
                                                     }}
                                                     onPress={() =>
                                                       Linking.openURL(
                                                         'mailto:"atencionalcliente@cimex.com.cu"?subject=Mercancía sin ventas registradas&body=Reporto que el establecimiento ' +
                                                           item.nombre +
                                                           " ubicado en " +
                                                           item.direccion +
                                                           ", " +
                                                           item.provincia +
                                                           ", " +
                                                           item.municipio +
                                                           "," +
                                                           " posee una existencia en el Área de Venta de " +
                                                           item.cant_areaventa +
                                                           " " +
                                                           this.state
                                                             .productSelected
                                                             .unidad_medida +
                                                           " del producto " +
                                                           this.state
                                                             .productSelected
                                                             .nombre +
                                                           ", del cual no se han efectuado ventas. Atentamente, su Cliente."
                                                       )
                                                     }
                                                   >
                                                     <MaterialCommunityIcons
                                                       name="email"
                                                       color={"white"}
                                                       size={20}
                                                     />
                                                   </TouchableOpacity>
                                                   <TouchableOpacity
                                                     style={{
                                                       width: 40,
                                                       height: 40,
                                                       backgroundColor: "red",
                                                       borderRadius: 8,
                                                       alignItems: "center",
                                                       justifyContent: "center",
                                                       marginLeft: 3
                                                     }}
                                                     onPress={() =>
                                                       Linking.openURL(
                                                         `tel:80000724`
                                                       )
                                                     }
                                                   >
                                                     <MaterialCommunityIcons
                                                       name="phone"
                                                       color={"white"}
                                                       size={20}
                                                     />
                                                   </TouchableOpacity>
                                                 </View>
                                               ) : null}
                                               <Caption>
                                                 Actualizado:{" "}
                                                 {moment(
                                                   item.fecha,
                                                   "YYYY-MM-DD"
                                                 ).fromNow()}
                                               </Caption>
                                             </View>
                                           </View>
                                         </View>
                                       </View>
                                       <View style={styles.cardFootcontainer}>
                                         <View style={styles.buttonContainer}>
                                           <TouchableOpacity
                                             style={styles.cardButton}
                                           >
                                             <MaterialCommunityIcons
                                               name="share-variant"
                                               size={25}
                                               style={{
                                                 color: this.state.primaryColor
                                               }}
                                               onPress={() => {
                                                 this.setState({
                                                   storeSelected: item
                                                 });
                                                 this.onShare();
                                               }}
                                             />
                                           </TouchableOpacity>
                                         </View>
                                         <View style={styles.buttonContainer}>
                                           {item.x_coordenada &&
                                           item.y_coordenada ? (
                                             <TouchableOpacity
                                               style={styles.cardButton}
                                               onPress={() => {
                                                 this.props.screenProps.setStoreSelected(
                                                   item
                                                 );
                                                 this.props.navigation.navigate(
                                                   "Maps"
                                                 );
                                               }}
                                             >
                                               <MaterialCommunityIcons
                                                 name="map-marker"
                                                 size={25}
                                                 color={this.state.primaryColor}
                                               />
                                             </TouchableOpacity>
                                           ) : (
                                             <TouchableOpacity
                                               style={styles.cardButton}
                                             >
                                               <MaterialCommunityIcons
                                                 name="map-marker"
                                                 size={25}
                                               />
                                             </TouchableOpacity>
                                           )}
                                         </View>
                                         <View style={styles.buttonContainer}>
                                           <TouchableOpacity
                                             style={styles.cardButton}
                                             onPress={() => {
                                               if (item.horario) {
                                                 Alert.alert(
                                                   "Horario",
                                                   item.horario,
                                                   [
                                                     {
                                                       text: "Cerrar",
                                                       style: "cancel"
                                                     }
                                                   ]
                                                 );
                                               }
                                             }}
                                           >
                                             {item.horario ? (
                                               <MaterialCommunityIcons
                                                 name="clock-outline"
                                                 size={25}
                                                 style={{
                                                   color: this.state
                                                     .primaryColor
                                                 }}
                                               />
                                             ) : (
                                               <MaterialCommunityIcons
                                                 name="clock-outline"
                                                 size={25}
                                               />
                                             )}
                                           </TouchableOpacity>
                                         </View>
                                       </View>
                                     </Card.Content>
                                   </Card>
                                 </View>
                               );
                             }}
                             keyExtractor={(item, index) => index.toString()}
                             onEndReached={() => this.evaluateLoadMore()}
                             onEndReachedThreshold={0.1}
                             ListFooterComponent={() => {
                               return (
                                 <View
                                   style={{ height: 0, marginBottom: 55 }}
                                 />
                               );
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
    justifyContent: "center",
    paddingTop: 8
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center"
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
  }
});
