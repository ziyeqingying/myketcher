/****************************************************************************
 * Copyright 2020 EPAM Systems
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

import { StructService, StructServiceOptions } from './structService.types'

import {
  StructServiceProvider,
  ServiceMode
} from './structServiceProvider.types'
import RemoteStructService from './RemoteStructService'

class RemoteStructServiceProvider implements StructServiceProvider {
  private apiPath: string
  mode: ServiceMode = 'remote'

  constructor(baseUrl: string) {
    let apiPath = baseUrl
    const params = new URLSearchParams(document.location.search)
    if (params.has('api_path')) {
      apiPath = params.get('api_path')!
    }
    this.apiPath = !apiPath || /\/$/.test(apiPath) ? apiPath : apiPath + '/'
  }

  createStructService(options: StructServiceOptions): StructService {
    return new RemoteStructService(this.apiPath, options)
  }
}

export default RemoteStructServiceProvider
