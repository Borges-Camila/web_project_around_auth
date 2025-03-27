import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { register } from "../../utils/auth";
import InfoTooltip from "../Main/components/Popup/components/InfoTooltip/InfoTooltip";

function Register({ onOpenPopup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // o manipulador de registro

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await register({ email, password });
      if (response.status !== 201) {
        throw new Error(`Chamada inválida: ${response.status}`);
      }
      const info = await response.json();
      if (!info.data._id || !info.data.email) {
        throw new Error(`Id não recebido: ${info}`);
      }
      onOpenPopup({
        title: "",
        children: <InfoTooltip state={true} />,
      });
      navigate("/signin");
    } catch (error) {
      onOpenPopup({
        title: "",
        children: <InfoTooltip state={false} />,
      });
      console.log("ERROR - REGISTER:", error);
    }
  }

  return (
    <div className="page">
      <h2 className="form__title">Inscreva-se</h2>
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
          Inscrever-se
        </button>
      </form>
      <Link to="/signin" className="page__call-link">
        Já é um membro? Faça o login aqui!
      </Link>
    </div>
  );
}

export default Register;
