import { useCallback, useEffect, useState } from "react";
import * as discord from "../service/discord";
import { Toast, showToast } from "@raycast/api";

export default function useDiscord(login = false) {
  const [user, setUser] = useState<discord.IDiscordUser>();

  const loginDiscord = useCallback(async () => {
    try {
      const service = discord;
      await service.authorize();

      const user = await service.fetchUser();
      setUser(user);
    } catch (error) {
      console.error(error);
      // showToast({ style: Toast.Style.Failure, title: String(error) });
    }
  }, []);

  const logoutDiscord = useCallback(() => {
    setUser(undefined);
    discord.logout();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const service = discord;
        if (login) {
          await service.authorize();
        }
        const user = await service.fetchUser();
        setUser(user);
      } catch (error) {
        console.error(error);
        showToast({ style: Toast.Style.Failure, title: String(error) });
      }
    })();
  }, [login]);

  return { user, logoutDiscord, loginDiscord };
}
