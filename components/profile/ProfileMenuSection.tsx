import React from "react";
import { StyleSheet, Text, View } from "react-native";
import RenderMenuItem from "./menuItems";

function ProfileMenuSection({ section, key }: { section: any; key: number }) {
  return (
    <View key={key} style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.menuCard}>
        {section.items.map((item, itemIndex) => (
          <React.Fragment key={itemIndex}>
            <RenderMenuItem item={item} index={itemIndex} />
            {itemIndex < section.items.length - 1 && (
              <View style={styles.divider} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

export default ProfileMenuSection;

const styles = StyleSheet.create({
  menuSection: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 12,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 72,
  },
});
