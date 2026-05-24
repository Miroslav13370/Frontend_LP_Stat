import { api } from "../api";
import {
  InstagramMetricsReport,
  InstagramViralVideosReport,
} from "./instagram.api.type";

export const instagramReportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPendingInstagramMetricsReports: builder.query<
      InstagramMetricsReport[],
      void
    >({
      query: () => ({
        url: "/instagram-report/admin/metrics/pending",

        method: "GET",
      }),
    }),

    getAdminPendingInstagramViralVideosReports: builder.query<
      InstagramViralVideosReport[],
      void
    >({
      query: () => ({
        url: "/instagram-report/admin/viral-videos/pending",

        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAdminPendingInstagramMetricsReportsQuery,
  useGetAdminPendingInstagramViralVideosReportsQuery,
} = instagramReportApi;
