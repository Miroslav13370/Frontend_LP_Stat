import { api } from "../api";
import type { DeleteModeratorResponse, Moderator } from "./moderator.apiType";

type ConnectTikTokUserDto = {
  tikTokUsersIds: string[];
};

type ConnectYouTubeUserDto = {
  youTubeUsersIds: string[];
};

export const moderatorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    connectTikTokUser: builder.mutation<Moderator, ConnectTikTokUserDto>({
      query: (body) => ({
        url: "/moderator/connectTikTokUser",
        method: "POST",
        body,
      }),
    }),

    connectTikTokUserAdmin: builder.mutation<
      Moderator,
      {
        moderatorId: string;
        tikTokUsersIds: string[];
      }
    >({
      query: ({ moderatorId, tikTokUsersIds }) => ({
        url: `/moderator/admin/${moderatorId}/connectTikTokUser`,
        method: "POST",
        body: {
          tikTokUsersIds,
        },
      }),
    }),

    connectYouTubeUser: builder.mutation<Moderator, ConnectYouTubeUserDto>({
      query: (body) => ({
        url: "/moderator/connectYouTubeUser",
        method: "POST",
        body,
      }),
    }),

    disconnectTikTokUser: builder.mutation<Moderator, string>({
      query: (userId) => ({
        url: `/moderator/disconnectTikTokUser/${userId}`,
        method: "POST",
      }),
    }),

    disconnectTikTokUserAdmin: builder.mutation<
      Moderator,
      {
        moderatorId: string;
        userId: string;
      }
    >({
      query: ({ moderatorId, userId }) => ({
        url: `/moderator/admin/${moderatorId}/disconnectTikTokUser/${userId}`,
        method: "POST",
      }),
    }),

    disconnectYouTubeUser: builder.mutation<Moderator, string>({
      query: (userId) => ({
        url: `/moderator/disconnectYouTubeUser/${userId}`,
        method: "POST",
      }),
    }),

    disconnectYouTubeUserAdmin: builder.mutation<
      Moderator,
      {
        moderatorId: string;
        userId: string;
      }
    >({
      query: ({ moderatorId, userId }) => ({
        url: `/moderator/admin/${moderatorId}/disconnectYouTubeUser/${userId}`,
        method: "POST",
      }),
    }),

    getMeModerator: builder.query<Moderator, void>({
      query: () => ({
        url: "/moderator",
        method: "GET",
      }),
    }),

    getModeratorByIdAdmin: builder.query<Moderator, string>({
      query: (id) => ({
        url: `/moderator/by-id/${id}`,
        method: "GET",
      }),
    }),

    deleteModerator: builder.mutation<DeleteModeratorResponse, string>({
      query: (moderatorId) => ({
        url: `/moderator/delete-byId/${moderatorId}`,
        method: "DELETE",
      }),
    }),
    connectYouTubeUserAdmin: builder.mutation<
      Moderator,
      {
        moderatorId: string;
        youTubeUsersIds: string[];
      }
    >({
      query: ({ moderatorId, youTubeUsersIds }) => ({
        url: `/moderator/admin/${moderatorId}/connectYouTubeUser`,
        method: "POST",
        body: {
          youTubeUsersIds,
        },
      }),
    }),
  }),
});

export const {
  useConnectTikTokUserMutation,
  useConnectTikTokUserAdminMutation,

  useConnectYouTubeUserMutation,
  useConnectYouTubeUserAdminMutation,

  useDisconnectTikTokUserMutation,
  useDisconnectTikTokUserAdminMutation,

  useDisconnectYouTubeUserMutation,
  useDisconnectYouTubeUserAdminMutation,

  useGetMeModeratorQuery,
  useGetModeratorByIdAdminQuery,

  useDeleteModeratorMutation,
} = moderatorApi;
