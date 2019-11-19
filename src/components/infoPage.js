import React, { Component } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView
} from "react-native";
import {
  Card,
  Subtitle,
  Text,
  Title,
  Appbar,
  Divider,
  Paragraph
} from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class InfoPage extends Component {
  constructor() {
    super();
    this.state = {
      selectedDpa: [],
      primaryColor: "#0D4D29"
    };
  }

  render() {
    return (
      <SafeAreaView>
        <View>
          <Appbar.Header style={{ backgroundColor: this.state.primaryColor }}>
            <Appbar.Action
              icon="arrow-back"
              onPress={() => this.props.navigation.navigate("Finder")}
            />
            <Appbar.Content
              title="¡Donde Hay!"
              subtitle="Información al usuario"
            />
          </Appbar.Header>
        </View>
        <ScrollView>
          <View style={{ padding: 5 }}>
            <Card>
              <Card.Content>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: 12
                  }}
                >
                  <Image
                    style={{
                      width: 100,
                      height: 100
                    }}
                    source={require("../assets/images/app-icon.png")}
                  />
                </View>
                <Divider />
                <View style={{ flexDirection: "row", paddingBottom: 10 }}>
                  <Icon name="information" size={25} />
                  <Text style={{ fontWeight: "bold", padding: 5 }}>
                    Información al Usuario
                  </Text>
                </View>
                <Divider />
                <Paragraph style={{ padding: 5 }}>
                  ¡DondeHay! es el localizador de productos de la cadena de
                  tiendas panamericanas.
                </Paragraph>
                <Paragraph style={{ padding: 5 }}>
                  Para su funcionamiento requiere de una conexión, ya que sus
                  datos no se encuentran almacenados en la aplicación si no que
                  se consultan conectados a un servicio en linea para garantizar
                  que la información sea la más actualizada. Su utilización es
                  posible mediante los Sitios de Acceso Público de Etecsa, Nauta
                  Hogar, redes corporativas con acceso a Internet, y desde los
                  datos móviles, a travéz de la APN de Nauta. Siempre que el
                  servicio se utilize desde la APN de Nauta, el tráfico generado
                  será libre de costos.
                </Paragraph>
                <Paragraph style={{ padding: 5 }}>
                  Los datos que muestra ¡DondeHay! son obtenidos de la
                  información tributada por los establecimientos de manera
                  automática al hacer el cierre de sus inventarios. El proceso
                  de carga corre cada una hora, lo que garantiza que la
                  información de los establecimiento no tenga mas de 24 horas de
                  atraso.
                </Paragraph>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
