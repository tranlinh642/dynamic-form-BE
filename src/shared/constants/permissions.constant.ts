export const PERMISSIONS = {
  CREATE_FORM: 'CREATE_FORM',
  SUBMIT_FORM: 'SUBMIT_FORM',
  VIEW_FORM: 'VIEW_FORM',
  UPDATE_FORM: 'UPDATE_FORM',
  DELETE_FORM: 'DELETE_FORM',
} as const;

export type PermissionType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
