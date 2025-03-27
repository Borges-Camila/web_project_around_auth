import { Link, useLocation } from "react-router";
import logo from "../../images/Logo.png";
import { useEffect, useState } from "react";

function Header({ handleLogout }) {
  const location = useLocation();

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const getNavLink = () => {
    switch (location.pathname) {
      case "/":
        return (
          <>
            <p>{userEmail}</p> <Link onClick={handleLogout}>Sair</Link>
          </>
        );
      case "/signup":
        return <Link to="/signin">Faça o Login</Link>;
      case "/signin":
        return <Link to="/signup">Entrar</Link>;
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <img
            src={logo}
            className="header__logo"
            alt="Frase Around The U.S."
          />
          <div className="navbar">{getNavLink()}</div>
        </div>
        <hr />
      </header>
    </>
  );
}

export default Header;
