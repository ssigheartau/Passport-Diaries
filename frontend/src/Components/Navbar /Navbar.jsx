import { FaHome } from "react-icons/fa";
import './Navbarstyles.css';
import { Link } from "react-router-dom";

const Navbar = () =>{ 
    return(
    <nav className="NavbarItems">
        <h1 className="navbar-logo">Passport Diaries</h1>

        <ul className="nav-menu">
            <li>
            
                <a className="cname" href="homepage"> < FaHome className='icon' />
                Home</a>
                    
            </li>
        </ul>
    </nav>
)}
       
export default Navbar;