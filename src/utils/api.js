import { getToken } from "./token";

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _getHeaders() {
    const token = getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  getUsersInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._getHeaders(),
    });
  }

  editProfileInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    });
  }

  editAvatarImg({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({
        avatar: avatar,
      }),
    });
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._getHeaders(),
    });
  }

  createNewCard(card) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(card),
    });
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._getHeaders(),
    });
  }

  changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this._getHeaders(),
    });
  }

  //  addLikes({ cardId, isLiked }) {
  //   return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
  //    method: "PUT",
  //      headers: this._getHeaders(),
  //    body: JSON.stringify({
  //    status: isLiked,
  //   }),
  //  });
  // }

  //  removeLikes(cardId) {
  //  return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
  //  method: "DELETE",
  ///     headers: this._getHeaders(),
  //  });
  // }
}

const api = new Api({
  baseUrl: "http://localhost:3001",
});

export default api;
