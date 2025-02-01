import React, { useState, useEffect } from "react";
import "./Ratings.css";

export type Rating = {
    id: number;
    book_id: number;
    comment: string;
    dateRated: string;
    rate: number;
    reviewer: string;
}

export type Book = {
    id: number;
    title: string;
    author: string;
    price: number;
    stock: number;
    ratings: Rating[];
}

const Ratings : React.FunctionComponent = () => {
    const [ratings, setRatings] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const getRatings = (ratings: Rating[]) => {
        let total: number = 0;
        ratings.forEach((rating) => {
            total += rating.rate;
        });
        return total / ratings.length;
    }

    useEffect(() => {
        fetch("/api/books", {
                method: "GET"
            })
            .then(response => {
                if (response){
                    return response.json();
                }
            })
            .then(data => {
                console.log(data);
                setRatings(data);
            })
            .catch(error => {
                setErrorMsg("Error loading data");
            })
            .finally(() => setLoading(false));
    },[]);

    if (loading){
        return <h1>Loading...</h1>
    }

    return (
        <div>
            { ratings.length === 0 ? <h2>No ratings found</h2> : ratings.map((rating) => {
                return (
                    <div className="rating-card" key={rating.id}>
                        <h2>{rating.title}</h2>
                        <p>Author: {rating.author}</p>
                        <p>Price: ${rating.price}</p>
                        <p>Stock: {rating.stock}</p>
                        <p>Rating: {getRatings(rating.ratings)}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Ratings;