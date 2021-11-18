import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
  Pressable,
  Image,
} from "react-native";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";

const App = () => {
  const [apiKey, setApiKey] = useState("");
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [id, setId] = useState("");

  const chooseImage = () => {
    try {
      launchImageLibrary({ mediaType: "photo" }, (response) => {
        setPhoto(response.assets[0]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const chooseVideo = () => {
    try {
      launchImageLibrary({ mediaType: "video" }, (response) => {
        setVideo(response.assets[0]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async () => {
    try {
      if (apiKey === "") {
        Alert.alert(
          "API Key Required",
          "No API Key was provided",
          [{ text: "Ok" }],
          {
            cancelable: true,
          },
        );
        return;
      }

      const formData = new FormData();
      formData.append("image", {
        uri: photo.uri,
        type: photo.type,
        name: photo.fileName,
      });

      const result = await axios.post(
        `http://192.168.43.145:5000/app/image/${apiKey}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (result.status === 404) {
        ToastAndroid.show("Something Went Wrong", ToastAndroid.SHORT);
      } else {
        setId(result.data.id ? result.data.id : "");
        ToastAndroid.show(result.data.msg, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadVideo = async () => {
    try {
      if (apiKey === "") {
        Alert.alert(
          "API Key Required",
          "No API Key was provided",
          [{ text: "Ok" }],
          {
            cancelable: true,
          },
        );
        return;
      }

      const formData = new FormData();
      formData.append("video", {
        uri: video.uri,
        type: video.type,
        name: video.fileName,
      });

      const result = await axios.post(
        `http://192.168.43.145:5000/app/video/${apiKey}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (result.status === 404) {
        ToastAndroid.show("Something Went Wrong", ToastAndroid.SHORT);
      } else {
        setId(result.data.id ? result.data.id : "");
        ToastAndroid.show(result.data.msg, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetMedia = () => {
    setPhoto(null);
    setVideo(null);
    setId("");
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="API Key"
            maxLength={31}
            value={apiKey}
            onChangeText={(text) => {
              setApiKey(text);
            }}
          />
          {photo !== null && (
            <Image
              resizeMode="contain"
              source={{ uri: photo.uri, width: "90%", height: 500 }}
            />
          )}
          {video !== null && (
            // <Video
            //   style={{ width: '90%', height: 500 }}
            //   source={{ uri: video }}
            //   controls
            //   resizeMode="contain"
            // />
            <Text style={{ marginTop: 10 }}>Video Preview Not Available</Text>
          )}
          <View style={styles.btnContainer}>
            {video === null && photo === null && (
              <>
                <Pressable style={styles.chooseImageBtn} onPress={chooseImage}>
                  <Text>Choose Image</Text>
                </Pressable>
                <Pressable style={styles.chooseImageBtn} onPress={chooseVideo}>
                  <Text>Choose Video</Text>
                </Pressable>
              </>
            )}
            {video === null && photo !== null && (
              <>
                <Pressable style={styles.chooseImageBtn} onPress={chooseImage}>
                  <Text>Choose Image</Text>
                </Pressable>
                <Pressable style={styles.chooseImageBtn} onPress={uploadImage}>
                  <Text>Upload Image</Text>
                </Pressable>
              </>
            )}
            {photo === null && video !== null ? (
              <>
                <Pressable style={styles.chooseImageBtn} onPress={chooseVideo}>
                  <Text>Choose Video</Text>
                </Pressable>
                <Pressable style={styles.chooseImageBtn} onPress={uploadVideo}>
                  <Text>Upload Video</Text>
                </Pressable>
              </>
            ) : null}
          </View>
          <Pressable style={styles.resetBtn} onPress={resetMedia}>
            <Text>X</Text>
          </Pressable>
          {id !== "" ? (
            <Text
              style={{ marginTop: 10 }}
              selectable={true}
              selectionColor="orange">
              {id}
            </Text>
          ) : null}
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    overflow: "scroll",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    minWidth: 250,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
  },
  chooseImageBtn: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 6,
    margin: 20,
  },
  resetBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
    width: 40,
    padding: 10,
    borderRadius: 6,
  },
});

export default App;
