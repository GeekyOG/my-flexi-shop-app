import { useState } from "react";
import { View } from "react-native";
import { Badge, BottomNavigation } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Home from ".";
import Login from "../(auth)/login";
import StoreScreen from "./store";

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [cartCount, setCartCount] = useState(3); // example cart items

  const [routes] = useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    { key: "shop", title: "Categories", focusedIcon: "grid" },
    {
      key: "cart",
      title: "Cart",
      focusedIcon: "cart",
      renderIcon: ({ color, focused }: { color: string; focused: boolean }) => (
        <View>
          <MaterialCommunityIcons
            name={focused ? "cart" : "cart-outline"}
            color={color}
            size={24}
          />
          {cartCount > 0 && (
            <Badge
              style={{
                position: "absolute",
                top: -4,
                right: -10,
                backgroundColor: "#DB3022",
                color: "white",
              }}
              size={16}
            >
              {cartCount}
            </Badge>
          )}
        </View>
      ),
    },
    {
      key: "saved",
      title: "Saved",
      focusedIcon: "heart",
      unfocusedIcon: "heart-outline",
    },
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    shop: StoreScreen,
    cart: Login,
    saved: Login,
    profile: Login,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor="#DB3022"
      inactiveColor="#999"
      activeIndicatorStyle={{
        backgroundColor: "#ffe5e5",
        borderRadius: 12,
      }}
      barStyle={{
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#999",
        elevation: 8,
      }}
    />
  );
}
