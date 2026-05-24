export type ModeratorTikTokUser = {
  id: string;
  tiktok_open_id: string;
  tiktok_username: string | null;
  tiktok_display_name: string | null;
  tiktok_avatar_url: string | null;
  isAuthorContent: boolean;
  planTarget: number;
  moderatorId: string | null;
};

export type Moderator = {
  id: string;
  login: string;
  isAdmin: boolean;
  tikTokUser: ModeratorTikTokUser[];
};

export type ConnectTikTokUserDto = {
  id: string;
  tikTokUsersIds: string[];
};
export type DeleteModeratorResponse = Moderator;
