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
import { Modal } from 'components/shared/modal';
import { useCallback, useEffect, useState } from 'react';
import { ViewSwitcher } from './ViewSwitcher';
import { ActionButton } from 'components/shared/actionButton';
import { FileOpener, fileOpener } from './fileOpener';
import {
  ChemicalMimeType,
  KetSerializer,
  StructService,
  SupportedFormat,
  identifyStructFormat,
  CoreEditor,
  KetcherLogger,
} from 'ketcher-core';
import { IndigoProvider } from 'ketcher-react';
import assert from 'assert';
import { RequiredModalProps } from '../modalContainer';
import { OpenFileWrapper } from './Open.styles';
import { Loader } from '../save/Save.styles';
import { LoadingCircles } from './AnalyzingFile/LoadingCircles';

export interface Props {
  onClose: () => void;
  isModalOpen: boolean;
}

export const MODAL_STATES = {
  openOptions: 'openOptions',
  textEditor: 'textEditor',
} as const;

export type MODAL_STATES_VALUES =
  typeof MODAL_STATES[keyof typeof MODAL_STATES];

const addToCanvas = ({
  ketSerializer,
  editor,
  struct,
}: {
  ketSerializer: KetSerializer;
  editor: CoreEditor;
  struct: string;
}) => {
  const deserialisedKet = ketSerializer.deserializeToDrawingEntities(struct);
  assert(deserialisedKet);
  deserialisedKet.drawingEntitiesManager.mergeInto(
    editor.drawingEntitiesManager,
  );
  editor.renderersContainer.update(deserialisedKet.modelChanges);
};

// TODO: replace after the implementation of the function for processing the structure from the file
const onOk = async ({
  struct,
  fragment,
  onCloseCallback,
  setIsLoading,
}: {
  struct: string;
  fragment: boolean;
  onCloseCallback: () => void;
  setIsLoading: (isLoading: boolean) => void;
}) => {
  if (fragment) {
    console.log('add fragment');
  }
  const isKet = identifyStructFormat(struct) === SupportedFormat.ket;
  const ketSerializer = new KetSerializer();
  const editor = CoreEditor.provideEditorInstance();
  if (isKet) {
    addToCanvas({ struct, ketSerializer, editor });
    onCloseCallback();
    return;
  }
  const indigo = IndigoProvider.getIndigo() as StructService;
  try {
    setIsLoading(true);
    const ketStruct = await indigo.convert({
      struct,
      output_format: ChemicalMimeType.KET,
    });
    addToCanvas({ struct: ketStruct.struct, ketSerializer, editor });
    onCloseCallback();
  } catch (error) {
    editor.events.error.dispatch(error);
    KetcherLogger.error(error);
  } finally {
    setIsLoading(false);
  }
};
const isAnalyzingFile = false;
const errorHandler = (error) => console.log(error);

const Open = ({ isModalOpen, onClose }: RequiredModalProps) => {
  const [structStr, setStructStr] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [opener, setOpener] = useState<
    { chosenOpener: FileOpener } | undefined
  >();
  const [currentState, setCurrentState] = useState<MODAL_STATES_VALUES>(
    MODAL_STATES.openOptions,
  );

  useEffect(() => {
    fileOpener().then((chosenOpener) => {
      setOpener({ chosenOpener });
    });
  }, []);

  const onCloseCallback = useCallback(() => {
    setCurrentState(MODAL_STATES.openOptions);
    setStructStr('');
    onClose();
  }, [onClose]);

  const onFileLoad = (files: File[]) => {
    const onLoad = (fileContent) => {
      setStructStr(fileContent);
      setCurrentState(MODAL_STATES.textEditor);
    };
    const onError = () => errorHandler('Error processing file');

    setFileName(files[0].name);
    opener?.chosenOpener(files[0]).then(onLoad, onError);
  };

  const copyHandler = () => {
    onOk({ struct: structStr, fragment: true, onCloseCallback, setIsLoading });
  };

  const openHandler = () => {
    onOk({ struct: structStr, fragment: false, onCloseCallback, setIsLoading });
  };

  const getButtons = () => {
    if (currentState === MODAL_STATES.textEditor && !isAnalyzingFile) {
      return [
        <ActionButton
          key="copyButton"
          disabled={!structStr}
          clickHandler={copyHandler}
          label="Add to Canvas"
          title="Structure will be loaded as fragment and added to Clipboard"
          styleType="secondary"
        />,
        <ActionButton
          key="openButton"
          disabled={!structStr}
          clickHandler={openHandler}
          label="Open as New Project"
        />,
      ];
    } else {
      return [];
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      title="Open Structure"
      onClose={onCloseCallback}
    >
      <Modal.Content>
        <OpenFileWrapper currentState={currentState}>
          <ViewSwitcher
            isAnalyzingFile={isAnalyzingFile}
            fileName={fileName}
            currentState={currentState}
            states={MODAL_STATES}
            selectClipboard={() => setCurrentState(MODAL_STATES.textEditor)}
            fileLoadHandler={onFileLoad}
            errorHandler={errorHandler}
            value={structStr}
            inputHandler={setStructStr}
          />
          {isLoading && (
            <Loader>
              <LoadingCircles />
            </Loader>
          )}
        </OpenFileWrapper>
      </Modal.Content>
      <Modal.Footer>{getButtons()}</Modal.Footer>
    </Modal>
  );
};
export { Open };
