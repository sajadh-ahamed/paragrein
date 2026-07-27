/*
I created authStorage.js to centralize all authentication-related localStorage operations.
 Instead of writing localStorage code in multiple pages, I created common reusable functions to save, 
 retrieve, and clear authentication data.

 After a successful login, the backend returns a JWT token and user details. This file stores them in the browser's localStorage. Later, 
 other pages can retrieve the token to authenticate API requests, get the logged-in user's details, 
 check the user's role, or clear the data during logout.

in this file we made functions to store and get data from local storage
| Function            | Purpose                                                           |
| ------------------- | ----------------------------------------------------------------- |
| `saveAuthData()`    | Save JWT token and user information after login.                  |
| `getToken()`        | Read the JWT token from localStorage.                             |
| `getUser()`         | Read the logged-in user's information.                            |
| `clearAuthData()`   | Remove login information during logout or when the token expires. |
| `hasRole()`         | Check whether the logged-in user has a specific role.             |
| `getRouteForRole()` | Return the correct dashboard route based on the user's role.      |

*/


const TOKEN_KEY = "paragrein_auth_token"; // only to store the token
const USER_KEY = "paragrein_auth_user"; //{"username":"John","role":"ADMIN"}
//why created variables because we need to change varibale name in 1 place

export function saveAuthData(token, user) {
  localStorage.setItem(TOKEN_KEY, token); //store jwt token
  localStorage.setItem(USER_KEY, JSON.stringify(user)); //to store user object as string in local storage
} //JSON.stringify(user)-> converts object into string because local storage can only store strings
// localStorage.setItem(key, value); (this is buildin function with 2 parametrs)

//get token only
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

//get user only
//get user from local storage and convert it back to object otherwise cant use
export function getUser() {
  const rawUser = localStorage.getItem(USER_KEY); //rawUser = {"username":"Sajadh","role":"CUSTOMER"}
  if (rawUser) {
    return JSON.parse(rawUser); //if true return {"username":"Sajadh","role":"CUSTOMER"}
  } else {
    return null;
  }
}

//after logout empty
export function clearAuthData() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

//checking if user has role or not and logged in or not
export function hasRole(role) {

  const user = getUser(); // above line we made it 

  if (user && user.role === role) {
    return true;
  } 
  else {
    return false;
  }

}

//choosing routes and showing pages based on role
export function getRouteForRole(role) {
  const routes = {
    CUSTOMER: "/customer",
    ADMIN: "/admin",
    FINANCE_OFFICER: "/finance",
    PICKUP_AGENT: "/pickup",
    WAREHOUSE_STAFF: "/warehouse",
    DRIVER: "/driver",
  };

  return routes[role] || "/unauthorized";
}

/*usually local storage storage is like this
KEY                         VALUE
----------------------------------------
paragrein_auth_token        ?
paragrein_auth_user         ?
*/
