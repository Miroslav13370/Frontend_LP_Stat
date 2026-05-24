import { api } from "../api";
import {
  UpdateYouTubeAuthorContentDto,
  YouTubeUser,
} from "./youtubeUser.api.type";

export const youtubeUserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllYouTubeNotConnect: builder.query<YouTubeUser[], void>({
      query: () => ({
        url: "/youtube-user/all",
        method: "GET",
      }),
    }),

    updateYouTubeAuthorContent: builder.mutation<
      { isAuthorContent: boolean },
      UpdateYouTubeAuthorContentDto
    >({
      query: (body) => ({
        url: "/youtube-user/updateAuthorContent",
        method: "POST",
        body,
      }),
    }),

    deleteYouTubeUser: builder.mutation<YouTubeUser, string>({
      query: (youtubeUserId) => ({
        url: `/youtube-user/delete-byId/${youtubeUserId}`,
        method: "DELETE",
      }),
    }),

    updateYouTubeUserModerator: builder.mutation<
      YouTubeUser,
      {
        youtubeUserId: string;
        moderatorId: string | null;
      }
    >({
      query: ({ youtubeUserId, moderatorId }) => ({
        url: `/youtube-user/update-moderator/${youtubeUserId}`,
        method: "PATCH",
        body: {
          moderatorId,
        },
      }),
    }),
  }),
});

export const {
  useGetAllYouTubeNotConnectQuery,
  useUpdateYouTubeAuthorContentMutation,
  useDeleteYouTubeUserMutation,
  useUpdateYouTubeUserModeratorMutation,
} = youtubeUserApi;
