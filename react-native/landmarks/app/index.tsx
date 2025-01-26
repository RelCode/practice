import { useNavigation } from "expo-router";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function Index() {
	const navigation = useNavigation<any>();
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View style={styles.card}>
				<Text style={styles.cardTitle}>Landmarks App</Text>
				<Text style={styles.cardDescription}>
					This app showcases various landmarks around the world. You can view details and explore different landmarks.
				</Text>
			</View>
			<TouchableOpacity
				style={styles.btn}
				onPress={() => navigation.navigate("landmarks")}
			>
				<Text
					style={styles.btnText}
				>View Landmarks</Text>
			</TouchableOpacity>
		</View>
	);
}


const styles = StyleSheet.create({
	card: {
		width: "90%",
		padding: 20,
		marginVertical: 10,
		backgroundColor: "#fff",
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
		alignSelf: "center",
	},
	cardTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 10,
		textAlign: "center",
	},
	cardDescription: {
		fontSize: 16,
		color: "#666",
		lineHeight: 24,
		textAlign: "justify",
	},
	btn: {
		backgroundColor: "#007bff",
		padding: 8,
		borderRadius: 10,
	},
	btnText: {
		color: "#fff",
		fontSize: 22,
	},
});