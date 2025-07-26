import { ref } from 'vue';
import { DiscordService } from '../services/discord.service';
import { isUserAuthorized } from '../database/queries/users.query';
import { UserRights } from '../../netlify/core/database/types';

export function useUserAuthorization() {
  const userAuthorized = ref<boolean>(false);

  async function loadUserAuthorization() {
    const currentUser = DiscordService.getInstance().getUser();
    if (currentUser === null) {
      userAuthorized.value = false;
      return;
    }
    userAuthorized.value = await isUserAuthorized(currentUser.id, UserRights.UPDATE);
  }

  return {
    userAuthorized,
    loadUserAuthorization
  };
} 