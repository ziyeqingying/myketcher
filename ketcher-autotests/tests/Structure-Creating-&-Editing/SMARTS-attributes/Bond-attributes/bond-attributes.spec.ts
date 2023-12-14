import { Page, test, expect } from '@playwright/test';
import {
  BondType,
  BondTypeName,
  clickInTheMiddleOfTheScreen,
  doubleClickOnBond,
  pressButton,
  receiveFileComparisonData,
  saveToFile,
  selectBond,
  takeEditorScreenshot,
  waitForPageInit,
} from '@utils';
import {
  checkSmartsValue,
  checkSmartsWarnings,
  setBondTopology,
  setBondType,
  setCustomQueryForBond,
  setReactingCenter,
} from '../utils';
import { getKet } from '@utils/formats';

const defaultFileFormat = 'MDL Molfile V2000';

async function drawStructure(page: Page) {
  await selectBond(BondTypeName.Single, page);
  await clickInTheMiddleOfTheScreen(page);
  await clickInTheMiddleOfTheScreen(page);
  await clickInTheMiddleOfTheScreen(page);
}

async function setAndCheckBondProperties(
  page: Page,
  setProperty: (arg0: Page, arg1: string) => Promise<void>,
  value: string,
  expectedSmarts: string,
) {
  await setProperty(page, value);
  await pressButton(page, 'Apply');
  await takeEditorScreenshot(page);
  await checkSmartsValue(page, defaultFileFormat, expectedSmarts);
}

async function waitForBondPropsModal(page: Page) {
  await expect(page.getByTestId('bondProps-dialog')).toBeVisible();
}

test.describe('Checking bond attributes in SMARTS format', () => {
  test.beforeEach(async ({ page }) => {
    const numberOfBond = 2;
    await waitForPageInit(page);
    await drawStructure(page);
    await page.keyboard.press('Escape');
    await doubleClickOnBond(page, BondType.SINGLE, numberOfBond);
    await waitForBondPropsModal(page);
  });

  // Tests for bond type:

  test('Setting bond type - single (aliphatic))', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Single-option',
      '[#6](-[#6])(-[#6])-[#6]',
    );
  });

  test('Setting bond type - single up', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Single Up-option',
      '[#6@](-[#6])(-[#6])/[#6]',
    );
  });

  test('Setting bond type - single down', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Single Down-option',
      '[#6@@](-[#6])(-[#6])\\[#6]',
    );
  });

  test('Setting bond type - single up/down', async ({ page }) => {
    test.fail();
    /**
     * This test will fail until https://github.com/epam/Indigo/issues/1371 is fixed
     */
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Single Up/Down-option',
      '[#6](-[#6])(-[#6])-[#6]',
    );
  });

  test('Setting bond type - double', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Double-option',
      '[#6](-[#6])(-[#6])=[#6]',
    );
  });

  test('Setting bond type - double cis/trans', async ({ page }) => {
    test.fail();
    /**
     * This test will fail until https://github.com/epam/Indigo/issues/1371 is fixed
     */
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Double Cis/Trans-option',
      '[#6](-[#6])(-[#6])=[#6]',
    );
  });

  test('Setting bond type - triple', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Triple-option',
      '[#6](-[#6])(-[#6])#[#6]',
    );
  });

  test('Setting bond type - aromatic', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Aromatic-option',
      '[#6](-[#6])(-[#6]):[#6]',
    );
  });

  test('Setting bond type - any', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Any-option',
      '[#6](-[#6])(-[#6])~[#6]',
    );
  });

  test('Setting bond type - hydrogen', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Hydrogen-option',
      '[#6](-[#6])(-[#6])[#6]',
    );
    await checkSmartsWarnings(page);
  });

  test('Setting bond type - single/double', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Single/Double-option',
      '[#6](-[#6])(-[#6])!:;-,=[#6]',
    );
  });

  test('Setting bond type - single/aromatic', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Single/Aromatic-option',
      '[#6](-[#6])(-[#6])-,:[#6]',
    );
  });

  test('Setting bond type - double/aromatic', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Double/Aromatic-option',
      '[#6](-[#6])(-[#6])=,:[#6]',
    );
  });

  test('Setting bond type - dative', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondType,
      'Dative-option',
      '[#6](-[#6])(-[#6])[#6]',
    );
    await checkSmartsWarnings(page);
  });

  // Tests for bond topology:

  test('Setting bond topology - ring', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondTopology,
      'Ring-option',
      '[#6](-[#6])(-[#6])-;@[#6]',
    );
  });

  test('Setting bond topology - chain', async ({ page }) => {
    await setAndCheckBondProperties(
      page,
      setBondTopology,
      'Chain-option',
      '[#6](-[#6])(-[#6])-;!@[#6]',
    );
  });

  test('Setting reacting center', async ({ page }) => {
    /**
     * Test case: https://github.com/epam/ketcher/issues/3431
     * Description: setting reacting center option should have no impact on SMARTS output but warning should be displayed
     */
    await setAndCheckBondProperties(
      page,
      setReactingCenter,
      'Center-option',
      '[#6](-[#6])(-[#6])-[#6]',
    );
    await checkSmartsWarnings(page);
  });

  // Custom query for bond

  test('Setting custom query - any OR double', async ({ page }) => {
    test.fail();
    /**
     * This test will fail until https://github.com/epam/Indigo/issues/1372 is fixed
     */
    await setAndCheckBondProperties(
      page,
      setCustomQueryForBond,
      '~,=',
      '[#6](-[#6])(-[#6])~,=[#6]',
    );
  });
});

test.describe('Checking converting bond attributes to custom query', () => {
  test.beforeEach(async ({ page }) => {
    const numberOfBond = 2;
    await waitForPageInit(page);
    await drawStructure(page);
    await page.keyboard.press('Escape');
    await doubleClickOnBond(page, BondType.SINGLE, numberOfBond);
    await waitForBondPropsModal(page);
  });

  test('Converting Topology = "Either" and Type = "Single" to custom query', async ({
    page,
  }) => {
    /**
     * Test case: https://github.com/epam/ketcher/issues/3372
     * Description: If topology = "Either" then customQuery should be empty e.g. Type=Single, Topology=Either => customQuery=-
     */
    const expectedValue = '-';
    await setBondType(page, 'Single-option');
    await setBondTopology(page, 'Either-option');
    await page.getByTestId('custom-query-checkbox').check();
    const customQueryInput = page.getByTestId('bond-custom-query');
    await expect(customQueryInput).toHaveValue(expectedValue);
    await takeEditorScreenshot(page);
  });

  test('Converting Topology = "Ring" and Type = "Double" to custom query', async ({
    page,
  }) => {
    /**
     * Test case: https://github.com/epam/ketcher/issues/3372
     * Description: If topology = "Ring" then customQuery should be @, e.g. Type=Double, Topology=Ring=>customQuery==;@
     */
    const expectedValue = '=;@';
    await setBondType(page, 'Double-option');
    await setBondTopology(page, 'Ring-option');
    await page.getByTestId('custom-query-checkbox').check();
    const customQueryInput = page.getByTestId('bond-custom-query');
    await expect(customQueryInput).toHaveValue(expectedValue);
    await takeEditorScreenshot(page);
  });

  test('Converting Topology = "Chain" and Type = "Triple" to custom query', async ({
    page,
  }) => {
    /**
     * Test case: https://github.com/epam/ketcher/issues/3372
     * Description: If topology = "Chain" then customQuery should be !@, e.g. Type=Triple, Topology=Chain=>customQuery=#;!@
     */
    const expectedValue = '#;!@';
    await setBondType(page, 'Triple-option');
    await setBondTopology(page, 'Chain-option');
    await page.getByTestId('custom-query-checkbox').check();
    const customQueryInput = page.getByTestId('bond-custom-query');
    await expect(customQueryInput).toHaveValue(expectedValue);
    await takeEditorScreenshot(page);
  });

  test('Converting Type = "Aromatic" and Reacting Center = "Center" to custom query', async ({
    page,
  }) => {
    /**
     * Test case: https://github.com/epam/ketcher/issues/3328
     * Description: aromatic bond should be converted to custom query as: :
     * Reacting Center option should be ingored at custom query
     */
    const expectedValue = ':';
    await setBondType(page, 'Aromatic-option');
    await setReactingCenter(page, 'Center-option');
    await page.getByTestId('custom-query-checkbox').check();
    const customQueryInput = page.getByTestId('bond-custom-query');
    await expect(customQueryInput).toHaveValue(expectedValue);
    await takeEditorScreenshot(page);
  });

  test('Converting Type = "Any" and Reacting Center = "Made/broken" to custom query', async ({
    page,
  }) => {
    /**
     * Test case: https://github.com/epam/ketcher/issues/3328
     * Description: any bond should be converted to custom query as: ~
     * Reacting Center option should be ingored at custom query
     */
    const expectedValue = '~';
    await setBondType(page, 'Any-option');
    await setReactingCenter(page, 'Made/broken-option');
    await page.getByTestId('custom-query-checkbox').check();
    const customQueryInput = page.getByTestId('bond-custom-query');
    await expect(customQueryInput).toHaveValue(expectedValue);
    await takeEditorScreenshot(page);
  });

  test('Converting Type = "Single up" and Reacting Center = "Order changes" to custom query', async ({
    page,
  }) => {
    /**
     * Test case: https://github.com/epam/ketcher/issues/3328
     * Description: Single up bond should be converted to custom query as: /
     * Reacting Center option should be ingored at custom query
     */
    const expectedValue = '/';
    await setBondType(page, 'Single Up-option');
    await setReactingCenter(page, 'Order changes-option');
    await page.getByTestId('custom-query-checkbox').check();
    const customQueryInput = page.getByTestId('bond-custom-query');
    await expect(customQueryInput).toHaveValue(expectedValue);
    await takeEditorScreenshot(page);
  });

  test('Converting Type = "Single down" to custom query', async ({ page }) => {
    /**
     * Test case: https://github.com/epam/ketcher/issues/3328
     * Description: Single down bond should be converted to custom query as: \
     */
    const expectedValue = '\\';
    await setBondType(page, 'Single Down-option');
    await page.getByTestId('custom-query-checkbox').check();
    const customQueryInput = page.getByTestId('bond-custom-query');
    await expect(customQueryInput).toHaveValue(expectedValue);
    await takeEditorScreenshot(page);
  });
});

test.describe('Checking saving attributes to .ket file', () => {
  test.beforeEach(async ({ page }) => {
    const numberOfBond = 2;
    await waitForPageInit(page);
    await drawStructure(page);
    await page.keyboard.press('Escape');
    await doubleClickOnBond(page, BondType.SINGLE, numberOfBond);
    await waitForBondPropsModal(page);
  });

  test('Save *.ket file with custom query for bond attribute', async ({
    page,
  }) => {
    /**
     * Test case: https://github.com/epam/ketcher/issues/3328
     * Description: In KET format customQuery should be saved into the bond object without other properties
     */
    await setBondType(page, 'Double-option');
    await setBondTopology(page, 'Ring-option');
    await page.getByTestId('custom-query-checkbox').check();
    await pressButton(page, 'Apply');

    const expectedFile = await getKet(page);
    await saveToFile(
      'KET/three-bond-structure-with-custom-query-to-compare.ket',
      expectedFile,
    );

    const { fileExpected: ketFileExpected, file: ketFile } =
      await receiveFileComparisonData({
        page,
        expectedFileName:
          'tests/test-data/KET/three-bond-structure-with-custom-query-to-compare.ket',
      });

    expect(ketFile).toEqual(ketFileExpected);
  });
});
