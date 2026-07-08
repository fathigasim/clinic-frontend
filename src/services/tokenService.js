import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'authToken';

export const tokenService = {
  // Get token
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),

  // Set token
  setTokens: (accessToken) => {
    if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
  },

  // Clear token
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Check if token is valid
  isTokenValid: (token) => {
    if (!token) return false;
    return !tokenService.isTokenExpired(token);
  },

  // Get valid token or null if expired
  getValidAccessToken: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || tokenService.isTokenExpired(token)) {
      tokenService.clearTokens();
      return null;
    }
    return token;
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  },

  // Get token expiration time
  getTokenExpiration: (token) => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000;
    } catch {
      return null;
    }
  },

  getUserIdFromToken: (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.sub || null; //  backend uses JwtRegisteredClaimNames.Sub
  } catch {
    return null;
  }
},

getEmailFromToken: (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.email || null; //  backend uses JwtRegisteredClaimNames.Email
  } catch {
    return null;
  }
},
  // // Get user ID from token
  // getUserIdFromToken: (token) => {
  //   if (!token) return null;
  //   try {
  //     const decoded = jwtDecode(token);
  //     return (
  //       decoded.sub ||
  //       decoded.nameid ||
  //       decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
  //       null
  //     );
  //   } catch {
  //     return null;
  //   }
  // },

  // // Get email from token
  // getEmailFromToken: (token) => {
  //   if (!token) return null;
  //   try {
  //     const decoded = jwtDecode(token);
  //     return (
  //       decoded.email ||
  //       decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
  //       null
  //     );
  //   } catch {
  //     return null;
  //   }
  // },

  // Get username from token
  getUserNameFromToken: (token) => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return (
        decoded.name ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        null
      );
    } catch {
      return null;
    }
  },

  // Get roles from token
  getUserRoles: (token) => {
    if (!token) return [];
    try {
      const decoded = jwtDecode(token);
      const aspNetRoles = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      if (aspNetRoles) return Array.isArray(aspNetRoles) ? aspNetRoles : [aspNetRoles];
      const simpleRoles = decoded.role;
      if (simpleRoles) return Array.isArray(simpleRoles) ? simpleRoles : [simpleRoles];
      return [];
    } catch {
      return [];
    }
  },
};