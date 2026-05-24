import { toast } from "sonner";

import type { PlatformType } from "@/src/api/statistics/statistics.type.api";

import {
  useConnectTikTokUserAdminMutation,
  useConnectTikTokUserMutation,
  useConnectYouTubeUserAdminMutation,
  useConnectYouTubeUserMutation,
  useDisconnectTikTokUserAdminMutation,
  useDisconnectTikTokUserMutation,
  useDisconnectYouTubeUserAdminMutation,
  useDisconnectYouTubeUserMutation,
} from "@/src/api/moderator/moderator.api";

export const useModeratorAccounts = () => {
  const [connectTikTokUser, { isLoading: isConnectingTikTok }] =
    useConnectTikTokUserMutation();

  const [connectTikTokUserAdmin, { isLoading: isConnectingTikTokAdmin }] =
    useConnectTikTokUserAdminMutation();

  const [connectYouTubeUser, { isLoading: isConnectingYouTube }] =
    useConnectYouTubeUserMutation();

  const [connectYouTubeUserAdmin, { isLoading: isConnectingYouTubeAdmin }] =
    useConnectYouTubeUserAdminMutation();

  const [disconnectTikTokUser, { isLoading: isDisconnectingTikTok }] =
    useDisconnectTikTokUserMutation();

  const [disconnectTikTokUserAdmin, { isLoading: isDisconnectingTikTokAdmin }] =
    useDisconnectTikTokUserAdminMutation();

  const [disconnectYouTubeUser, { isLoading: isDisconnectingYouTube }] =
    useDisconnectYouTubeUserMutation();

  const [
    disconnectYouTubeUserAdmin,
    { isLoading: isDisconnectingYouTubeAdmin },
  ] = useDisconnectYouTubeUserAdminMutation();

  const connectAccount = async (
    platform: PlatformType,
    moderatorId: string,
    accountId: string,
    isAdminMode = false,
  ) => {
    try {
      if (platform === "tiktok") {
        if (isAdminMode) {
          await connectTikTokUserAdmin({
            moderatorId,
            tikTokUsersIds: [accountId],
          }).unwrap();
        } else {
          await connectTikTokUser({
            tikTokUsersIds: [accountId],
          }).unwrap();
        }
      }

      if (platform === "youtube") {
        if (isAdminMode) {
          await connectYouTubeUserAdmin({
            moderatorId,
            youTubeUsersIds: [accountId],
          }).unwrap();
        } else {
          await connectYouTubeUser({
            youTubeUsersIds: [accountId],
          }).unwrap();
        }
      }

      toast.success("Аккаунт добавлен");
      return true;
    } catch {
      toast.error("Не удалось добавить аккаунт");
      return false;
    }
  };

  const disconnectAccount = async (
    platform: PlatformType,
    accountId: string,
    moderatorId?: string,
  ) => {
    try {
      if (platform === "tiktok") {
        if (moderatorId) {
          await disconnectTikTokUserAdmin({
            moderatorId,
            userId: accountId,
          }).unwrap();
        } else {
          await disconnectTikTokUser(accountId).unwrap();
        }
      }

      if (platform === "youtube") {
        if (moderatorId) {
          await disconnectYouTubeUserAdmin({
            moderatorId,
            userId: accountId,
          }).unwrap();
        } else {
          await disconnectYouTubeUser(accountId).unwrap();
        }
      }

      toast.success("Аккаунт удалён");
      return true;
    } catch {
      toast.error("Не удалось удалить аккаунт");
      return false;
    }
  };

  return {
    connectAccount,
    disconnectAccount,
    isConnecting:
      isConnectingTikTok ||
      isConnectingTikTokAdmin ||
      isConnectingYouTube ||
      isConnectingYouTubeAdmin,
    isDisconnecting:
      isDisconnectingTikTok ||
      isDisconnectingTikTokAdmin ||
      isDisconnectingYouTube ||
      isDisconnectingYouTubeAdmin,
  };
};
