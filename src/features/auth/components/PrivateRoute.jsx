import { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectAuthLoading, selectIsAuthenticated } from '../authSlice';
import { tokenService } from '../../../services/tokenService';

const EXCLUDED_RETURN_PATHS = ['/auth/login', '/logout', '/auth/logout', '/auth/forbidden'];

const PrivateRoute = ({
  children,
  allowedRoles = [],
  requireAllRoles = false,
  fallbackUrl = '/auth/forbidden',
  loginUrl = '/auth/login',
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated); // ← from Redux now
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();

  const { hasAccess, userRoles } = useMemo(() => {
    if (!allowedRoles || allowedRoles.length === 0) {
      return { hasAccess: true, userRoles: [] };
    }

    const token = tokenService.getAccessToken();
    const roles = tokenService.getUserRoles(token) || [];

    return {
      hasAccess: requireAllRoles
        ? allowedRoles.every((role) => roles.includes(role))
        : allowedRoles.some((role) => roles.includes(role)),
      userRoles: roles,
    };
  }, [allowedRoles, requireAllRoles, isAuthenticated]);

  // Wait for initializeAuth to complete before making any decision
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '200px' }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const from = EXCLUDED_RETURN_PATHS.some((path) =>
      location.pathname.startsWith(path)
    )
      ? '/'
      : location.pathname + location.search;

    return (
      <Navigate
        to={loginUrl}
        state={{ from, message: 'Please log in to access this page' }}
        replace
      />
    );
  }

  if (allowedRoles.length > 0 && !hasAccess) {
    console.warn(
      `Access denied. Required roles: ${allowedRoles.join(', ')}, User has: ${userRoles.join(', ')}`
    );
    return (
      <Navigate
        to={fallbackUrl}
        state={{
          from: location.pathname,
          requiredRoles: allowedRoles,
          userRoles,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        }}
        replace
      />
    );
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requireAllRoles: PropTypes.bool,
  fallbackUrl: PropTypes.string,
  loginUrl: PropTypes.string,
};

export default PrivateRoute;