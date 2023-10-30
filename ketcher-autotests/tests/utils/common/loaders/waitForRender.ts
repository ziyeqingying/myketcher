import { Page } from '@playwright/test';

type AnyFunction = (...args: any) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFunction: AnyFunction = async () => {};

export const waitForRender = async (
  page: Page,
  callback = emptyFunction,
  timeout = 3000,
) => {
  await Promise.all([
    waitForCustomEvent(page, 'renderComplete', timeout),
    callback(),
  ]);
};

export const waitForCopy = async (
  page: Page,
  callback = emptyFunction,
  timeout = 3000,
) => {
  await Promise.all([
    waitForCustomEvent(page, 'copyOrCutComplete', timeout),
    callback(),
  ]);
};

export const waitForCut = async (
  page: Page,
  callback = emptyFunction,
  timeout = 3000,
) => {
  await waitForRender(page, async () => {
    await Promise.all([
      waitForCustomEvent(page, 'copyOrCutComplete', timeout),
      callback(),
    ]);
  });
};

export const waitForPaste = async (
  page: Page,
  callback = emptyFunction,
  timeout = 3000,
) => {
  await Promise.all([
    waitForCustomEvent(page, 'requestCompleted', timeout),
    callback(),
  ]);
};

async function waitForCustomEvent(
  page: Page,
  eventName: string,
  timeout?: number,
) {
  return page.evaluate(
    async ({ eventName, timeout }: { eventName: string; timeout?: number }) => {
      return new Promise((resolve) => {
        window.addEventListener(
          eventName,
          () => {
            resolve(true);
          },
          { once: true },
        );
        if (timeout) {
          setTimeout(() => resolve(true), timeout);
        }
      });
    },
    { eventName, timeout },
  );
}
