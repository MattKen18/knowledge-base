import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }) => {
  const authenticated = true;
  return (
    !authenticated ? <Navigate to="/Login" /> : children
  )
}

export default PrivateRoute;