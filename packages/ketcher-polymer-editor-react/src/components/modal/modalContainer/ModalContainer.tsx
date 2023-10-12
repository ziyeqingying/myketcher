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
import {
  closeModal,
  selectAdditionalProps,
  selectModalIsOpen,
  selectModalName,
} from 'state/modal';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useCallback } from 'react';
import { modalComponentList } from './modalComponentList';

export const ModalContainer = () => {
  const isOpen = useAppSelector(selectModalIsOpen);
  const modalName = useAppSelector(selectModalName);
  const additionalProps = useAppSelector(selectAdditionalProps);
  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  if (!modalName) return null;

  const Component = modalComponentList[modalName];

  if (!Component)
    throw new Error(`There is no modal window named ${modalName}`);

  return additionalProps ? (
    <Component
      onClose={handleClose}
      isModalOpen={isOpen}
      {...additionalProps}
    />
  ) : (
    <Component onClose={handleClose} isModalOpen={isOpen} />
  );
};
