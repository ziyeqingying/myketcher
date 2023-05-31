import { Reducer } from 'react'
import { Vec2 } from 'ketcher-core'

export interface FloatingToolsState {
  visible: boolean
  rotateHandlePosition: Vec2
}
const initialState: FloatingToolsState = {
  visible: false,
  rotateHandlePosition: new Vec2()
}

export const showFloatingTools = (rotateHandlePosition: Vec2) => {
  return {
    type: 'SHOW_FLOATING_TOOLS' as const,
    payload: {
      visible: true,
      rotateHandlePosition
    }
  }
}

export const hideFloatingTools = () => {
  return {
    type: 'HIDE_FLOATING_TOOLS' as const,
    payload: {
      visible: false
    }
  }
}

export const updateFloatingToolsPos = (rotateHandlePosition: Vec2) => {
  return {
    type: 'UPDATE_FLOATING_TOOLS_POS' as const,
    payload: {
      rotateHandlePosition
    }
  }
}

export interface FloatingToolsAction {
  type:
    | 'SHOW_FLOATING_TOOLS'
    | 'HIDE_FLOATING_TOOLS'
    | 'UPDATE_FLOATING_TOOLS_POS'
  payload: Partial<FloatingToolsState>
}

const floatingToolsReducer: Reducer<FloatingToolsState, FloatingToolsAction> = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case 'SHOW_FLOATING_TOOLS':
    case 'HIDE_FLOATING_TOOLS':
    case 'UPDATE_FLOATING_TOOLS_POS':
      return { ...state, ...payload }
    default:
      return state
  }
}

export default floatingToolsReducer
