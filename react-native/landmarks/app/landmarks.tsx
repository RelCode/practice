import { useState, useEffect } from "react";
import { ScrollView, Dimensions, View, Text, StyleSheet, Image } from "react-native";

const { width } = Dimensions.get("window");

export interface Landmark {
    id: number;
    name: string;
    imageUrl: string;
    description: string;
}

const Landmarks = () => {
	const [activeIndex, setActiveIndex] = useState(0);
    const [images, setImages] = useState<Landmark[]>([]);

	const handleScroll = (event: any) => {
		const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
		if (slide !== activeIndex) {
			setActiveIndex(slide);
		}
	};

    useEffect(() => {
        fetch("http://localhost:3001/api/landmarks")
          .then(response => response.json())
          .then(data => {
            setImages(data);
          })
          .catch(error => console.error("Error fetching images:", error));
      }, []);

      console.log(images);

	return (
		<ScrollView
			horizontal
			pagingEnabled
			showsHorizontalScrollIndicator={false}
			onScroll={handleScroll}
			scrollEventThrottle={16}
			style={styles.scrollView}
		>
			{images.map((mark: Landmark, index: number) => {
                console.log("mark", mark.imageUrl);
                return (
                    <View style={styles.imageContainer} key={index}>
                        <Text>{mark.name}</Text>
                        <Image
                            width={width}
                            height={450}
                            source={{ uri: mark.imageUrl }}
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
});

export default Landmarks;
