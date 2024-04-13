import { adminsRoles } from '../configs';
import { UserRoles } from '../models/user-roles.model';

export const isUserAdmin = (userRoles: UserRoles[]) => {
  let isAdmin = false;

  for (let userRole of userRoles) {
    if (adminsRoles.includes(userRole?.roleName)) {
      isAdmin = true;
    }
  }

  return isAdmin;
};
