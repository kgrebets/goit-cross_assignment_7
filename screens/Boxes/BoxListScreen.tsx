import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import BoxList from "../../components/BoxList/BoxList";
import { Box } from "../../models/Box";
import { colors } from "../../constants/colors";
import SearchBar from "../../components/SearchBar/SearchBar";
import Button from "../../components/Button/Button";
import { useNavigation } from "@react-navigation/native";
import { boxesStackRoutes } from "../../navigation/route";
import { BoxesStackParamList } from "../../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { addBox, fetchBoxes } from "../../store/boxesOps";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";

type BoxListNavProp = StackNavigationProp<
  BoxesStackParamList,
  typeof boxesStackRoutes.BOXES_LIST
>;

export default function BoxListScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: boxes, loading } = useSelector(
    (state: RootState) => state.boxes
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchBoxes());
  }, [dispatch]);

  const filteredBoxes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return boxes;
    return boxes.filter((b) => {
      const inTitle = b.title.toLowerCase().includes(q);
      const inItems = b.items?.some((it) => it.toLowerCase().includes(q));
      return inTitle || inItems;
    });
  }, [boxes, query]);

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const handleAdd = () => {
    const n = (boxes.length || 0) + 1;
    const newBox = {
      title: `New box #${n}`,
      createdAt: new Date().toISOString(),
      imageUrl: "https://picsum.photos/seed/newbox/200",
      items: [],
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    dispatch(addBox(newBox));
  };

  const navigation = useNavigation<BoxListNavProp>();
  const handleOpen = (box: Box) => {
    navigation.navigate(boxesStackRoutes.BOX_DETAILS, { boxId: box.id });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      <BoxList data={filteredBoxes} onPressBox={handleOpen} />

      <View style={styles.addContainer}>
        <Button label="Add box" icon="add" onPress={handleAdd} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  addContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
