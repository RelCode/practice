import React from "react";

const Header : React.FunctionComponent = () => {
    return (
        <header className="navbar navbar-expand-lg navbar-secondary bg-light fixed-top">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Book Ratings</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="sad">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="das">Features</a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header;