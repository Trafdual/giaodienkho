import React from 'react';
import "./HeaderTroGiupTQ.scss";
const Header = () => {

    return (
        <div>
            <ul className='ul-tq'>
                <li><a href="#">Home</a></li>
                <li>
                    <a href="#">Dashboard</a>
                    <ul className="dropdown-help">
                        <li><a href="#">Settings</a></li>
                        <li><a href="#">Logout</a></li>
                        <li><a href="#">Settings</a></li>
                        <li><a href="#">Logout</a></li>
                    </ul></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">Logout</a></li>
            </ul>


        </div>);
};

export default Header;
