import React, { ReactElement, ReactNode, useContext, useEffect } from 'react';
import { PublicProfile } from '@dailydotdev/shared/src/lib/user';
import AuthContext from '@dailydotdev/shared/src/contexts/AuthContext';
import { NextSeoProps } from 'next-seo/lib/types';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { ProfileSettingsMenu } from '@dailydotdev/shared/src/components/profile/ProfileSettingsMenu';
import {
  generateQueryKey,
  RequestKey,
} from '@dailydotdev/shared/src/lib/query';
import { useViewSize, ViewSize } from '@dailydotdev/shared/src/hooks';
import { useQueryState } from '@dailydotdev/shared/src/hooks/utils/useQueryState';
import { useRouter } from 'next/router';
import { getLayout as getMainLayout } from '../MainLayout';
import { getTemplatedTitle } from '../utils';
import SidebarNav from './SidebarNav';

export interface AccountLayoutProps {
  profile: PublicProfile;
  children?: ReactNode;
}

export const navigationKey = generateQueryKey(
  RequestKey.AccountNavigation,
  null,
);

export default function AccountLayout({
  children,
}: AccountLayoutProps): ReactElement {
  const router = useRouter();
  const { user: profile, isFetched } = useContext(AuthContext);
  const isMobile = useViewSize(ViewSize.MobileL);
  const [isOpen, setIsOpen] = useQueryState({
    key: navigationKey,
    defaultValue: false,
  });

  useEffect(() => {
    const onClose = () => setIsOpen(false);

    router.events.on('routeChangeComplete', onClose);

    return () => {
      router.events.off('routeChangeComplete', onClose);
    };
  }, [router.events, setIsOpen]);

  if (!profile || !Object.keys(profile).length || (isFetched && !profile)) {
    return null;
  }

  const Seo: NextSeoProps = profile
    ? {
        title: getTemplatedTitle(profile.name),
        description: profile.bio
          ? profile.bio
          : `Check out ${profile.name}'s profile`,
        openGraph: {
          images: [{ url: profile.image }],
        },
        twitter: {
          handle: profile.twitter,
        },
      }
    : {};

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={profile.image} />
      </Head>
      <NextSeo {...Seo} noindex nofollow />
      <main className="relative mx-auto flex w-full flex-1 flex-row items-stretch pt-0 laptop:max-w-[calc(100vw-17.5rem)]">
        {isMobile ? (
          <ProfileSettingsMenu
            shouldKeepOpen
            isOpen={isOpen}
            onClose={() => router.push(profile.permalink)}
          />
        ) : (
          <SidebarNav
            className="absolute z-3 ml-auto h-full w-full border-l border-border-subtlest-tertiary bg-background-default tablet:relative tablet:w-[unset]"
            basePath="account"
          />
        )}
        {children}
      </main>
    </>
  );
}

export const getAccountLayout = (
  page: ReactNode,
  props: AccountLayoutProps,
): ReactNode =>
  getMainLayout(<AccountLayout {...props}>{page}</AccountLayout>, null, {
    screenCentered: false,
  });
