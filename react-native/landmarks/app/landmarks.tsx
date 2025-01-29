import { useState, useEffect } from "react";
import { ScrollView, Dimensions, View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";

const { width } = Dimensions.get("window");

export interface Landmark {
    name: string;
    base64: string;
}

const Landmarks = () => {
	const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<Landmark[]>([]);

	const handleScroll = (event: any) => {
		const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
		if (slide !== activeIndex) {
			setActiveIndex(slide);
		}
	};

    const getName = (name: string) => {
        let unscrambled = name.replace(".webp","").replace("_"," ");
        const unscrambledArr: string[] = unscrambled.split(" ").map((word: string) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return unscrambledArr.join(" ");
    }

    useEffect(() => {
        fetch(`${process.env.EXPO_PUBLIC_API_ENDPOINT}/landmarks`)
			.then((response) => response.json())
			.then((data) => {
				setImages(data);
				setLoading(false);
			})
			.catch((error) => console.error("Error fetching images:", error));
      }, []);

	return (
		<ScrollView
			horizontal
			pagingEnabled
			showsHorizontalScrollIndicator={false}
			onScroll={handleScroll}
			scrollEventThrottle={16}
			style={styles.scrollView}
		>
			{loading ? (<View style={styles.imageContainer}><ActivityIndicator size={"large"} /></View>) : images.map((mark: Landmark, index: number) => {
                return (
                    <View style={styles.imageContainer} key={index}>
                        <Text style={styles.imageName}>{getName(mark.name)}</Text>
                        <Image
                            width={width}
                            height={450}
                            source={{ uri: `data:image/webp;base64,${mark.base64}` }}
                        />
                    </View>
                )
            })}
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
    imageName: {
        fontSize: 24,
        fontWeight: "bold",
        padding: 10,
        textDecorationLine: "underline",
    }
});

export default Landmarks;
