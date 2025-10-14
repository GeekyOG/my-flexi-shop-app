import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

export const storeStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Search Section
  searchWrapper: {
    paddingHorizontal: 16,
  },

  // Layout
  layoutContainer: {
    backgroundColor: "#fafafa",
    flexDirection: "row",
    gap: 8,
  },

  // Sidebar Categories
  categoryList: {
    width: "25%",
    backgroundColor: "#fff",
    height: height - 170,
  },
  categoryItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  categoryText: {
    fontSize: 12,
  },

  // Right Section
  contentScroll: {
    width: "75%",
    height: height - 170,
    backgroundColor: "#fafafa",
  },

  // Header Row (View All)
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
  },
  sectionHeaderText: {
    fontWeight: "700",
    fontSize: 12,
  },

  // Grid Section
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },

  gridHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingBottom: 8,
  },
  gridHeaderText: {
    fontWeight: "700",
    fontSize: 12,
  },
  gridViewAll: {
    fontSize: 12,
    color: "#DB3022",
  },

  gridItem: {
    width: "30%", // 3 items per row
    backgroundColor: "#f3f3f3",
    padding: 8,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
});
