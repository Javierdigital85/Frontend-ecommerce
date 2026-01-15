export interface UserInfo {
  id?: string;
  email?: string;
  username?: string;
  isAdmin?: boolean;
}

export interface UserContextValue {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  loading: boolean;
  checkSession: () => Promise<void>;
  getUserId: () => string | null;
  isAuthenticated: () => boolean;
}
