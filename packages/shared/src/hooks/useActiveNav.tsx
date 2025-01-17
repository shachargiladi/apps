import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { AllFeedPages, OtherFeedPage } from '../lib/query';
import { SharedFeedPage } from '../components/utilities';
import { useMobileUxExperiment } from './useMobileUxExperiment';

export interface UseActiveNav {
  home: boolean;
  profile: boolean;
  bookmarks: boolean;
  notifications: boolean;
  search: boolean;
  squads: boolean;
}

export default function useActiveNav(activeFeed: AllFeedPages): UseActiveNav {
  const router = useRouter();
  const { isNewMobileLayout } = useMobileUxExperiment();

  const isHomeActive = useMemo(() => {
    const homePages = [
      SharedFeedPage.MyFeed,
      SharedFeedPage.Popular,
      SharedFeedPage.Upvoted,
      SharedFeedPage.Discussed,
      OtherFeedPage.History,
    ];

    if (isNewMobileLayout) {
      homePages.push(OtherFeedPage.Bookmarks, OtherFeedPage.Notifications);
    }

    if (homePages.includes(activeFeed)) {
      return true;
    }

    return router?.route?.startsWith('/posts/[id]'); // if post page the [id] was expected
  }, [activeFeed, isNewMobileLayout, router?.route]);

  const isProfileActive = router.pathname?.includes('/[userId]');
  const isSearchActive = activeFeed === SharedFeedPage.Search;
  const isBookmarksActive = activeFeed === OtherFeedPage.Bookmarks;
  const isNotificationsActive = activeFeed === OtherFeedPage.Notifications;
  const isSquadActive = activeFeed === OtherFeedPage.Squad;

  return {
    home: isHomeActive,
    profile: isProfileActive,
    bookmarks: isBookmarksActive,
    notifications: isNotificationsActive,
    search: isSearchActive,
    squads: isSquadActive,
  };
}
