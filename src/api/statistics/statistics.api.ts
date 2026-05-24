import { api } from "../api";
import type {
  AdminModeratorStatisticsResponse,
  AdminModeratorsStatisticsResponse,
  AdminTikTokUserStatisticsResponse,
  AdminTikTokUsersStatisticsResponse,
  GetAdminStatisticsParams,
  GetModeratorStatisticsParams,
  GetOneAdminStatisticsParams,
  ModeratorStatisticsResponse,
} from "./statistics.type.api";

export const statisticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyModeratorStatistics: builder.query<
      ModeratorStatisticsResponse,
      GetModeratorStatisticsParams
    >({
      query: ({ startDate, endDate, forceRefresh }) => ({
        url: "/statistics/moderator/me",
        method: "GET",
        params: {
          startDate,
          endDate,
          forceRefresh,
        },
      }),
    }),

    getAdminTikTokUsersStatistics: builder.query<
      AdminTikTokUsersStatisticsResponse,
      GetAdminStatisticsParams
    >({
      query: ({ periodType, startDate, endDate, forceRefresh }) => ({
        url: "/statistics/admin/tiktok-users",
        method: "GET",
        params: {
          periodType,
          startDate,
          endDate,
          forceRefresh,
        },
      }),
    }),

    getAdminTikTokUserStatistics: builder.query<
      AdminTikTokUserStatisticsResponse,
      GetOneAdminStatisticsParams
    >({
      query: ({ id, periodType, startDate, endDate, forceRefresh }) => ({
        url: `/statistics/admin/tiktok-users/${id}`,
        method: "GET",
        params: {
          periodType,
          startDate,
          endDate,
          forceRefresh,
        },
      }),
    }),

    getAdminModeratorsStatistics: builder.query<
      AdminModeratorsStatisticsResponse,
      GetAdminStatisticsParams
    >({
      query: ({ periodType, startDate, endDate, forceRefresh }) => ({
        url: "/statistics/admin/moderators",
        method: "GET",
        params: {
          periodType,
          startDate,
          endDate,
          forceRefresh,
        },
      }),
    }),

    getAdminModeratorStatistics: builder.query<
      AdminModeratorStatisticsResponse,
      GetOneAdminStatisticsParams
    >({
      query: ({ id, periodType, startDate, endDate, forceRefresh }) => ({
        url: `/statistics/admin/moderators/${id}`,
        method: "GET",
        params: {
          periodType,
          startDate,
          endDate,
          forceRefresh,
        },
      }),
    }),
  }),
});

export const {
  useGetMyModeratorStatisticsQuery,
  useGetAdminTikTokUsersStatisticsQuery,
  useGetAdminTikTokUserStatisticsQuery,
  useGetAdminModeratorsStatisticsQuery,
  useGetAdminModeratorStatisticsQuery,
  useLazyGetAdminModeratorsStatisticsQuery,
  useLazyGetAdminTikTokUsersStatisticsQuery,
} = statisticsApi;
