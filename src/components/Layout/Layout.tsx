import { AnimatePresence, m } from 'framer-motion';
import * as React from 'react';
import tw from 'twin.macro';

import { useStorageListener } from '$/hooks/useMessageListener';
import { LOG_IN_SUCCESS_KEY, LOG_OUT_SUCCESS_KEY } from '$/lib/constants';

import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';

export interface ILayoutProps extends React.ComponentPropsWithoutRef<'div'> {
  noContainer?: boolean;
  noHeader?: boolean;
  noFooter?: boolean;
}

export function Layout({
  noContainer,
  noHeader,
  noFooter,
  children,
  ...divProps
}: ILayoutProps): JSX.Element {
  useStorageListener((event) => {
    if (LOG_IN_SUCCESS_KEY === event.key) {
      window.localStorage.setItem(LOG_OUT_SUCCESS_KEY, '');
      window.location.reload();
    } else if (LOG_OUT_SUCCESS_KEY === event.key) {
      window.localStorage.setItem(LOG_IN_SUCCESS_KEY, '');
      window.location.reload();
    }
  });

  return (
    <div {...divProps} css={[tw`min-h-full`, noContainer && tw`flex flex-col items-center`]}>
      {!noHeader && <Header />}

      <AnimatePresence>
        <m.div
          tw="min-h-full"
          transition={{ duration: 0.35 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {noContainer ? (
            children
          ) : (
            <main tw="py-10 min-h-full" className="main-container">
              {children}
            </main>
          )}
        </m.div>
      </AnimatePresence>

      {!noFooter && <Footer tw="mt-auto" />}
    </div>
  );
}
