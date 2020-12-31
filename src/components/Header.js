import logo from "../Images/logo.svg";
import {Link, useLocation} from 'react-router-dom'

function Header(props) {

  const location = useLocation();
  
    let properties = {text:"", route: "", email: ""}
    if (location.pathname === "/signup") { 
      properties.text ="Log in"
      properties.route = "/login"
      properties.email = ""
    }
    else if (location.pathname === "/login") {
      properties.text ="Sign up"
      properties.route = "/signup"
      properties.email = ""
    }
    else {
      properties.text ="Log out"
      properties.route = "/login"
      properties.email = props.userEmail
    }

  return (
    <>
    <header className="header">
      <img className="header__logo" src={logo} alt="Around the US logo" />
      <div className="header__email">
    {properties.email}
    
    <Link to = {properties.route} className={`header__link `+ (location.pathname === "/signup"||location.pathname ==="/login" ? '':'header__link_logged-in')} >
    {properties.text}
    </Link>
    </div>
    </header>
    <Link className="header__link">
      
    </Link>
    </>
  );
}

export default Header;