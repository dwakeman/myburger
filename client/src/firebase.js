import axios from 'axios';

const firebase = axios.create({
  baseURL: 'https://react-my-burger-a1b25-default-rtdb.firebaseio.com/'
})

firebase.interceptors.request.use(request => {
  console.log('[firebase.js] firebase.interceptors.request', request);
  //you can edit the request config here.....
  return request;
}, error => {
  console.log(error);
  return Promise.reject(error);

});

export default firebase;