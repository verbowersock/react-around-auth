import React from 'react'
import Header from './Header.js';
import Footer from './Footer.js';
import Main from './Main.js';
import PopupWithImage from './PopupWithImage';
import { api } from "../utils/api.js";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddNewCardPopup from './AddNewCardPopup';
import { BrowserRouter, Route, Switch, Redirect, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'
import Login from './Login'
import Register from './Register'
import InfoToolTip from './InfoTooltip'
import * as auth from '../utils/auth.js';



function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(true);
  const [isInfoToolTipOpen, setInfoToolTipOpen] = React.useState(false);
  const [tooltipType, setTooltipType] = React.useState('');
  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [userRegistered, setUserRegistered] = React.useState(false)

  const history = useHistory({forceRefresh:true});
  

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((result) => {
        setCards(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.addLike(card._id, isLiked)
    .then((newCard) => {
      const newCards = cards.map((c) => c._id === card._id ? newCard: c);
      setCards(newCards);
    })
    .catch ((error) => {
      console.log(error)
    })
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
      const newCards = cards.filter((c) => c._id !== card._id);
      setCards(newCards);
  })
  .catch ((error) => {
    console.log(error)
  })
}

function handleEditAvatarClick () {
  setEditAvatarPopupOpen(true);
}

function handleEditProfileClick () {
  setEditProfilePopupOpen(true);
}

function handleAddPlaceClick () {
  setAddPlacePopupOpen(true);
}

function closeAllPopups () {
  setEditAvatarPopupOpen(false);
  setEditProfilePopupOpen(false);
  setAddPlacePopupOpen(false);
  setSelectedCard(null)
  setInfoToolTipOpen(false)
}

function handleCardClick(card) {
  setSelectedCard(card)
}

function handleUpdateUser({name, about}) {
  api.updateUserInfo({name, about})
  .then((data)=> {
    setCurrentUser(data);
  })
  .catch ((error) => {
    console.log(error)
  })
  closeAllPopups();
}

function handleUpdateAvatar({avatar}) {
  api.updateAvatar(avatar.current.value)
  .then((data) => {
  setCurrentUser(data);
})
  .catch ((error) => {
  console.log(error)
})
  closeAllPopups();  
}

function handleToolTip(type) {
  console.log(type)
  setTooltipType(type);
  setInfoToolTipOpen(true);
}

function handleAddPlaceSubmit({title, url}) {
  api.postNewCard({title, url}).then((data) => {
    setCards([data, ...cards])
  })
  .catch ((error) => {
    console.log(error)
  })
  closeAllPopups();
}

function resetForm () {
  setUserEmail('');
  setUserPassword('');
}

function handleRegistration() {
    console.log("form submitted")
    auth.register(userEmail, userPassword)
      .then((res) => {
        if (!res.data) {
          handleToolTip('fail');
          resetForm();
          throw new Error(`400 - one of the fields was filled in incorrectly`);
        }
        })
        .then((res) => {
          setUserRegistered(true);
          history.push('/login');
          return res;
        })
        .then((res) => {
          handleToolTip('success');
          return res;
        })
      .then(resetForm)
      .catch(err => {
        console.log(err)
      });
  }


React.useEffect(() => {
  api
    .getUserInfo()
    .then((result) => {
      setCurrentUser(result);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);

  return (
    <CurrentUserContext.Provider value = {currentUser}>
        <div className = "page">
     
  <BrowserRouter>
      
      <Header 
        userEmail={userEmail}
        loggedIn={loggedIn}
      />
      <Switch>
      <Route exact path="/login">
            <Login 
            userEmail={userEmail}
            userPassword={userPassword}
            loggedIn={loggedIn}
            />
            <InfoToolTip
              isOpen={isInfoToolTipOpen}
              onClose={closeAllPopups}
              tooltipType = {tooltipType}
            />
      </Route>
      <Route exact path="/signup">
        <Register 
          userEmail = {userEmail}
          setUserEmail = {setUserEmail}
          userPassword = {userPassword}
          setUserPassword = {setUserPassword}
          onSubmit={handleRegistration}
        />
        <InfoToolTip
              isOpen={isInfoToolTipOpen}
              onClose={closeAllPopups}
              loggedIn={loggedIn}
              tooltipType = {tooltipType}
            />
      </Route>
      <Route path="/">
      
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen} 
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      /> 
      <AddNewCardPopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddCard={handleAddPlaceSubmit}
      />
      <EditAvatarPopup 
        isOpen = {isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        />
      <PopupWithImage 
        onClose = {closeAllPopups}
        card = {selectedCard}/>         
       <ProtectedRoute 
            path="/" 
            loggedIn={loggedIn} 
            component={Main} 
            onEditProfile = {handleEditProfileClick}
            onAddPlace = {handleAddPlaceClick}
            onEditAvatar = {handleEditAvatarClick}
            onCardClick = {handleCardClick}
            cards={cards}
            onCardDelete = {handleCardDelete}
            onCardLike={handleCardLike}/>    
      <Footer />

      </Route>
      </Switch> 
    </BrowserRouter>
    </div>
    </CurrentUserContext.Provider>  
  );
}

export default App;
