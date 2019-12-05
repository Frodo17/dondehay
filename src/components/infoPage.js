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
  constructor(props) {
    super(props);
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
          <View style={{ padding: 5, marginBottom: 60 }}>
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
                <Paragraph style={{ padding: 5 }}>
                  Version: {this.props.screenProps.currentVersion}
                </Paragraph>
                <Paragraph style={{ padding: 5 }}>
                  ¡DondeHay! es el localizador de productos de la Cadena de
                  Tiendas Panamericanas.
                </Paragraph>
                <Paragraph style={{ padding: 5 }}>
                  Para su funcionamiento requiere de una conexión, ya que sus
                  datos no se encuentran almacenados en la aplicación si no que
                  se consultan conectados a un servicio en línea para garantizar
                  que la información sea la más actualizada. Su utilización es
                  posible mediante los Sitios de Acceso Público de Etecsa(WIFI),
                  Nauta Hogar, Redes Corporativas con acceso a Internet, y desde
                  los datos móviles, a travéz de la APN de Nauta. Siempre que el
                  servicio se utilice desde la APN de Nauta, el tráfico generado
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
                <Paragraph style={{ padding: 5 }}>
                  Queda a valoración del cliente la desición de asistir o no a
                  una Unidad Comercial, teniendo en cuenta la fecha de
                  actualización,la disponibilidad y la demanda del producto que
                  busca.
                </Paragraph>
                <Paragraph style={{ padding: 5 }}>
                  Los precios de los productos obtenidos mediante el Scanner de
                  Códigos de Barras embebido en la aplicación así como por la
                  consulta en el buscador, son los precios oficiales de la
                  Cadena de Tiendas Panamericanas
                </Paragraph>
                <Paragraph style={{ padding: 5 }}>
                  Reiteramos que la información mostrada en la aplicación es
                  tomada directamente del sistema de inventario de los
                  establecimientos por lo que responde a la realidad contable
                  del mismo.
                </Paragraph>
                <Paragraph style={{ padding: 5 }}>
                  En varias secciones de la aplicación hemos puesto a su
                  disposicion un botón para llamar directamente al Número Único
                  de Atención al Cliente de Cimex. Estas llamadas serán libres
                  de costo. Su ayuda es necesaria para perfeccionar nuestro
                  trabajo y contribuir al proceso de mejora continua del
                  servicio de la Cadena de Tiendas Panamericanas.
                </Paragraph>
                <Paragraph>
                  También se encuentra disponible un botón para la comunicación
                  mediante correo electrónico con atención al clinte de la
                  Cadena de Tiendas Panamericanas. Este botón funcionará si
                  usted tiene una cuenta de correo configurada en su
                  dispositivo. El tráfico de correo electrónico no está excento
                  de pagos por lo que le será cobrado por el proveedor de
                  servicios de internet (ETECSA) según sus tarifas.
                </Paragraph>
                <Paragraph>
                  Sea parte de nuestro equipo, reporte las indisciplinas que
                  detecte durante el uso de la aplicación.
                </Paragraph>
                <Paragraph>GRACIAS</Paragraph>
              </Card.Content>
              <Divider />
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
