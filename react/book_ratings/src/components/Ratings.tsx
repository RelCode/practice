import React, { useState, useEffect } from "react";
import "./Ratings.css";

interface Rating {
    id: number;
    book_id: number;
    comment: string;
    dateRated: string;
    rate: number;
    reviewer: string;
}

interface Book {
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

    const getRatings = (ratings: Rating[]) : string => {
        if(ratings.length === 0){
            return "No ratings yet";
        }
        let total: number = ratings.reduce((acc, rating) => acc + rating.rate, 0);
        return `${(total / ratings.length).toFixed(2)}`;
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
        <div className="container">
            <div className="row">
            {ratings.length === 0 ? (
                <h2>No ratings found</h2>
            ) : (
                ratings.map((rating) => {
                return (
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={rating.id}>
                    <div className="card h-100">
                        <div className="card-body">
                        <h5 className="card-title">{rating.title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">Author: {rating.author}</h6>
                        <p className="card-text">Price: ${rating.price}</p>
                        <p className="card-text">Stock: {rating.stock}</p>
                        <p className="card-text">Rating: {getRatings(rating.ratings)}</p>
                        </div>
                    </div>
                    </div>
                );
                })
            )}
            </div>
        </div>
    )
}

export default Ratings;