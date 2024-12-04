import jwt, { JwtPayload } from 'jsonwebtoken';

// Function to decode a JWT token
const decodeToken = (token: string): JwtPayload => {
  return jwt.decode(token) as JwtPayload;
};
// Export the function for use in other modules
export const jwtHelpers = {
  decodeToken,
};
