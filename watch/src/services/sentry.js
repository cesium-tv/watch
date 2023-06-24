import * as Sentry from '@sentry/vue';
import Vue from 'vue';
import router from '@/router';
import { SENTRY_DSN } from '@/config';

Sentry.init({
  Vue,
  dsn: SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^http:\/\/watch\.cesium\.tv\//],
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
