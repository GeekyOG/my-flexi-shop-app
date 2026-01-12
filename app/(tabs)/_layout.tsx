import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Badge, BottomNavigation } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Home from ".";
import { useGetCartQuery } from "../api/cartApi";
import CartScreen from "./cart";
import Profile from "./profile";
import Saved from "./saved";
import StoreScreen from "./store";

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [cartCount, setCartCount] = useState(3); // example cart items

  const route = useRouter();

  const handleCartPress = () => {
    route.push("/checkout/CartScreen");
  };

  const [routes] = useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "shop",
      title: "Categories",
      focusedIcon: "menu",
      unfocusedIcon: "menu",
    },
    {
      key: "cart",
      title: "Cart",
      focusedIcon: "cart",
      unfocusedIcon: "cart-outline",
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
    cart: CartScreen,
    saved: Saved,
    profile: Profile,
  });

  const { data: cartData } = useGetCartQuery({});

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={(newIndex) => {
        const selectedRoute = routes[newIndex];
        if (selectedRoute.key === "cart") {
          handleCartPress();
        } else {
          setIndex(newIndex);
        }
      }}
      renderScene={renderScene}
      renderIcon={({ route, focused, color }) => {
        if (route.key === "cart") {
          return (
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
                  {cartData?.data?.itemCount ?? 0}
                </Badge>
              )}
            </View>
          );
        }
        return (
          <MaterialCommunityIcons
            name={focused ? route.focusedIcon : route.unfocusedIcon}
            color={color}
            size={24}
          />
        );
      }}
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
