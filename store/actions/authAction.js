import AsyncStorage from "@react-native-community/async-storage";

export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
      dispatch(setLogoutTimer(expiryTime))
      dispatch({ type : AUTHENTICATE, userId : userId, token : token})
    }
}

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDVW_YWpU9bDH3wH22jlk28Er7MOKi-7zE",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorId = errorData.error.message;
      let message = "Some thing went wrong";
      if (errorId === "EMAIL_EXISTS") {
        message = "This email exists!";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    // dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
    dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
    saveDataTOStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDVW_YWpU9bDH3wH22jlk28Er7MOKi-7zE",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorId = errorData.error.message;
      let message = "Some thing went wrong";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email can not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "Password is not Valid!";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    //   console.log(resData)
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
    saveDataTOStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return{ type : LOGOUT };
}

const clearLogoutTimer = () => {
  if(timer){
    clearTimeout(timer);
  }
}

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime / 1000 )
  }
}

const saveDataTOStorage = async (token, userId, expirationDate) => {
  try {
    await AsyncStorage.setItem(
      "userData",
      JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate,
      })
    );
  } catch (error) {
    console.log(error);
  }
};
