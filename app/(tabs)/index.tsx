import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, Image } from 'react-native';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitamos que nos des permiso para ocupar la camara</Text>
        <Button onPress={requestPermission} title="Dar permisos" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      setQrData(data);
      Alert.alert('Código QR escaneado', data, [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarCodeScanned}
      />
      
      {/* Elementos superpuestos con posicionamiento absoluto */}
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Rotar Camara</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require('./marco_qr_verde.png')}
        style={{
            width: 200,
            height: 200,
            position: 'absolute',
            top: '35%',
            alignSelf: 'center',
            opacity: 0.9,
        }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#00000088',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  qrBox: {
    position: 'absolute',
    top: 50,
    backgroundColor: '#000000aa',
    padding: 10,
    borderRadius: 10,
  },
  qrText: {
    color: 'white',
    fontSize: 16,
  },
});
