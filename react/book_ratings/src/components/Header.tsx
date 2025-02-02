import React from "react";

const Header : React.FunctionComponent = () => {
    return (
        <header className="navbar navbar-expand-lg navbar-secondary bg-light fixed-top">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Book Ratings</a>
            </div>
        </header>
    )
}

export default Header;