export type TikTokUser = {
  id: string;
  tiktok_open_id: string;
  tiktok_username: string | null;
  tiktok_display_name: string | null;
  tiktok_avatar_url: string | null;
};

export type TikTokVideo = {
  id: string;
  title: string;
  video_description: string;
  cover_image_url: string;
  share_url: string;
  create_time: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
};

export type TikTokUserStatisticsResponse = {
  account: {
    id: string;
    platform: "tiktok";
    openId: string;
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    moderatorId: string | null;
    isAuthorContent: boolean;
    videosCount: number;
    likesCount: number;
    viewsCount: number;
    videosFrom1kCount: number;
    plan: {
      plan: number;
      label: string;
      isCompleted: boolean;
    };
    dePremium: number;
    bestVideo: TikTokVideo | null;
    error: string | null;
    moderator: {
      id: string;
      login: string;
    } | null;
  };
  videos: TikTokVideo[];
};

export type UpdateAuthorContentDto = {
  tiktokUserId: string;
  isAuthorContent: boolean;
};

export type UpdateAuthorContentResponse = {
  isAuthorContent: boolean;
};

export type DeleteTikTokUserResponse = TikTokUser;
