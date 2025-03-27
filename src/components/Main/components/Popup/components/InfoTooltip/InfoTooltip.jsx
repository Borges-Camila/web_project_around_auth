import failImage from "../../../../../../images/Fail.png";
import successImg from "../../../../../../images/Success.png";

export default function InfoTooltip({ state }) {
  return (
    <>
      {state ? (
        <>
          <img
            alt="imagem de um símbolo de sucesso"
            className="popup__icon-image"
            src={successImg}
          />
          <p className="popup__info">Vitória! Você precisa se registrar.</p>
        </>
      ) : (
        <>
          <img
            alt="imagem de um símbolo de falha"
            className="popup__icon-image"
            src={failImage}
          />
          <p className="popup__info">
            Ops, algo saiu deu errado! Por favor, tente novamente.
          </p>
        </>
      )}
    </>
  );
}
