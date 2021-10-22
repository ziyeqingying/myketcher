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

import 'intersection-observer';
import {
  BottomToolbarContainer,
  LeftToolbarContainer,
  RightToolbarContainer,
  TopToolbarContainer
} from '../views/toolbars'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AppClipArea from '../views/AppClipArea'
import { AppHiddenContainer } from './AppHidden'
import AppModalContainer from '../views/modal'
import Editor from '../views/Editor'
import classes from './App.module.less'
import { initFGTemplates } from '../state/functionalGroups'
import { useSettingsContext } from '../../../hooks'

interface AppCallProps {
  checkServer: () => void
}

type Props = AppCallProps

const App = (props: Props) => {
  const dispatch = useDispatch()
  const { checkServer } = props
  const { staticResourcesUrl } = useSettingsContext()

  useEffect(() => {
    checkServer()
    dispatch(initFGTemplates(staticResourcesUrl))
  }, [])

  return (
    <div className={classes.app}>
      <AppHiddenContainer />
      <Editor className={classes.canvas} />

      <TopToolbarContainer className={classes.top} />
      <LeftToolbarContainer className={classes.left} />
      <BottomToolbarContainer className={classes.bottom} />
      <RightToolbarContainer className={classes.right} />

      <AppClipArea />
      <AppModalContainer />
    </div>
  )
}

export type { AppCallProps }
export { App }
