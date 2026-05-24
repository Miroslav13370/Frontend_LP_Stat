export type YouTubeUser = {
  id: string;

  google_sub: string;

  youtube_channel_id: string;

  youtube_title: string | null;

  youtube_description: string | null;

  youtube_custom_url: string | null;

  youtube_thumbnail_url: string | null;

  isAuthorContent: boolean;

  planTarget: number;

  moderatorId: string | null;
};

export type UpdateYouTubeAuthorContentDto = {
  youtubeUserId: string;

  isAuthorContent: boolean;
};
