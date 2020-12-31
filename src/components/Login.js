import PopupWithForm from './PopupWithForm'
import {Link} from 'react-router-dom'

function Login(props) {



  
  return (
    <>
    <PopupWithForm
      name='login'
      title='Log in'
      isOpen={true}
      overlay = {false}
      titleCentered = {true}
      closeButton = {false}
      onClose={props.onClose}
      onSubmit={props.handleLoginSubmit}
    >
         <input type="text" 
          placeholder="Email" 
          id="email-input" 
          className="popup__field popup__field_login" 
          name="name" 
          value = {""} 
          required minLength={2} 
          maxLength={40} 
/>
          <input type="password" 
          placeholder="Password" 
          id="password-input" 
          className="popup__field popup__field_login" 
          name="about" 
          value = {""} 
          required minLength={2} 
          maxLength={200} 
/>
        <input
          type="submit"
          className="popup__save popup__save_login"
          aria-label="Save"
          value="Log In"
      />
      <Link className='popup__link' to='/signup'>
          Not a member yet? Sign up here!
        </Link>
    </PopupWithForm>
    
  </>
   
  )
}

export default Login;