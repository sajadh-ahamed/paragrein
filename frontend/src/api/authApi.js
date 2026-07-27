/*this codes not sending requests to backend through the apiClient.js its going

I created authApi.js to keep all authentication-related API functions in one place. 
Instead of writing API URLs and request methods inside React pages,
I created reusable functions like login(), register(), and forgotPassword() that internally call the common apiRequest() function.
*/

import { apiRequest } from './apiClient.js';

//for login
export function login(credentials) { //credentials (Username : admin Password : Password@123)
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials), //credentials username/email and password
  });
}

////for regsiter
export function register(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
 
//for forgot password used in ForgotPasswordPage.jsx send the email to backedn
export function forgotPassword(email) {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

//for reset password
/*{
   "token":"abc123",
   "newPassword":"Test@123",
   "confirmPassword":"Test@123"
}*/
export function resetPassword(token, newPassword, confirmPassword) {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword, confirmPassword }),
  });
}

//t simply asks Spring Boot:"Give me the currently logged-in user's information."

export function getCurrentUser() {
  return apiRequest('/auth/me');//GET (default)
}

/*| Function           | URL                     | Method        | Data                |
| ------------------ | ----------------------- | ------------- | ------------------- |
| `login()`          | `/auth/login`           | POST          | username & password |
| `register()`       | `/auth/register`        | POST          | registration data   |
| `forgotPassword()` | `/auth/forgot-password` | POST          | email               |
| `resetPassword()`  | `/auth/reset-password`  | POST          | token & passwords   |
| `getCurrentUser()` | `/auth/me`              | GET (default) | none                |
 */
