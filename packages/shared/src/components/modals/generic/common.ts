import { cloudinary } from '../../../lib/image';
import { dailyDevApps } from '../../../lib/constants';
import {
  MarketingCta,
  MarketingCtaVariant,
} from '../../cards/MarketingCta/common';

export const promotion: Record<string, MarketingCta> = {
  migrateStreaks: {
    variant: MarketingCtaVariant.Popover,
    campaignId: 'migrateStreaks',
    createdAt: new Date(),
    flags: {
      title: 'Goodbye weekly goals,\nWelcome reading streaks!',
      description:
        'Unlock the magic of consistently learning with our new reading streaks system',
      image: cloudinary.streak.migrate,
      ctaText: 'Install the app',
      ctaUrl: dailyDevApps,
      tagColor: 'avocado',
      tagText: 'New Release',
    },
  },
  bookmarkPromoteMobile: {
    variant: MarketingCtaVariant.Popover,
    campaignId: 'bookmarkPromoteMobile',
    createdAt: new Date(),
    flags: {
      title: 'Get back to your bookmarks on the go',
      description:
        'Your saved posts are waiting for you on daily.dev mobile. Perfect for reading anytime, anywhere.',
      image: cloudinary.streak.migrate, // TODO: Replace with mobile bookmark image once uploaded to cloudinary
      ctaText: 'Install the app',
      ctaUrl: dailyDevApps,
      tagColor: 'cabbage',
      tagText: 'Mobile version',
    },
  },
};
