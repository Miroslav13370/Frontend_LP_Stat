export type InstagramReportStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type InstagramAccountShort = {
  id: string;

  username: string;

  accountUrl: string;

  avatarUrl: string | null;
};

export type InstagramMetricsReport = {
  id: string;

  instagramAccountId: string;

  weekStartDate: string | null;

  weekEndDate: string | null;

  startDate: string | null;

  endDate: string | null;

  currentTotalViews: number;

  currentTotalLikes: number;

  currentTotalVideos: number;

  viewsDelta: number;

  likesDelta: number;

  videosDelta: number;

  status: InstagramReportStatus;

  createdAt: string;

  instagramAccount?: InstagramAccountShort;
};

export type InstagramViralVideo = {
  url: string;

  views: number;

  likes: number;

  publishedAt: string;

  title?: string;
};

export type InstagramViralVideosReport = {
  id: string;

  instagramAccountId: string;

  weekStartDate: string | null;

  weekEndDate: string | null;

  startDate: string | null;

  endDate: string | null;

  videos: InstagramViralVideo[];

  status: InstagramReportStatus;

  createdAt: string;

  instagramAccount?: InstagramAccountShort;
};
