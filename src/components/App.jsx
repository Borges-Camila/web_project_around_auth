import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import api from "../utils/api";
import Register from "./MainRegister/Register";
import Login from "./MainLogin/Login";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

import * as auth from "../utils/auth";
import Popup from "./Main/components/Popup/Popup";

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [popup, setPopup] = useState(null);
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    handleCheckToken();
  }, []);

  async function handleCheckToken() {
    const { token } = localStorage.getItem("jwt");
    if (!token) {
      alert("User is not logged");
      navigate("/signin");
      return;
    }

    try {
      const response = await auth.checkToken(token);
      if (response.status === 401 || response.status === 400) {
        navigate("/signin");
        throw new Error(`Chamada inválida: ${response.status}`);
      }
      const data = await response.json();
      if (!data.data._id || !data.data.email) {
        handleLogout();
        throw new Error(`Token inválido: ${data}`);
      }
      setIsLoggedIn(true);
      navigate("/signin");
    } catch (error) {
      alert("Erro: login inválido");
      console.log("ERROR - LOGIN:", error);
    }
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
  }

  // funções abre e fecha popup

  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  // função para oegar infos usurário
  async function getUserInfo() {
    await api
      .getUsersInfo()
      .then((res) => res.json())
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((error) => {
        console.log("Erro no get", error);
      });
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  // faz o update das infos do usuário
  const handleUpdateUser = (data) => {
    (async () => {
      await api
        .editProfileInfo(data)
        .then((response) => response.json())
        .then((newData) => {
          setCurrentUser(newData);
          handleClosePopup();
        });
    })();
  };

  // faz o update da img do usuário
  const handleUpdateAvatar = (data) => {
    (async () => {
      await api
        .editAvatarImg(data)
        .then((response) => response.json())
        .then((newData) => {
          setCurrentUser(newData);
          handleClosePopup();
        });
    })();
  };

  // Adiciona mais cartões
  const handleAddPlaceSubmit = (data) => {
    (async () => {
      await api
        .createNewCard(data)
        .then((response) => response.json())
        .then((newCard) => {
          setCards([newCard, ...cards]);
          handleClosePopup();
        });
    })();
  };

  // Pega os cartões iniciais
  useEffect(() => {
    api
      .getInitialCards()
      .then((res) => res.json())
      .then((cards) => {
        setCards(cards);
      })
      .catch((error) => {
        console.log("Error get", error);
      });
  }, []);

  // Função de dar like nos cartões
  async function handleCardLike(card) {
    // Verificar mais uma vez se esse cartão já foi curtido
    const isLiked = card.isLiked;

    // Enviar uma solicitação para a API e obter os dados do cartão atualizados
    await api
      .changeLikeCardStatus(card._id, isLiked)
      .then((response) => response.json())
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((error) => console.error(error));
  }

  // Função de deletar nos cartões
  async function handleDeleteCard(card) {
    await api
      .deleteCard(card._id)
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject("Erro no delete card");
        }
        setCards(cards.filter((c) => c._id !== card._id));
      })
      .catch((error) => {
        console.error(`[DELETE] - cards - ${error}`);
      });
  }

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        handleUpdateAvatar,
        handleAddPlaceSubmit,
      }}
    >
      <Header handleLogout={handleLogout} />
      <Routes>
        {/* Essa é a rota que deve ser envolvida com o protectedroute */}

        <Route
          path="/"
          element={
            <div className="page">
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Main
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={handleClosePopup}
                  popup={popup}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleDeleteCard}
                />
              </ProtectedRoute>
              <Footer />
            </div>
          }
        />

        {/* Essa é a rota que deve ser envolvida com o protectedroute */}

        <Route
          path="/signup"
          element={
            <div className="page">
              <Register onOpenPopup={handleOpenPopup} />
            </div>
          }
        />

        <Route
          path="/signin"
          element={
            <div className="page">
              <Login
                setIsLoggedIn={setIsLoggedIn}
                onOpenPopup={handleOpenPopup}
              />
            </div>
          }
        />
      </Routes>
      <div className="janela-popup">
        {popup && (
          <Popup onClose={handleClosePopup} title={popup.title}>
            {popup.children}
          </Popup>
        )}
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
