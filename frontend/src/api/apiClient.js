/*Main File Speaking With SpringBoot server (request and response)
in this file we creating apis

hat does apiClient.js do?
Reads the JWT token from localStorage.
Creates request headers.
Adds the Authorization header if a token exists.
Sends the HTTP request using fetch().
Receives the backend response.
Checks if the request succeeded or failed.
Clears login data if the token is invalid (401).
Returns the response data or throws an error.
Why is it reusable?

Because every API request needs the same things:

Send request
Add JWT token
Handle errors
Read JSON response

Instead of repeating that code in every page, we wrote it once and reused it. */

import { clearAuthData, getToken } from '../utils/authStorage.js'; //this file use authstorage sfor some functions

const API_BASE_URL = 'http://localhost:8080/api'; //Instead of writing fetch("http://localhost:8080/api/auth/login") everywhere


//export function so that another file can do: import { apiRequest } from './apiClient.js';
//why used word "asyc" because this function not reply soon need to wait for response inside this function i may use await (await only can use with in async function)

export async function apiRequest(path, options = {}) { //path is just parameter and options ={} default paramter and if anyone doestn give any values means its use emoty object
  const token = getToken(); //import { getToken } from '../utils/authStorage.js';
  const isFormData = options.body instanceof FormData; //Is the request body a FormData object? (true or false)
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  //check token has or not (true or false)
  if (token) {
    headers.Authorization = `Bearer ${token}`; //This adds a new property to the headers object.
  }

  //sending http request using fetch (fetch("http://localhost:8080/api/auth/login");)
  const response = await fetch(`${API_BASE_URL}${path}`, { //path = "/auth/login" , the reply is stored in response variable
    ...options, //can contain method(post) with body
    headers,
  });

  const contentType = response.headers.get('content-type') || ''; 
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) { //response.ok is a property provided by fetch().
    if (response.status === 401) { //Special case: Unauthorized
      clearAuthData(); // from apiClient.js
    }
    const requestError = new Error(data?.message || 'Request failed. Please try again.');
    requestError.status = response.status;
    throw requestError;
  }

  return data;
}
