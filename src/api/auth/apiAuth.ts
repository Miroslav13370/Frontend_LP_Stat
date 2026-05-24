import { api } from "../api";
import { IAuthType, IModerator } from "./apiAuth.type";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IModerator, IAuthType>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<IModerator, IAuthType>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
