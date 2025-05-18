import { useState } from "react";

import { useAuth } from "@/contexts/auth-context";
import { Redirect } from "expo-router";

export default function Index() {
  const [image, setImage] = useState<string>("");
  const { user } = useAuth();
  async function po() {
    const url = "http://192.168.1.138:5678/webhook-test/get-book-by-name";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        bookName: "underland",
      }),
    });
    try {
      console.log("res", res);

      const blob = await res.blob();

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64data = reader.result as any; // data:image/jpeg;base64,...
        const correctedBase64 = base64data.replace(
          /^data:application\/octet-stream/,
          "data:image/jpeg"
        );
        setImage(correctedBase64 as any);
      };

      reader.readAsDataURL(blob); // Triggers reader.onloadend
    } catch (err) {
      console.error(err);
    }
  }

  console.log(image.slice(0, 60));
  return <Redirect href={!user ? "/(auth)/login" : "/(main)/(tabs)/Home"} />;
}
