import { jwtDecode } from 'jwt-decode';

class AuthService {
    getToken() {
      const token = this.getCookie('token');
      console.log('Token retrieved:', token);
      return token;
    }
  
    setToken(token) {
      this.setCookie('token', token, 1); // Cookie expires in 1 day
      console.log('Token set:', token);
    }
  
    removeToken() {
      this.deleteCookie('token');
      console.log('Token removed');
    }
  
    isAuthenticated() {
      const token = this.getToken();
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          const isAuthenticated = decoded.exp > currentTime;
          console.log('Authentication status:', isAuthenticated);
          return isAuthenticated;
        } catch (error) {
          console.error('Error decoding token:', error);
          return false;
        }
      }
      console.log('No token found, authentication status: false');
      return false;
    }
  
    // Utility functions to manage cookies
    getCookie(name) {
      const cookieString = document.cookie;
      const cookies = cookieString.split('; ');
      for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
          return decodeURIComponent(cookieValue);
        }
      }
      return null;
    }
  
    setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
    }
  
    deleteCookie(name) {
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    }    
  }
  
  export default new AuthService();

