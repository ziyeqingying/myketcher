import { test, expect } from '@playwright/test';
import {
  selectSingleBondTool,
  waitForPageInit,
  takePageScreenshot,
  addMonomerToCanvas,
} from '@utils';
import { turnOnMacromoleculesEditor } from '@utils/macromolecules';
import { bondTwoMonomers } from '@utils/macromolecules/polymerBond';
/* eslint-disable no-magic-numbers */

test.describe('Polymer Bond Tool', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPageInit(page);
    await turnOnMacromoleculesEditor(page);
  });

  test.afterEach(async ({ page }) => {
    await takePageScreenshot(page);
  });

  test.only('Create bond between two peptides', async ({ page }) => {
    /* 
    Test case: #2334 - Create peptide chain (HELM style) - Center-to-Center
    Description: Polymer bond tool
    */
    // Choose peptide
    await page.getByText('Tza').click();

    // Create 4 peptides on canvas
    await page.mouse.click(300, 300);
    await page.mouse.click(400, 400);
    await page.mouse.click(500, 500);
    await page.mouse.click(500, 200);

    // Get 4 peptides locators
    const peptides = await page.getByText('Tza').locator('..');
    const peptide1 = peptides.nth(0);
    const peptide2 = peptides.nth(1);
    const peptide3 = peptides.nth(2);
    const peptide4 = peptides.nth(3);

    // Select bond tool
    await selectSingleBondTool(page);

    await takePageScreenshot(page);

    // Create bonds between peptides, taking screenshots in middle states
    await peptide1.hover();
    await page.mouse.down();
    await peptide2.hover();
    await page.mouse.up();

    // Get rid of preview
    const coords = [100, 100];
    await page.mouse.move(coords[0], coords[1]);

    await takePageScreenshot(page);

    await peptide2.hover();
    await page.mouse.down();
    await peptide3.hover();
    await page.mouse.up();

    await peptide4.hover();
    await page.mouse.down();
    await peptide3.hover();
    await page.mouse.up();

    // Get rid of preview
    await page.mouse.move(coords[0], coords[1]);
  });

  test('Create bond between two chems', async ({ page }) => {
    /* 
    Test case: #2497 - Adding chems to canvas - Center-to-Center
    Description: Polymer bond tool
    */
    // Choose chems
    await page.getByText('CHEM').click();
    await page.getByTestId('hxy___Hexynyl alcohol').click();

    // Create 2 chems on canvas
    await page.mouse.click(300, 300);
    await page.mouse.click(400, 400);

    // Get 2 chems locators
    const chems = await page.getByText('hxy').locator('..');
    const chem1 = chems.nth(0);
    const chem2 = chems.nth(1);

    // Select bond tool
    await selectSingleBondTool(page);

    // Create bonds between chems, taking screenshots in middle states
    await chem1.hover();
    await page.mouse.down();
    await takePageScreenshot(page);
    await chem2.hover();
    await page.mouse.up();
  });
});

test.describe('Signle Bond Tool', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPageInit(page);
    await turnOnMacromoleculesEditor(page);
  });
  test('Select monomers and pass a bond', async ({ page }) => {
    /* 
      Test case: Macro: #3385 - Overlapping of bonds between 2 monomers
      https://github.com/epam/ketcher/issues/3385 
      Description: The system shall unable user to create more
      than 1 bond between the first and the second monomer
      */
    const MONOMER_NAME = 'Tza___3-thiazolylalanine';
    const MONOMER_ALIAS = 'Tza';
    const peptide1 = await addMonomerToCanvas(
      page,
      MONOMER_NAME,
      MONOMER_ALIAS,
      300,
      300,
      0,
    );
    const peptide2 = await addMonomerToCanvas(
      page,
      MONOMER_NAME,
      MONOMER_ALIAS,
      400,
      400,
      1,
    );
    await selectSingleBondTool(page);
    await bondTwoMonomers(page, peptide1, peptide2);
    await bondTwoMonomers(page, peptide2, peptide1);
    await page.waitForSelector('#error-tooltip');
    const errorTooltip = await page.getByTestId('error-tooltip').innerText();
    const errorMessage =
      "There can't be more than 1 bond between the first and the second monomer";
    expect(errorTooltip).toEqual(errorMessage);
  });
});
