export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  permissions: string[];
}

export interface IGetCurrentUserUseCase {
  execute(userId: string): Promise<UserProfileResponse>;
}
