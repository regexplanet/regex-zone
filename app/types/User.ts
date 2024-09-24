export type User = {
  email: string;
  avatar?: string;
  displayName: string;
  provider: string;
  providerName: string;
  id: string;
  isAnonymous?: boolean;
};
