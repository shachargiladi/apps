import { JSONValue } from '@growthbook/growthbook';
import {
  ReadingStreaksExperiment,
  PostPageOnboarding,
  OnboardingCopy,
} from './featureValues';
import { cloudinary } from './image';

export class Feature<T extends JSONValue> {
  readonly id: string;

  readonly defaultValue?: T;

  constructor(id: string, defaultValue?: T) {
    this.id = id;
    this.defaultValue = defaultValue;
  }
}

const feature = {
  feedVersion: new Feature('feed_version', 15),
  lowImps: new Feature('feed_low_imps'),
  bookmarkOnCard: new Feature('bookmark_on_card', false),
  readingStreaks: new Feature(
    'reading_streaks',
    ReadingStreaksExperiment.Control,
  ),
  onboardingVisual: new Feature('onboarding_visual', {
    showCompanies: true,
    poster: cloudinary.onboarding.video.poster,
    webm: cloudinary.onboarding.video.webm,
    mp4: cloudinary.onboarding.video.mp4,
  }),
  postPageOnboarding: new Feature(
    'post_page_onboarding',
    PostPageOnboarding.Control,
  ),
  forceRefresh: new Feature('force_refresh', false),
  feedAdSpot: new Feature('feed_ad_spot', 0),
  onboardingCopy: new Feature('onboarding_copy', OnboardingCopy.Control),
  searchVersion: new Feature('search_version', 1),
  forcedTagSelection: new Feature('forced_tag_selection', false),
  mobileUxLayout: new Feature('mobile_ux_layout', false),
  readingReminder: new Feature('reading_reminder', false),
  onboardingMostVisited: new Feature('onboarding_most_visited', false),
  shareExperience: new Feature('share_experience', false),
};

export { feature };
