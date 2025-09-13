import React, { useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { boxesStackRoutes } from "../../navigation/route";
import { BoxesStackParamList } from "../../navigation/types";
import { colors } from "../../constants/colors";
import { fetchBoxById } from "../../store/boxDetailsOps";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { clearBox } from "../../store/boxDetailsSlice";

type BoxDetailsRouteProp = RouteProp<
  BoxesStackParamList,
  typeof boxesStackRoutes.BOX_DETAILS
>;

export default function BoxDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<BoxDetailsRouteProp>();

  const { boxId } = route.params!;
  const dispatch = useDispatch<AppDispatch>();
  const { item: box, loading } = useSelector(
    (state: RootState) => state.boxDetails
  );

  useEffect(() => {
    dispatch(fetchBoxById(boxId));
    return () => {
      dispatch(clearBox());
    };
  }, [boxId]);

  useEffect(() => {
    if (box?.title) {
      navigation.setOptions({ title: box.title });
    }
  }, [box?.title]);

  useLayoutEffect(() => {
    if (box?.title) {
      navigation.setOptions({ title: box.title });
    }
  }, [navigation, box?.title]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!box) {
    return (
      <View style={styles.center}>
        <Text>Box not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Box Details</Text>
      <Text>Box ID: {box.id}</Text>
      <Text>Box title: {box.title}</Text>
      <Text>Items: {box.items.length ? box.items.join(", ") : "No items"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center", alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
});
