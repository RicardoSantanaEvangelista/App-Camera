import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Modal, Image} from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import * as Permission from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';



export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermisson, setHaspermisson] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestPermissionsAsync();
        setHaspermisson(status === 'granted');
    })();

    (async () => {
      const {status} = await Permission.askAsync(Permission.CAMERA_ROLL);
        setHaspermisson(status === 'granted');
    })();

  }, []);

  if(hasPermisson === null){
    return <View/>;

  }

  if(hasPermisson === false){
    return <Text>Acesso Negado !</Text>;

  }

  async function takePicture(){
    if(camRef){
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
      console.log(data);
    }

  }


  async function savePicture(){
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
    .then(() => {
      alert('Salvo com sucesso !');
    })
    .catch(error => {
      console.log('err', error);
    })

  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={{flex: 1}}
        type={type}
        ref={camRef}
        >

        <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}> 
          <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            backgroundColor: 'orange',
            borderRadius: 30,
            width: 50,
            height:30,
          }}
          onPress ={() => {
            setType(
              type === Camera.Constants.Type.back 
              ?Camera.Constants.Type.front
              :Camera.Constants.Type.back
            );
          }}
          >
            <Text style={{ fontSize: 15, marginBottom: 13, color: '#FFF', margin: 3, alignItems:'center', alignContent:'center'}}>Trocar</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <TouchableOpacity style={styles.button} onPress={ takePicture }>
          <FontAwesome name="camera" size={23} color="#FFF"/>
      </TouchableOpacity>

        { capturedPhoto && 
          <Modal
            animationType="slide"
            transparent={false}
            visible={open}
            >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20}}>


              <View style={{margin: 10, flexDirection: 'row'}}>
                <TouchableOpacity style={{margin: 10}} onPress={() => setOpen(false)}>
                  <FontAwesome name="window-close" size={50} color="#FF0000"/>
                </TouchableOpacity>

                <TouchableOpacity style={{margin: 10}} onPress={ savePicture }>
                  <FontAwesome name="upload" size={50} color="#121212"/>
                </TouchableOpacity>
              </View>

              <Image 
                style={{width: '100%', height: 450, borderRadius: 20}}
                source={{ uri: capturedPhoto}}
              
              
              />

            </View>
          </Modal>
        }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    margin: 20,
    borderRadius: 10,
    height: 50,
  },
});
