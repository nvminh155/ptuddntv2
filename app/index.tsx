import { useState } from "react";
import { Pressable, Text, View } from "react-native";


import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";

GoogleSignin.configure({
  webClientId:
    "718271067681-5q82c61g1roa2se4pgefj7d66kajomek.apps.googleusercontent.com",
  scopes: ["email", "openid"],
});

export default function Index() {
  const [state, setState] = useState<any>();

  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId:
  //       "1078752947613-ppngq296a267d8ia390flkmva2rhebku.apps.googleusercontent.com",
  //     iosClientId:
  //       "1078752947613-ppngq296a267d8ia390flkmva2rhebku.apps.googleusercontent.com",
  //     offlineAccess: true,
  //     scopes: ["profile", "email", "openid"],
  //   });
  // }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const tokens = await GoogleSignin.getTokens();
        console.log("TOKEN = ", tokens);

        const accessToken = tokens.accessToken;

        // const resLoginDkmh = await dkmhTdmuService
        //   .login(accessToken)
        //   .then(async (res) => {
        //     await SecureStore.setItemAsync(
        //       SESSION_SECRET_KEY,
        //       JSON.stringify({
        //         access_token: accessToken,
        //         avatarUrl: response.data.user.photo,
        //       } as TSession)
        //     );
        //   });

        // console.log(resLoginDkmh);
        setState({ userInfo: response.data , accessToken});
      } else {
        // sign in was cancelled by user
        console.log("CANCEL");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            console.log("INPROGRESS");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            console.log("service android not available or outdated");
            break;
          default:
            console.log(error.message, error.code);
            console.log("1231232");
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred

        console.error("error not related to google sign in ", error);
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Pressable onPress={signIn}>
        <Text>Login with gooogle </Text>
      </Pressable>
      <Pressable onPress={() => router.push("/todoapp")}>
        <Text>Login todo app </Text>
      </Pressable>
    </View>
  );
}
