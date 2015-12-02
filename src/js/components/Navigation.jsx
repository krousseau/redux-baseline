import React from 'react';
import { Link } from 'react-router';

const Navigation = (props) => (
	<ul className="app-nav">
        <li><Link to="/bikes">Bikes</Link></li>
    </ul>
);
export default Navigation;