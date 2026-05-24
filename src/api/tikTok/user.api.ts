import { api } from "../api";
import type {
  DeleteTikTokUserResponse,
  TikTokUser,
  TikTokUserStatisticsResponse,
  UpdateAuthorContentDto,
  UpdateAuthorContentResponse,
} from "./tikTok.type.api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTikTokUserById: builder.query<TikTokUser, string>({
      query: (id) => ({
        url: `/user/by-id/${id}`,
        method: "GET",
      }),
    }),
    getAllNotConnect: builder.query<TikTokUser[], void>({
      query: () => ({
        url: `/user/all`,
        method: "GET",
      }),
    }),

    getTikTokUserStatistics: builder.query<
      TikTokUserStatisticsResponse,
      {
        id: string;
        startDate: string;
        endDate: string;
      }
    >({
      query: ({ id, startDate, endDate }) => ({
        url: `/statistics/tiktok-user/${id}`,
        method: "GET",
        params: {
          startDate,
          endDate,
        },
      }),
    }),
    updateAuthorContent: builder.mutation<
      UpdateAuthorContentResponse,
      UpdateAuthorContentDto
    >({
      query: (body) => ({
        url: "/user/updateAuthorContent",
        method: "POST",
        body,
      }),
    }),
    deleteTikTokUser: builder.mutation<DeleteTikTokUserResponse, string>({
      query: (tiktokUserId) => ({
        url: `/user/delete-byId/${tiktokUserId}`,
        method: "DELETE",
      }),
    }),
    updateTikTokUserModerator: builder.mutation<
      TikTokUser,
      {
        tiktokUserId: string;
        moderatorId: string | null;
      }
    >({
      query: ({ tiktokUserId, moderatorId }) => ({
        url: `/user/update-moderator/${tiktokUserId}`,
        method: "PATCH",
        body: {
          moderatorId,
        },
      }),
    }),
  }),
});

export const {
  useGetTikTokUserByIdQuery,
  useGetTikTokUserStatisticsQuery,
  useGetAllNotConnectQuery,
  useUpdateAuthorContentMutation,
  useDeleteTikTokUserMutation,
  useUpdateTikTokUserModeratorMutation,
} = userApi;
