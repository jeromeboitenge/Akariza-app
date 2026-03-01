import { ROLE_PERMISSIONS } from './constants';

export const hasPermission = (userRole: string, permission: string): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] || [];
  
  if (permissions.includes('*')) return true;
  
  if (permissions.includes(permission)) return true;
  
  const [resource, action] = permission.split(':');
  if (action && permissions.includes(resource)) return true;
  
  return false;
};

export const canCreate = (userRole: string, resource: string): boolean => {
  return hasPermission(userRole, `${resource}:create`) || hasPermission(userRole, resource);
};

export const canRead = (userRole: string, resource: string): boolean => {
  return hasPermission(userRole, `${resource}:read`) || hasPermission(userRole, resource);
};

export const canUpdate = (userRole: string, resource: string): boolean => {
  return hasPermission(userRole, `${resource}:update`) || hasPermission(userRole, resource);
};

export const canDelete = (userRole: string, resource: string): boolean => {
  return hasPermission(userRole, `${resource}:delete`) || hasPermission(userRole, resource);
};
