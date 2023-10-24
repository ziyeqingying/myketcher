import styled from '@emotion/styled';
import { ActionButton } from 'components/shared/actionButton';
import { Modal } from 'components/shared/modal';
import { BaseMonomer } from 'ketcher-core/dist/domain/entities/BaseMonomer';
import { StructRender } from 'ketcher-react';
import { useAppSelector } from 'hooks';
import { selectEditor } from 'state/common';
import { useMemo, useState } from 'react';
import {
  Row,
  Column,
  AttachmentPointList,
  AttachmentPoint,
  AttachmentPointName,
  MonomerName,
} from './styledComponents';
import { MonomerConnectionProps } from '../modalContainer/types';

const StyledModal = styled(Modal)({
  '& .MuiPaper-root': {
    width: '520px',
    height: 'fit-content',
  },

  '& .MuiDialogContent-root': {
    overflow: 'hidden',
  },
});

export const StyledStructRender = styled(StructRender)(({ theme }) => ({
  height: '200px',
  width: '200px',
  border: `1px solid ${theme.ketcher.color.button.secondary.active}`,
  borderRadius: theme.ketcher.border.radius.regular,
}));

const MonomerConnection = ({
  onClose,
  isModalOpen,
  firstMonomer,
  secondMonomer,
}: MonomerConnectionProps): React.ReactElement => {
  const editor = useAppSelector(selectEditor);

  if (!firstMonomer || !secondMonomer) {
    throw new Error('Monomers must exist!');
  }

  const firstBonds = firstMonomer.attachmentPointsToBonds;
  const secondBonds = secondMonomer.attachmentPointsToBonds;

  const [firstSelectedAttachmentPoint, setFirstSelectedAttachmentPoint] =
    useState<string | null>(getDefaultAttachmentPoint(firstBonds));
  const [secondSelectedAttachmentPoint, setSecondSelectedAttachmentPoint] =
    useState<string | null>(getDefaultAttachmentPoint(secondBonds));

  const cancelBondCreationAndClose = () => {
    editor.events.cancelBondCreationViaModal.dispatch();
    onClose();
  };

  const connectMonomers = () => {
    if (!firstSelectedAttachmentPoint || !secondSelectedAttachmentPoint) {
      throw new Error('Attachment points cannot be falsy');
    }

    editor.events.createBondViaModal.dispatch({
      firstMonomer,
      secondMonomer,
      firstSelectedAttachmentPoint,
      secondSelectedAttachmentPoint,
    });

    onClose();
  };

  return (
    <StyledModal
      title=""
      isOpen={isModalOpen}
      onClose={cancelBondCreationAndClose}
    >
      <Modal.Content>
        <Row>
          <Column>
            <AttachmentPointSelectionPanel
              monomer={firstMonomer}
              selectedAttachmentPoint={firstSelectedAttachmentPoint}
              onSelectAttachmentPoint={setFirstSelectedAttachmentPoint}
            />
          </Column>
          <Column>
            <AttachmentPointSelectionPanel
              monomer={secondMonomer}
              selectedAttachmentPoint={secondSelectedAttachmentPoint}
              onSelectAttachmentPoint={setSecondSelectedAttachmentPoint}
            />
          </Column>
        </Row>
      </Modal.Content>

      <Modal.Footer>
        <ActionButton
          label="Cancel"
          styleType="secondary"
          clickHandler={cancelBondCreationAndClose}
        />
        <ActionButton
          label="Connect"
          disabled={
            !firstSelectedAttachmentPoint || !secondSelectedAttachmentPoint
          }
          clickHandler={connectMonomers}
        />
      </Modal.Footer>
    </StyledModal>
  );
};

interface AttachmentPointSelectionPanelProps {
  monomer: BaseMonomer;
  selectedAttachmentPoint: string | null;
  onSelectAttachmentPoint: (attachmentPoint: string) => void;
}

function AttachmentPointSelectionPanel({
  monomer,
  selectedAttachmentPoint,
  onSelectAttachmentPoint,
}: AttachmentPointSelectionPanelProps): React.ReactElement {
  const bonds = monomer.attachmentPointsToBonds;

  const connectedAttachmentPoints = useMemo(
    () => getConnectedAttachmentPoints(bonds),
    [bonds],
  );

  return (
    <>
      <MonomerName>{monomer.monomerItem.props.Name}</MonomerName>
      <StyledStructRender
        struct={monomer.monomerItem.struct}
        options={{
          connectedMonomerAttachmentPoints: connectedAttachmentPoints,
          currentlySelectedMonomerAttachmentPoint:
            selectedAttachmentPoint ?? undefined,
        }}
      />
      <AttachmentPointList>
        {Object.entries(bonds).map(([attachmentPoint, bond]) => (
          <AttachmentPoint key={attachmentPoint}>
            <ActionButton
              label={attachmentPoint}
              styleType={
                attachmentPoint === selectedAttachmentPoint
                  ? 'primary'
                  : 'secondary'
              }
              clickHandler={() => onSelectAttachmentPoint(attachmentPoint)}
              disabled={Boolean(bond)}
            />
            <AttachmentPointName>H</AttachmentPointName>
          </AttachmentPoint>
        ))}
      </AttachmentPointList>
    </>
  );
}

function getConnectedAttachmentPoints(
  bonds: Record<string, unknown>,
): string[] {
  return Object.entries(bonds)
    .filter(([_, bond]) => Boolean(bond))
    .map(([attachmentPoint]) => attachmentPoint);
}

function getDefaultAttachmentPoint(
  bonds: Record<string, unknown>,
): string | null {
  const possibleAttachmentPoints = Object.entries(bonds).filter(
    ([_, bond]) => bond == null,
  );

  if (possibleAttachmentPoints.length === 1) {
    const [attachmentPointName] = possibleAttachmentPoints[0];

    return attachmentPointName;
  }

  return null;
}

export { MonomerConnection };
