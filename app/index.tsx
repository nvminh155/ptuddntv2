import { useEffect } from "react";
import { Text, View } from "react-native";

import firestore from '@react-native-firebase/firestore';

export default function Index() {
  
  useEffect(() => {
    firestore()
.collection('Users')
.add({
  name: 'Ada Lovelace',
  age: 30,
})
.then(() => {
  console.log('User added!');
});

  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
