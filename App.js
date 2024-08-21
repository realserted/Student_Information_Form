import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [image, setImage] = useState(null);
  const [idno, setIdno] = useState('');
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [course, setCourse] = useState('');
  const [level, setLevel] = useState('');

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus.status !== 'granted' || cameraRollStatus.status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera and camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveData = async () => {
    if (!idno || !lastname || !firstname || !course || !level || !image) {
      Alert.alert('Error', 'Please fill all fields and select an image');
      return;
    }

    const formData = new FormData();
    formData.append('idno', idno);
    formData.append('lastname', lastname);
    formData.append('firstname', firstname);
    formData.append('course', course);
    formData.append('level', level);
    formData.append('image', {
      uri: image,
      name: `${idno}.jpg`,
      type: 'image/jpeg',
    });

    try {
      const response = await fetch(`http://192.168.160.65:4321/saveimage?idno=${idno}&lastname=${lastname}&firstname=${firstname}&course=${course}&level=${level}&image=${image}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Data saved successfully');
      } else {
        Alert.alert('Error', 'Failed to save data');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving data');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Student Information Form</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Pick an image from Gallery" onPress={pickImage} />
        <Button title="Take a photo" onPress={takePhoto} />
      </View>
      
      {image && (
        <View style={styles.imageContainer}>
          <Text style={styles.imageTitle}>Selected Image</Text>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="ID Number"
        placeholderTextColor="black"
        value={idno}
        onChangeText={setIdno}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="black"
        value={lastname}
        onChangeText={setLastname}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="black"
        value={firstname}
        onChangeText={setFirstname}
      />
      <TextInput
        style={styles.input}
        placeholder="Course"
        placeholderTextColor="black"
        value={course}
        onChangeText={setCourse}
      />
      <TextInput
        style={styles.input}
        placeholder="Level"
        placeholderTextColor="black"
        value={level}
        onChangeText={setLevel}
      />

      <Button title="Save" onPress={saveData} />

      <View style={styles.preview}>
        <Text style={styles.previewTitle}>Preview</Text>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        <Text>ID Number: {idno}</Text>
        <Text>Last Name: {lastname}</Text>
        <Text>First Name: {firstname}</Text>
        <Text>Course: {course}</Text>
        <Text>Level: {level}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  preview: {
    marginTop: 20,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});
