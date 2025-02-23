import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import { RNCamera, Barcode } from "react-native-camera";
import BarcodeMask from "react-native-barcode-mask";
import { withNavigationFocus } from "react-navigation";

class BarScan extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];

    this.state = {
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto
      },
      snackVisible: false,
      snackColor: "#e74c3c",
      snackText: "Empty"
    };
  }

  onBarCodeRead(scanResult) {
    if (scanResult.type != "EAN_13") {
      this.setState({
        isFetching: false,
        snackColor: "#e74c3c",
        snackText:
          "El código escaneado no se corresponde con los utilizados en nuestros productos. Debe escanear un código EAN 13.",
        snackVisible: true
      });
    } else {
      this.props.screenProps.setScanned(scanResult.data);
      this.props.navigation.navigate("Finder");
      return;
    }
  }

  render() {
    const { isFocused } = this.props;
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (isFocused) {
      return (
        <View style={styles.container}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            defaultTouchToFocus
            flashMode={this.state.camera.flashMode}
            androidCameraPermissionOptions={{
              title: "Permiso para utilizar la camara",
              message:
                "¡Donde Hay! necesita acceder a la camara para poder escanear.",
              buttonPositive: "Ok",
              buttonNegative: "Cancelar"
            }}
            mirrorImage={false}
            onBarCodeRead={this.onBarCodeRead.bind(this)}
            onFocusChanged={() => {}}
            onZoomChanged={() => {}}
            style={styles.preview}
            type={this.state.camera.type}
          >
            <BarcodeMask
              width={300}
              height={200}
              showAnimatedLine={true}
              transparency={0.8}
            />
          </RNCamera>

          <View style={[styles.overlay, styles.topOverlay]}>
            <Text style={styles.scanScreenMessage}>
              Coloque el código de barras dentro del visor.
            </Text>
          </View>
          <View style={[styles.overlay, styles.bottomOverlay]}>
            <View style={{ width: "80%" }}>
              <Text style={styles.bottomScreenMessage}>
                Los precios obtenidos son los precios oficiales en Tiendas
                Panamericanas.
              </Text>
            </View>
            <View style={{ width: "20%", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  borderColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  borderStyle: "solid",
                  borderWidth: 1,
                  width: 60,
                  height: 30
                }}
                onPress={() => {
                  this.props.navigation.navigate("Finder");
                }}
              >
                <Text style={{ color: "white" }}>Salir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = {
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  overlay: {
    position: "absolute",
    padding: 16,
    right: 0,
    left: 0,
    alignItems: "center"
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 40
  },
  scanScreenMessage: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  bottomScreenMessage: {
    fontSize: 14,
    color: "white",
    textAlign: "left",
    alignItems: "center",
    justifyContent: "center"
  }
};

export default withNavigationFocus(BarScan);
