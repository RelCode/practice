import React, { useState, useEffect } from "react";

export type Rating = {
    id: number;
    title: string;
    author: string;
    price: number;
    stock: number;
}

const Ratings : React.FunctionComponent = () => {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log("Fetching data from .NET API");
        fetch("/api/ratings", {
                method: "GET"
            })
            .then(response => response.json())
            .then(data => {
                console.log("Data", data);
            })
            .catch(error => {
                console.error("Error", error);
            })
            .finally(() => setLoading(false));
    },[]);

    return (
        <div>
            <h1>Ratings</h1>
        </div>
    )
}

export default Ratings;