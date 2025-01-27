import { useState } from "react";
import { ScrollView, Dimensions, View, Text, StyleSheet, Image } from "react-native";

const { width } = Dimensions.get("window");

export interface Landmark {
    id: number;
    name: string;
    image: string;
    description: string;
}

const Landmarks = () => {
	const [activeIndex, setActiveIndex] = useState(0);

	const handleScroll = (event: any) => {
		const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
		if (slide !== activeIndex) {
			setActiveIndex(slide);
		}
	};

	return (
		<ScrollView
			horizontal
			pagingEnabled
			showsHorizontalScrollIndicator={false}
			onScroll={handleScroll}
			scrollEventThrottle={16}
			style={styles.scrollView}
		>
			{/* {data.map((mark: Landmark) => (
				<View style={styles.imageContainer} key={mark.id}>
					<Text>{mark.name}</Text>
                    <Image
                        width={width}
                        height={450}
                        source={require(`./assets/images/landmarks/${mark.image}`)}
                    />
                    <Text>{mark.description}</Text>
				</View>
			))} */}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	scrollView: {
		width,
	},
	imageContainer: {
		width,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Landmarks;
