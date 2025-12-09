import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

const Banners = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const bannerWidth = width - 32;
  const totalBanners = 2;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % totalBanners;

        scrollViewRef.current?.scrollTo({
          x: nextIndex * bannerWidth,
          animated: true,
        });

        return nextIndex;
      });
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [bannerWidth]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / bannerWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        <Image
          style={[styles.banner, { width: bannerWidth }]}
          contentFit="cover"
          source={require("../../assets/images/banner1.png")}
        />
        <Image
          style={[styles.banner, { width: bannerWidth }]}
          contentFit="cover"
          source={require("../../assets/images/banner2.png")}
        />
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {Array.from({ length: totalBanners }).map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingBottom: 20,
  },
  banner: {
    height: 170,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 24,
  },
});

export default Banners;
