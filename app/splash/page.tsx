import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./style";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Part payments for your house!",
    description:
      "Shop and pay conveniently in installments. Get what you want now and pay over time.",
    image: require("../../assets/images/slide1.jpg"),
  },
  {
    id: "2",
    title: "Manage your installments!",
    description:
      "Easily track your payments, due dates, and manage your purchases in one place.",
    image: require("../../assets/images/slide2.jpg"),
  },
  {
    id: "3",
    title: "Best e-commerce with us!",
    description:
      "Enjoy a seamless shopping experience with exclusive offers and flexible payments.",
    image: require("../../assets/images/slide3.jpg"),
  },
];

const SplashScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<any>(null);
  const router = useRouter();
  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      ref.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      AsyncStorage.setItem("hasLaunched", "true");
      router.push("/(auth)/login");
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <FlatList
            data={slides}
            ref={ref}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <Image
                  source={item.image}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            )}
          />

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, currentIndex === i && styles.activeDot]}
              />
            ))}
          </View>

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
