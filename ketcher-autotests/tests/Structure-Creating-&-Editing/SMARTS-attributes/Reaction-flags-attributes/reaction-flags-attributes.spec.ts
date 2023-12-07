import { Page, test } from '@playwright/test';
import {
  BondTypeName,
  clickInTheMiddleOfTheScreen,
  doubleClickOnAtom,
  pressButton,
  selectBond,
  takeEditorScreenshot,
  waitForAtomPropsModal,
  waitForPageInit,
} from '@utils';
import {
  checkSmartsValue,
  checkSmartsWarnings,
  setReactionFlagExactChange,
  setReactionFlagInversion,
} from '../utils';

const defaultFileFormat = 'MDL Molfile V2000';
const expectedSmarts = '[#6](-[#6])(-[#6])-[#6]';

async function drawStructure(page: Page, numberOfClicks: number) {
  await selectBond(BondTypeName.Single, page);
  for (let i = 0; i < numberOfClicks; i++) {
    await clickInTheMiddleOfTheScreen(page);
  }
}

test.describe('Checking atom properties attributes in SMARTS format', () => {
  test.beforeEach(async ({ page }) => {
    const numberOfAtom = 0;
    const numberOfBondsAtStructure = 3;
    await waitForPageInit(page);
    await drawStructure(page, numberOfBondsAtStructure);
    await page.keyboard.press('Escape');
    await doubleClickOnAtom(page, 'C', numberOfAtom);
    await waitForAtomPropsModal(page);
    await page.getByTestId('Reaction flags-section').click();
  });

  test('Setting reaction flag - Inverts', async ({ page }) => {
    /**
     * Test case: https://github.com/epam/ketcher/issues/3431
     * Description: setting reaction flag - inverts should have no impact on SMARTS output but warning should be displayed
     */
    await setReactionFlagInversion(page, 'Inverts');
    await pressButton(page, 'Apply');
    await takeEditorScreenshot(page);
    await checkSmartsValue(page, defaultFileFormat, expectedSmarts);
    await checkSmartsWarnings(page);
  });

  test('Setting reaction flag - Retains', async ({ page }) => {
    /**
     * Test case: https://github.com/epam/ketcher/issues/3431
     * Description: setting reaction flag - retains should have no impact on SMARTS output but warning should be displayed
     */
    await setReactionFlagInversion(page, 'Retains');
    await pressButton(page, 'Apply');
    await takeEditorScreenshot(page);
    await checkSmartsValue(page, defaultFileFormat, expectedSmarts);
    await checkSmartsWarnings(page);
  });

  test('Setting reaction flag - Exact change checked', async ({ page }) => {
    /**
     * Test case: https://github.com/epam/ketcher/issues/3431
     * Description: checking exact change option at reaction flag section should have no impact on SMARTS output but warning should be displayed
     */
    await setReactionFlagExactChange(page);
    await pressButton(page, 'Apply');
    await takeEditorScreenshot(page);
    await checkSmartsValue(page, defaultFileFormat, expectedSmarts);
    await checkSmartsWarnings(page);
  });
});
