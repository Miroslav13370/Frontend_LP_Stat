export type PeriodType = "day" | "month" | "all" | "custom";

export type PlatformType = "tiktok" | "youtube" | "instagram";

export type GetAdminStatisticsParams = {
  periodType: PeriodType;
  startDate?: string;
  endDate?: string;
  forceRefresh?: boolean;
  requestKey?: number;
};

export type GetOneAdminStatisticsParams = GetAdminStatisticsParams & {
  id: string;
};

export type GetModeratorStatisticsParams = {
  startDate: string;
  endDate: string;
  forceRefresh?: boolean;
  requestKey?: number;
};

export type PlanInfo = {
  plan: number;
  label: string;
  isCompleted: boolean;
};

export type StatisticsPeriod = {
  type?: PeriodType;
  label?: string;
  startDate: string;
  endDate: string;
};

export type SocialVideo = {
  id: string;
  title: string;
  video_description: string;
  duration: number;
  cover_image_url: string;
  share_url: string | null;
  create_time: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
};

export type ModeratorShort = {
  id: string;
  login: string;
};

export type ModeratorStatisticsSummary = {
  salary: number;
  planBonus: number;
  weeklyTopVideosBonus: number;
  monthlyTopVideosBonus: number;
  bonusesTotal: number;
  dePremium: number;
  totalViews: number;
  curatorTotal: number;
};

export type ModeratorStatisticsAccount = {
  id: string;
  platform: PlatformType;
  openId: string;
  username: string | null;
  displayName: string | null;
  description?: string | null;
  avatarUrl?: string | null;

  moderatorId?: string | null;
  moderator?: ModeratorShort | null;

  editor?: ModeratorShort | null;

  isAuthorContent: boolean;
  videosCount: number;
  likesCount: number;
  viewsCount: number;
  videosFrom1kCount: number;
  dePremium: number;
  error: string | null;
  plan: PlanInfo;
  bestVideo?: SocialVideo | null;
};

export type WeeklyTopVideo = {
  week: number;
  weekStartDate: string;
  weekEndDate: string;
  label: string;
  video: SocialVideo & {
    platform: PlatformType;
    accountId: string;
    username: string | null;
    displayName: string | null;
  };
  bonus: number;
};

export type MonthlyTopVideo = SocialVideo & {
  platform: PlatformType;
  accountId: string;
  username: string | null;
  displayName: string | null;
  bonus: number;
};

export type ModeratorStatisticsResponse = {
  period: {
    startDate: string;
    endDate: string;
  };

  moderator: {
    id: string;
    login: string;
  };

  summary: ModeratorStatisticsSummary;
  accounts: ModeratorStatisticsAccount[];
  weeklyTopVideos: WeeklyTopVideo[];
  monthlyTopVideos: MonthlyTopVideo[];
};

export type AdminTikTokUsersStatisticsResponse = {
  period: StatisticsPeriod;

  summary: {
    accountsCount: number;
    totalViews: number;
    totalLikes: number;
    totalVideos: number;
  };

  accounts: ModeratorStatisticsAccount[];
};

export type AdminTikTokUserStatisticsResponse = {
  period: StatisticsPeriod;

  account: ModeratorStatisticsAccount & {
    moderator: ModeratorShort | null;
  };

  videos: SocialVideo[];
};

export type AdminModeratorItem = {
  id: string;
  login: string;
  isAdmin: boolean;
  accountsCount: number;
  summary: ModeratorStatisticsSummary;
};

export type AdminModeratorsStatisticsResponse = {
  period: StatisticsPeriod;

  summary: {
    moderatorsCount: number;
    totalViews: number;
  };

  moderators: AdminModeratorItem[];
};

export type AdminModeratorStatisticsResponse = {
  period: StatisticsPeriod;

  moderator: {
    id: string;
    login: string;
    isAdmin: boolean;
  };

  summary: ModeratorStatisticsSummary;
  accounts: ModeratorStatisticsAccount[];
  weeklyTopVideos: WeeklyTopVideo[];
  monthlyTopVideos: MonthlyTopVideo[];
};
