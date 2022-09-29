import type { ColorScheme } from '@mantine/core';
import {
  Button,
  ColorSchemeProvider,
  LoadingOverlay,
  MantineProvider
} from '@mantine/core';
import * as React from 'react';
import { Inspector } from 'react-dev-inspector';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { tw } from 'twind';

import './styles/global.css';

import GlobalModal from './components/GlobalModal';
import { withScopeHotkey } from './core/hotkey';
import { appHistory, CustomRouter, Routes } from './router';
import { useThemeStore, useTrackedThemeState } from './stores/theme';
import { queryClient } from './utils/libs/react-query';

function ErrorFallback(): JSX.Element {
  return (
    <div
      className={tw`text-red-500 w-screen h-screen flex(& col) justify-center items-center`}
      role="alert"
    >
      <h2 className={tw`text-lg font-semibold`}>Ooops, something went wrong :( </h2>
      <Button className={tw`mt-4`} onClick={() => location.assign(location.origin)}>
        Refresh
      </Button>
    </div>
  );
}

export const App = withScopeHotkey(
  'global',
  function (): JSX.Element {
    const { colorScheme } = useTrackedThemeState();

    return (
      <React.Suspense
        fallback={
          <div className={tw`flex items-center justify-center w-screen h-screen`}>
            <LoadingOverlay visible overlayBlur={2} />
          </div>
        }
      >
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={useThemeStore.getState().toggleColorScheme}
        >
          <MantineProvider withGlobalStyles withNormalizeCSS>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <QueryClientProvider client={queryClient}>
                {import.meta.env.DEV && <ReactQueryDevtools />}
                {import.meta.env.DEV && <Inspector />}
                <CustomRouter history={appHistory}>
                  <Routes />
                </CustomRouter>
                <GlobalModal />
              </QueryClientProvider>
            </ErrorBoundary>
          </MantineProvider>
        </ColorSchemeProvider>
      </React.Suspense>
    );
  },
  { scopeElementType: 'root' }
);
