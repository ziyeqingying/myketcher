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

import { useEffect, useState } from 'react';

import { Modal } from 'components/shared/modal';
import { Option } from 'components/shared/dropDown/dropDown';
import { TextArea } from 'components/shared/TextArea';
import { TextInputField } from 'components/shared/textInputField';
import { getPropertiesByFormat, SupportedFormats } from 'helpers/formats';
import { ActionButton } from 'components/shared/actionButton';
import { IndigoProvider } from 'ketcher-react';
import {
  ChemicalMimeType,
  KetSerializer,
  StructService,
  CoreEditor,
  KetcherLogger,
  getSvgFromDrawnStructures,
} from 'ketcher-core';
import { saveAs } from 'file-saver';
import { RequiredModalProps } from '../modalContainer';
import { LoadingCircles } from '../Open/AnalyzingFile/LoadingCircles';
import {
  Form,
  Loader,
  Row,
  StyledDropdown,
  stylesForExpanded,
  SvgPreview,
} from './Save.styles';
import styled from '@emotion/styled';
import { useAppDispatch } from 'hooks';
import { openErrorModal } from 'state/modal';

const options: Array<Option> = [
  { id: 'ket', label: 'Ket' },
  { id: 'mol', label: 'MDL Molfile V3000' },
  { id: 'sequence', label: 'Sequence' },
  { id: 'fasta', label: 'FASTA' },
  { id: 'idt', label: 'IDT' },
  { id: 'svg', label: 'SVG Document' },
  { id: 'helm', label: 'HELM' },
];

const formatDetector = {
  mol: ChemicalMimeType.Mol,
  fasta: ChemicalMimeType.FASTA,
  sequence: ChemicalMimeType.SEQUENCE,
  idt: ChemicalMimeType.IDT,
  helm: ChemicalMimeType.HELM,
};

const StyledModal = styled(Modal)({
  '& div.MuiPaper-root': {
    background: 'white',
    minHeight: '400px',
    minWidth: '430px',
  },

  '& .MuiDialogContent-root': {
    overflow: 'hidden',
    height: '100%',
  },
});

export const Save = ({
  onClose,
  isModalOpen,
}: RequiredModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [currentFileFormat, setCurrentFileFormat] =
    useState<SupportedFormats>('ket');
  const [currentFileName, setCurrentFileName] = useState('ketcher');
  const [struct, setStruct] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [svgData, setSvgData] = useState<string | undefined>();
  const indigo = IndigoProvider.getIndigo() as StructService;
  const editor = CoreEditor.provideEditorInstance();

  const handleSelectChange = async (fileFormat) => {
    setCurrentFileFormat(fileFormat);
    const ketSerializer = new KetSerializer();
    const serializedKet = ketSerializer.serialize(
      editor.drawingEntitiesManager.micromoleculesHiddenEntities.clone(),
      editor.drawingEntitiesManager,
    );
    setSvgData(undefined);
    if (fileFormat === 'ket') {
      setStruct(serializedKet);
      return;
    }
    if (fileFormat === 'svg') {
      const svgData = getSvgFromDrawnStructures(editor.canvas, 'preview');
      setSvgData(svgData);
      return;
    }

    try {
      setIsLoading(true);
      const result = await indigo.convert({
        struct: serializedKet,
        output_format: formatDetector[fileFormat],
      });
      setStruct(result.struct);
    } catch (error) {
      let stringError;
      if (error instanceof Error) {
        stringError = error.message;
      } else {
        stringError = typeof error === 'string' ? error : JSON.stringify(error);
      }
      const errorMessage = 'Convert error! ' + stringError;
      dispatch(openErrorModal(errorMessage));
      KetcherLogger.error(errorMessage);
      setCurrentFileFormat('ket');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setCurrentFileName(value);
  };

  const handleSave = () => {
    let blobPart;
    if (currentFileFormat === 'svg') {
      const svgData = getSvgFromDrawnStructures(editor.canvas, 'file');
      if (!svgData) {
        onClose();
        return;
      }
      blobPart = svgData;
    } else {
      blobPart = struct;
    }
    const blob = new Blob([blobPart], {
      type: getPropertiesByFormat(currentFileFormat).mime,
    });
    const formatProperties = getPropertiesByFormat(currentFileFormat);
    saveAs(blob, `${currentFileName}${formatProperties.extensions[0]}`);
    onClose();
  };

  useEffect(() => {
    if (currentFileFormat === 'ket') {
      const ketSerializer = new KetSerializer();
      const serializedKet = ketSerializer.serialize(
        editor.drawingEntitiesManager.micromoleculesHiddenEntities.clone(),
        editor.drawingEntitiesManager,
      );
      setStruct(serializedKet);
    }
  }, [currentFileFormat]);

  return (
    <StyledModal title="save structure" isOpen={isModalOpen} onClose={onClose}>
      <Modal.Content>
        <Form onSubmit={handleSave} id="save">
          <Row style={{ padding: '12px 12px 10px' }}>
            <div>
              <TextInputField
                value={currentFileName}
                id="filename"
                onChange={handleInputChange}
                label="File name:"
              />
            </div>
            <StyledDropdown
              label="File format:"
              options={options}
              currentSelection={currentFileFormat}
              selectionHandler={handleSelectChange}
              customStylesForExpanded={stylesForExpanded}
            />
          </Row>
          {svgData ? (
            <SvgPreview dangerouslySetInnerHTML={{ __html: svgData }} />
          ) : (
            <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
              <TextArea
                testId="preview-area-text"
                value={struct}
                readonly
                selectOnInit
              />
              {isLoading && (
                <Loader>
                  <LoadingCircles />
                </Loader>
              )}
            </div>
          )}
        </Form>
      </Modal.Content>

      <Modal.Footer>
        <ActionButton
          label="Cancel"
          styleType="secondary"
          clickHandler={onClose}
        />

        <ActionButton
          label="Save"
          clickHandler={handleSave}
          disabled={!currentFileName}
        />
      </Modal.Footer>
    </StyledModal>
  );
};
