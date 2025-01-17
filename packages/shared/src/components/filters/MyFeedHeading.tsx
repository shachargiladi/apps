import React, { ReactElement, useContext } from 'react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { FilterIcon, RefreshIcon } from '../icons';
import {
  Button,
  ButtonIconPosition,
  ButtonSize,
  ButtonVariant,
} from '../buttons/Button';
import AnalyticsContext from '../../contexts/AnalyticsContext';
import { AnalyticsEvent } from '../../lib/analytics';
import { useFeedLayout, useViewSize, ViewSize } from '../../hooks';
import { feature } from '../../lib/featureManagement';
import { useFeature } from '../GrowthBookProvider';
import { setShouldRefreshFeed } from '../../lib/refreshFeed';
import { SharedFeedPage } from '../utilities';
import { useMobileUxExperiment } from '../../hooks/useMobileUxExperiment';

export const filterAlertMessage = 'Edit your personal feed preferences here';

interface MyFeedHeadingProps {
  onOpenFeedFilters: () => void;
}

function MyFeedHeading({
  onOpenFeedFilters,
}: MyFeedHeadingProps): ReactElement {
  const isMobile = useViewSize(ViewSize.MobileL);
  const { trackEvent } = useContext(AnalyticsContext);
  const { shouldUseMobileFeedLayout } = useFeedLayout();
  const queryClient = useQueryClient();
  const forceRefresh = useFeature(feature.forceRefresh);
  const { isNewMobileLayout } = useMobileUxExperiment();

  const onClick = () => {
    trackEvent({ event_name: AnalyticsEvent.ManageTags });
    onOpenFeedFilters();
  };

  const onRefresh = async () => {
    trackEvent({ event_name: AnalyticsEvent.RefreshFeed });
    setShouldRefreshFeed(true);
    await queryClient.refetchQueries({ queryKey: [SharedFeedPage.MyFeed] });
    setShouldRefreshFeed(false);
  };

  const isFetchingFeed =
    useIsFetching({ queryKey: [SharedFeedPage.MyFeed] }) > 0;
  const feedQueryState = queryClient.getQueryState([SharedFeedPage.MyFeed], {
    exact: false,
  });
  const isRefreshing = feedQueryState?.status === 'success' && isFetchingFeed;

  return (
    <>
      {forceRefresh && (
        <Button
          size={
            shouldUseMobileFeedLayout && !isNewMobileLayout
              ? ButtonSize.Small
              : ButtonSize.Medium
          }
          variant={
            isMobile && isNewMobileLayout
              ? ButtonVariant.Tertiary
              : ButtonVariant.Float
          }
          className="mr-auto"
          onClick={onRefresh}
          icon={<RefreshIcon />}
          iconPosition={
            shouldUseMobileFeedLayout ? ButtonIconPosition.Right : undefined
          }
          loading={isRefreshing}
        >
          {!isMobile && !isNewMobileLayout ? 'Refresh feed' : null}
        </Button>
      )}
      <Button
        size={
          shouldUseMobileFeedLayout && !isNewMobileLayout
            ? ButtonSize.Small
            : ButtonSize.Medium
        }
        variant={
          isNewMobileLayout ? ButtonVariant.Tertiary : ButtonVariant.Float
        }
        className="mr-auto"
        onClick={onClick}
        icon={<FilterIcon />}
        iconPosition={
          shouldUseMobileFeedLayout ? ButtonIconPosition.Right : undefined
        }
      >
        {!isMobile ? 'Feed settings' : null}
      </Button>
    </>
  );
}

export default MyFeedHeading;
