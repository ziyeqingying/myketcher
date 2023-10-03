/****************************************************************************
 * Copyright 2021 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/

import { KetcherLogger } from 'ketcher-core';

/* local storage */
export const storage = {
  warningMessage:
    'Your changes will be lost after the tab closing. See Help (Note 2).',
  isAvailable() {
    try {
      const storage = global.localStorage;
      return storage;
    } catch (e) {
      KetcherLogger.error('storage-ext.js::storage::isAvailable', e);
      return false;
    }
  },
  getItem(key) {
    let item = null;
    try {
      item = JSON.parse(localStorage.getItem(key));
    } catch (e) {
      KetcherLogger.error('storage-ext.js::storage::getItem', e);
      console.info('LocalStorage:', e.name);
    }
    return item;
  },
  setItem(key, data) {
    let isSet = null;
    try {
      localStorage.setItem(key, JSON.stringify(data));
      isSet = true;
    } catch (e) {
      KetcherLogger.error('storage-ext.js::storage::setItem', e);
      console.info('LocalStorage:', e.name);
      isSet = false;
    }
    return isSet;
  },
};
