import { StyleSheet } from "react-native";
import { colors, fontFamily } from "@/styles/theme";

export const styles = StyleSheet.create({
    logo: {
        width: 48,
        height: 48,
        marginBottom: 24,
        marginTop: 28,
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: 24,
        color: colors.gray[600],
    },
    subTitle: {
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: colors.gray[500],
        marginTop: 12,
    }
});