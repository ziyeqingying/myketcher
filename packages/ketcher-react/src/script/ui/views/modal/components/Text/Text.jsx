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

import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Dialog } from '../../../components/Dialog'

const Text = props => {
  const { formState, position, id, type } = props
  const [text, setText] = useState(props.label)

  const result = () => ({ label: text, position, id, type })

  return (
    <Dialog
      title="Text editor"
      params={props}
      result={result}
      valid={() => formState.form.valid}>
      <textarea
        value={text}
        onChange={event => setText(event.target.value)}
        rows="20"
        cols="20"></textarea>
    </Dialog>
  )
}

export default connect(store => ({ formState: store.modal }))(Text)
