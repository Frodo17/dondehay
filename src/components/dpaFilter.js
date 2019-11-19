import React, { Component } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Card, Text, Appbar, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationEvents } from "react-navigation";

const municipios = [
  {
    name: "Prinar del Rio",
    id: "01",
    children: [
      { id: "0110", name: "CONSOLACION DEL SUR" },
      { id: "0114", name: "GUANES" },
      { id: "0105", name: "LA PALMA" },
      { id: "0109", name: "LOS PALACIOS" },
      { id: "0102", name: "MANTUA" },
      { id: "0103", name: "MINAS DE MATAHAMBRE" },
      { id: "0111", name: "PINAR DEL RIO" },
      { id: "0101", name: "SANDINO" },
      { id: "0113", name: "SAN JUAN Y MARTINEZ" },
      { id: "0112", name: "SAN LUIS" },
      { id: "0104", name: "VIÑALES" }
    ]
  },
  {
    name: "Artemisa",
    id: "02",
    children: [
      { id: "0218", name: "ALQUIZAR" },
      { id: "0219", name: "ARTEMISA" },
      { id: "0220", name: "BAHIA HONDA" },
      { id: "0204", name: "BAUTA" },
      { id: "0203", name: "CAIMITO" },
      { id: "0221", name: "CANDELARIA" },
      { id: "0202", name: "GUANAJAY" },
      { id: "0217", name: "GUIRA DE MELENA" },
      { id: "0201", name: "MARIEL" },
      { id: "0205", name: "SAN ANTONIO DE LOS BAÑOS" },
      { id: "0222", name: "SAN CRISTOBAL" }
    ]
  },
  {
    name: "Mayabeque",
    id: "03",
    children: [
      { id: "1510", name: "BATABANO" },
      { id: "1501", name: "BEJUCAL" },
      { id: "1508", name: "GUINES" },
      { id: "9901", name: "ISLA DE LA JUVENTUD" },
      { id: "1503", name: "JARUCO" },
      { id: "1505", name: "MADRUGA" },
      { id: "1502", name: "SAN JOSE DE LAS LAJAS" },
      { id: "1509", name: "MELENA DEL SUR" },
      { id: "1506", name: "NUEVA PAZ" },
      { id: "1511", name: "QUIVICAN" },
      { id: "1507", name: "SAN NICOLAS" },
      { id: "1504", name: "SANTA CRUZ DEL NORTE" }
    ]
  },
  {
    name: "La Habana",
    id: "04",
    children: [
      { id: "0309", name: "10 DE OCTUBRE" },
      { id: "0314", name: "ARROYO NARANJO" },
      { id: "0313", name: "BOYEROS" },
      { id: "0303", name: "CENTRO HABANA" },
      { id: "0310", name: "CERRO" },
      { id: "0315", name: "COTORRO" },
      { id: "0307", name: "GUANABACOA" },
      { id: "0306", name: "LA HABANA DEL ESTE" },
      { id: "0304", name: "LA HABANA VIEJA" },
      { id: "0312", name: "LA LISA" },
      { id: "0311", name: "MARIANAO" },
      { id: "0301", name: "PLAYA" },
      { id: "0302", name: "PLAZA DE LA REVOLUCION" },
      { id: "0305", name: "REGLA" },
      { id: "0308", name: "SAN MIGUEL DEL PADRON" }
    ]
  },
  {
    name: "Matanzas",
    id: "05",
    children: [
      { id: "0413", name: "CALIMETE" },
      { id: "0402", name: "CARDENAS" },
      { id: "0411", name: "CIENAGA DE ZAPATA" },
      { id: "0405", name: "COLON" },
      { id: "0401", name: "MATANZAS" },
      { id: "0412", name: "JAGUEY GRANDE" },
      { id: "0407", name: "JOVELLANOS" },
      { id: "0409", name: "LIMONAR" },
      { id: "0414", name: "LOS ARABOS" },
      { id: "0404", name: "MARTI" },
      { id: "0408", name: "PEDRO BETANCOURT" },
      { id: "0406", name: "PERICO" },
      { id: "0410", name: "UNION DE REYES" },
      { id: "0403", name: "VARADERO" }
    ]
  },
  {
    name: "Villa Clara",
    id: "06",
    children: [
      { id: "0506", name: "CAIBARIEN" },
      { id: "0505", name: "CAMAJUANI" },
      { id: "0510", name: "CIFUENTES" },
      { id: "0501", name: "CORRALILLO" },
      { id: "0504", name: "ENCRUCIJADA" },
      { id: "0513", name: "MANICARAGUA" },
      { id: "0508", name: "PLACETAS" },
      { id: "0502", name: "QUEMADO DE GUINES" },
      { id: "0503", name: "SAGUA LA GRANDE" },
      { id: "0512", name: "RANCHUELO" },
      { id: "0507", name: "REMEDIOS" },
      { id: "0509", name: "SANTA CLARA" },
      { id: "0511", name: "SANTO DOMINGO" }
    ]
  },
  {
    name: "Cienfuegos",
    id: "07",
    children: [
      { id: "0608", name: "ABREUS" },
      { id: "0601", name: "AGUADA DE PASAJEROS" },
      { id: "0607", name: "CIENFUEGOS" },
      { id: "0605", name: "CRUCES" },
      { id: "0606", name: "CUMANAYAGUA" },
      { id: "0604", name: "LAJAS" },
      { id: "0603", name: "PALMIRA" },
      { id: "0602", name: "RODAS" }
    ]
  },
  {
    name: "Sacti Spiritus",
    id: "08",
    children: [
      { id: "0704", name: "CABAIGUAN" },
      { id: "0705", name: "FOMENTO" },
      { id: "0702", name: "JATIBONICO" },
      { id: "0708", name: "LA SIERPE" },
      { id: "0703", name: "TAGUASCO" },
      { id: "0706", name: "TRINIDAD" },
      { id: "0707", name: "SANCTI SPIRITUS" },
      { id: "0701", name: "YAGUAJAY" }
    ]
  },
  {
    name: "Ciego de Avila",
    id: "09",
    children: [
      { id: "0810", name: "BARAGUA" },
      { id: "0803", name: "BOLIVIA" },
      { id: "0801", name: "CHAMBAS" },
      { id: "0808", name: "CIEGO DE AVILA" },
      { id: "0805", name: "CIRO REDONDO" },
      { id: "0806", name: "FLORENCIA" },
      { id: "0807", name: "MAJAGUA" },
      { id: "0802", name: "MORON" },
      { id: "0804", name: "PRIMERO DE ENERO" },
      { id: "0809", name: "VENEZUELA" }
    ]
  },
  {
    name: "Camaguey",
    id: "10",
    children: [
      { id: "0908", name: "CAMAGUEY" },
      { id: "0901", name: "CARLOS MANUEL DE CESPEDES" },
      { id: "0902", name: "ESMERALDA" },
      { id: "0909", name: "FLORIDA" },
      { id: "0906", name: "GUAIMARO" },
      { id: "0911", name: "JIMAGUAYU" },
      { id: "0904", name: "MINAS" },
      { id: "0912", name: "NAJASA" },
      { id: "0905", name: "NUEVITAS" },
      { id: "0913", name: "SANTA CRUZ DEL SUR" },
      { id: "0907", name: "SIBANICU" },
      { id: "0903", name: "SIERRA DE CUBITAS" },
      { id: "0910", name: "VERTIENTES" }
    ]
  },
  {
    name: "Las Tunas",
    id: "11",
    children: [
      { id: "1008", name: "AMANCIO" },
      { id: "1007", name: "COLOMBIA" },
      { id: "1003", name: "JESUS MENENDEZ" },
      { id: "1006", name: "JOBABO" },
      { id: "1005", name: "LAS TUNAS" },
      { id: "1004", name: "MAJIBACOA" },
      { id: "1001", name: "MANATI" },
      { id: "1002", name: "PUERTO PADRE" }
    ]
  },
  {
    name: "Holguín",
    id: "12",
    children: [
      { id: "1104", name: "ANTILLA" },
      { id: "1105", name: "BAGUANOS" },
      { id: "1103", name: "BANES" },
      { id: "1108", name: "CACOCUM" },
      { id: "1107", name: "CALIXTO GARCIA" },
      { id: "1110", name: "CUETO" },
      { id: "1112", name: "FRANK PAIS" },
      { id: "1101", name: "GIBARA" },
      { id: "1106", name: "HOLGUIN" },
      { id: "1111", name: "MAYARI" },
      { id: "1114", name: "MOA" },
      { id: "1102", name: "RAFAEL FREIRE" },
      { id: "1113", name: "SAGUA DE TANAMO" },
      { id: "1109", name: "URBANO NORIS" }
    ]
  },
  {
    name: "Granma",
    id: "13",
    children: [
      { id: "1211", name: "BARTOLOME MASO" },
      { id: "1204", name: "BAYAMO" },
      { id: "1212", name: "BUEY ARRIBA" },
      { id: "1207", name: "CAMPECHUELA" },
      { id: "1202", name: "CAUTO CRISTO" },
      { id: "1213", name: "GUISA" },
      { id: "1203", name: "JIGUANI" },
      { id: "1206", name: "MANZANILLO" },
      { id: "1208", name: "MEDIA LUNA" },
      { id: "1201", name: "RIO CAUTO" },
      { id: "1209", name: "NIQUERO" },
      { id: "1210", name: "PILON" },
      { id: "1205", name: "YARA" }
    ]
  },
  {
    name: "Santiago de Cuba",
    id: "14",
    children: [
      { id: "1301", name: "CONTRAMAESTRE" },
      { id: "1309", name: "GUAMA" },
      { id: "1302", name: "MELLA" },
      { id: "1307", name: "PALMA SORIANO" },
      { id: "1303", name: "SAN LUIS" },
      { id: "1306", name: "SANTIAGO DE CUBA" },
      { id: "1304", name: "SEGUNDO FRENTE" },
      { id: "1305", name: "SONGO - LA MAYA" },
      { id: "1308", name: "TERCER FRENTE" }
    ]
  },
  {
    name: "Guantanamo",
    id: "15",
    children: [
      { id: "1404", name: "BARACOA" },
      { id: "1409", name: "CAIMANERA" },
      { id: "1401", name: "EL SALVADOR" },
      { id: "1402", name: "GUANTANAMO" },
      { id: "1406", name: "IMIAS" },
      { id: "1405", name: "MAISI" },
      { id: "1408", name: "MANUEL TAMES" },
      { id: "1410", name: "NICETO PEREZ" },
      { id: "1407", name: "SAN ANTONIO DEL SUR" },
      { id: "1403", name: "YATERAS" }
    ]
  }
];

export default class DpaFilter extends Component {
  constructor() {
    super();
    this.state = {
      selectedDpa: [],
      primaryColor: "#0D4D29"
    };
  }

  componentDidMount() {
    this.setState({
      selectedDpa: this.props.screenProps.dpaSelected
    });
  }

  onSelectedItemsChange = selectedDpa => {
    this.setState({ selectedDpa });
    this.props.screenProps.setDpaSelected(selectedDpa);
    this.storeDpaFilter();
  };

  storeDpaFilter = async () => {
    this.props.screenProps.setFilterUpdated(true);

    const data = await this.time2Storage();
    if (data !== null) {
      try {
        await AsyncStorage.setItem(
          "@Dpa",
          JSON.stringify(this.props.screenProps.dpaSelected)
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

  render() {
    return (
      <View>
        <NavigationEvents
          onDidFocus={payload => {
            this.setState({
              selectedDpa: this.props.screenProps.dpaSelected
            });
          }}
          onDidBlur={payload => {}}
        />
        <View>
          <Appbar.Header style={{ backgroundColor: this.state.primaryColor }}>
            <Appbar.Action
              icon="arrow-back"
              onPress={() => this.props.navigation.navigate("Finder")}
            />
            <Appbar.Content
              title="¡Donde Hay!"
              subtitle="Filtro Provincias/Municipios"
            />
          </Appbar.Header>
        </View>
        <ScrollView>
          <View style={{ padding: 5 }}>
            <Card>
              <Card.Content>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="map" size={25} />
                  <Text style={{ fontWeight: "bold", padding: 5 }}>
                    Filtro de Municipios
                  </Text>
                </View>
                <Divider />
                <Text note style={{ textAlign: "auto" }}>
                  En esta sección usted podrá establecer filtros asociados a su
                  provincia o municipio.
                </Text>
                <Text note>
                  Los filtros que seleccione serán guardados de forma permanente
                  e impactarán en el resultado de su búsqueda.
                </Text>
                <Text note>
                  La no selección de municipios implíca se incluyan todos los
                  resultados en la búsqueda.
                </Text>
              </Card.Content>
            </Card>
          </View>

          <View style={{ paddingBottom: 60 }}>
            <SectionedMultiSelect
              items={municipios}
              uniqueKey="id"
              subKey="children"
              selectText="Municipios..."
              showDropDowns={true}
              selectChildren={true}
              readOnlyHeadings={false}
              showRemoveAll={true}
              onSelectedItemsChange={this.onSelectedItemsChange}
              selectedItems={this.state.selectedDpa}
              selectedText="Seleccionados"
              confirmText="Confirmar"
              searchPlaceholderText="Buscar"
              removeAllText="Quitar todos..."
              primary={this.state.primaryColor}
              showChips={true}
              noResultsComponent={<Text>No existen coincidencias...</Text>}
              colors={{ primary: this.state.primaryColor }}
              parentChipsRemoveChildren={true}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
