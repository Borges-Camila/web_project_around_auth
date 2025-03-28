import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { authorize } from "../../utils/auth";
import InfoTooltip from "../Main/components/Popup/components/InfoTooltip/InfoTooltip";

function Login({ setIsLoggedIn, onOpenPopup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // o manipulador de login

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await authorize({ email, password });

      if (response.status === 401 || response.status === 400) {
        throw new Error(`Chamada inválida: ${response.status}`);
      }
      const data = await response.json();
      if (!data?.token) {
        throw new Error(`Token inválida: ${data}`);
      }
      localStorage.setItem("jwt", JSON.stringify(data.token));
      localStorage.setItem("userEmail", email);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      onOpenPopup({
        title: "",
        children: <InfoTooltip state={false} />,
      });

      console.log("ERROR - LOGIN:", error);
    }
  }

  return (
    <div className="page">
      <h2 className="form__title">Entrar</h2>
      <form className="form__content" onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          className="form__input"
          placeholder="E-mail"
          name="email"
          minLength="2"
          maxLength="30"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span className="form__input-error"></span>
        <input
          type="password"
          id="password"
          className="form__input"
          name="password"
          placeholder="Senha"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="form__input-error"></span>

        <button type="submit" className="form__button">
          Entrar
        </button>
      </form>
      <Link to="/signup" className="page__call-link">
        Ainda não é membro? Inscreva-se aqui!
      </Link>
    </div>
  );
}

export default Login;
