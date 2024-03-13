import { Page, test, expect } from '@playwright/test';
import {
  addSingleMonomerToCanvas,
  addRnaPresetOnCanvas,
  clickRedo,
  clickUndo,
  selectSingleBondTool,
  selectSnakeLayoutModeTool,
  takeEditorScreenshot,
  waitForPageInit,
  addBondedMonomersToCanvas,
  selectFlexLayoutModeTool,
  waitForRender,
  openFileAndAddToCanvas,
  dragMouseTo,
  openFileAndAddToCanvasAsNewProject,
} from '@utils';
import { turnOnMacromoleculesEditor } from '@utils/macromolecules';
import { bondTwoMonomers } from '@utils/macromolecules/polymerBond';
/* eslint-disable no-magic-numbers */

const MONOMER_NAME_TZA = 'Tza___3-thiazolylalanine';
const MONOMER_ALIAS_TZA = 'Tza';

async function createBondedMonomers(page: Page) {
  const MONOMER_NAME_DSEC = 'dSec___D-SelenoCysteine';
  const MONOMER_ALIAS_DSEC = 'dSec';
  const MONOMER_NAME_MEC = 'meC___N-Methyl-Cysteine';
  const MONOMER_ALIAS_MEC = 'meC';

  const peptide1 = await addSingleMonomerToCanvas(
    page,
    MONOMER_NAME_DSEC,
    MONOMER_ALIAS_DSEC,
    200,
    200,
    0,
  );

  const [peptide2, peptide3] = await addBondedMonomersToCanvas(
    page,
    MONOMER_NAME_TZA,
    MONOMER_ALIAS_TZA,
    100,
    100,
    50,
    50,
    2,
  );

  const peptide4 = await addSingleMonomerToCanvas(
    page,
    MONOMER_NAME_MEC,
    MONOMER_ALIAS_MEC,
    400,
    400,
    0,
  );

  await selectSingleBondTool(page);

  await bondTwoMonomers(page, peptide1, peptide2);
  await bondTwoMonomers(page, peptide3, peptide4);
}

test.describe('Snake Bond Tool', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPageInit(page);
    await turnOnMacromoleculesEditor(page);
  });

  test('Create snake bond between peptides', async ({ page }) => {
    /* 
    Test case: #3280 - Create snake bond 
    Description: Snake bond tool
    */

    await selectSnakeLayoutModeTool(page);
    const [, peptide2] = await addBondedMonomersToCanvas(
      page,
      MONOMER_NAME_TZA,
      MONOMER_ALIAS_TZA,
      300,
      300,
      100,
      100,
      2,
    );
    const peptide3 = await addSingleMonomerToCanvas(
      page,
      MONOMER_NAME_TZA,
      MONOMER_ALIAS_TZA,
      300,
      500,
      2,
    );
    const peptide4 = await addSingleMonomerToCanvas(
      page,
      MONOMER_NAME_TZA,
      MONOMER_ALIAS_TZA,
      200,
      200,
      3,
    );

    await selectSingleBondTool(page);

    await bondTwoMonomers(page, peptide2, peptide3);
    await bondTwoMonomers(page, peptide3, peptide4);

    await takeEditorScreenshot(page);
  });

  test('Check snake mode arrange for peptides chain', async ({ page }) => {
    /* 
    Test case: #3280 - Check snake mode
    Description: Snake bond tool
    */

    await addBondedMonomersToCanvas(
      page,
      MONOMER_NAME_TZA,
      MONOMER_ALIAS_TZA,
      100,
      100,
      25,
      25,
      18,
    );

    await selectSnakeLayoutModeTool(page);

    await takeEditorScreenshot(page);
  });

  test('Check finding right chain sequence using snake mode', async ({
    page,
  }) => {
    /*
    Test case: #3280 - Check finding right chain sequence using snake mode
    Description: Snake bond tool
    */
    await createBondedMonomers(page);
    await takeEditorScreenshot(page);
    await selectSnakeLayoutModeTool(page);
    await takeEditorScreenshot(page);
  });

  test('Mode returns back/forth after undo/redo', async ({ page }) => {
    const flexModeButton = page.getByTestId('flex-layout-mode');
    const snakeModeButton = page.getByTestId('snake-layout-mode');
    await createBondedMonomers(page);
    await expect(flexModeButton).toHaveClass(/active/);

    await selectSnakeLayoutModeTool(page);
    await expect(snakeModeButton).toHaveClass(/active/);

    await clickUndo(page);
    await waitForRender(page);
    await expect(snakeModeButton).not.toBeVisible();
    await expect(flexModeButton).toHaveClass(/active/);

    await clickRedo(page);
    await waitForRender(page);
    await expect(flexModeButton).not.toBeVisible();
    await expect(snakeModeButton).toHaveClass(/active/);
  });

  test('Create snake bond between RNA nucleotides', async ({ page }) => {
    await page.getByTestId('RNA-TAB').click();
    await selectSnakeLayoutModeTool(page);

    const { phosphate } = await addRnaPresetOnCanvas(
      page,
      'A_A_R_P',
      300,
      300,
      0,
      0,
    );
    const { sugar: sugar1, phosphate: phosphate1 } = await addRnaPresetOnCanvas(
      page,
      'C_C_R_P',
      400,
      600,
      1,
      1,
    );
    const { sugar: sugar2 } = await addRnaPresetOnCanvas(
      page,
      'G_G_R_P',
      600,
      400,
      2,
      2,
    );

    await selectSingleBondTool(page);

    await bondTwoMonomers(page, phosphate, sugar1);
    await bondTwoMonomers(page, phosphate1, sugar2);

    await takeEditorScreenshot(page);
  });

  test('Check snake mode arrange for RNA chain', async ({ page }) => {
    await page.getByTestId('RNA-TAB').click();

    const { phosphate } = await addRnaPresetOnCanvas(
      page,
      'A_A_R_P',
      300,
      300,
      0,
      0,
    );
    const { sugar: sugar1, phosphate: phosphate1 } = await addRnaPresetOnCanvas(
      page,
      'C_C_R_P',
      400,
      600,
      1,
      1,
    );
    const { sugar: sugar2, phosphate: phosphate2 } = await addRnaPresetOnCanvas(
      page,
      'G_G_R_P',
      600,
      400,
      2,
      2,
    );
    const { sugar: sugar3, phosphate: phosphate3 } = await addRnaPresetOnCanvas(
      page,
      'T_T_R_P',
      800,
      200,
      3,
      3,
    );
    const { sugar: sugar4, phosphate: phosphate4 } = await addRnaPresetOnCanvas(
      page,
      'T_T_R_P',
      100,
      100,
      4,
      4,
    );
    const { sugar: sugar5, phosphate: phosphate5 } = await addRnaPresetOnCanvas(
      page,
      'T_T_R_P',
      200,
      200,
      5,
      5,
    );
    const { sugar: sugar6, phosphate: phosphate6 } = await addRnaPresetOnCanvas(
      page,
      'T_T_R_P',
      300,
      200,
      6,
      6,
    );
    const { sugar: sugar7, phosphate: phosphate7 } = await addRnaPresetOnCanvas(
      page,
      'T_T_R_P',
      400,
      200,
      7,
      7,
    );
    const { sugar: sugar8, phosphate: phosphate8 } = await addRnaPresetOnCanvas(
      page,
      'T_T_R_P',
      500,
      200,
      8,
      8,
    );
    const { sugar: sugar9 } = await addRnaPresetOnCanvas(
      page,
      'T_T_R_P',
      600,
      200,
      9,
      9,
    );

    await selectSingleBondTool(page);

    await bondTwoMonomers(page, phosphate, sugar1);
    await bondTwoMonomers(page, phosphate1, sugar2);
    await bondTwoMonomers(page, phosphate2, sugar3);
    await bondTwoMonomers(page, phosphate3, sugar4);
    await bondTwoMonomers(page, phosphate4, sugar5);
    await bondTwoMonomers(page, phosphate5, sugar6);
    await bondTwoMonomers(page, phosphate6, sugar7);
    await bondTwoMonomers(page, phosphate7, sugar8);
    await bondTwoMonomers(page, phosphate8, sugar9);

    await selectSnakeLayoutModeTool(page);
    await takeEditorScreenshot(page);
  });

  test('Create snake bond for mix chains with nucleotides and peptides', async ({
    page,
  }) => {
    const [peptide1] = await addBondedMonomersToCanvas(
      page,
      MONOMER_NAME_TZA,
      MONOMER_ALIAS_TZA,
      500,
      500,
      100,
      100,
      3,
    );

    await addBondedMonomersToCanvas(
      page,
      'Bal___beta-Alanine',
      'Bal',
      700,
      500,
      50,
      50,
      4,
    );
    await page.getByTestId('RNA-TAB').click();

    const { phosphate } = await addRnaPresetOnCanvas(
      page,
      'A_A_R_P',
      200,
      200,
      0,
      0,
    );
    const { sugar: sugar1, phosphate: phosphate1 } = await addRnaPresetOnCanvas(
      page,
      'C_C_R_P',
      300,
      500,
      1,
      1,
    );
    const { sugar: sugar2, phosphate: phosphate2 } = await addRnaPresetOnCanvas(
      page,
      'G_G_R_P',
      400,
      300,
      2,
      2,
    );

    await selectSingleBondTool(page);

    await bondTwoMonomers(page, phosphate, sugar1);
    await bondTwoMonomers(page, phosphate1, sugar2);
    await bondTwoMonomers(page, phosphate2, peptide1, undefined, 'R1');

    await takeEditorScreenshot(page);

    await selectSnakeLayoutModeTool(page);
    await takeEditorScreenshot(page);

    await selectFlexLayoutModeTool(page);
    await takeEditorScreenshot(page);
  });

  test('Create snake bond for chain with nucleoside', async ({ page }) => {
    await page.getByTestId('RNA-TAB').click();
    await selectSnakeLayoutModeTool(page);

    const { phosphate } = await addRnaPresetOnCanvas(
      page,
      'A_A_R_P',
      200,
      200,
      0,
      0,
    );
    const { sugar } = await addRnaPresetOnCanvas(
      page,
      'G_G_R_P',
      700,
      300,
      1,
      1,
    );

    await page.getByTestId('summary-Sugars').click();
    const sugarOfNucleoside = await addSingleMonomerToCanvas(
      page,
      'R___Ribose',
      'R',
      500,
      500,
      2,
    );
    await page.getByTestId('summary-Bases').click();
    const baseOfNucleoside = await addSingleMonomerToCanvas(
      page,
      'A___Adenine',
      'A',
      600,
      600,
      1,
    );

    await selectSingleBondTool(page);
    await bondTwoMonomers(page, sugarOfNucleoside, baseOfNucleoside);
    await bondTwoMonomers(page, phosphate, sugarOfNucleoside);
    await bondTwoMonomers(page, sugarOfNucleoside, sugar);

    await takeEditorScreenshot(page);

    await selectFlexLayoutModeTool(page);
    await takeEditorScreenshot(page);

    await selectSnakeLayoutModeTool(page);
    await takeEditorScreenshot(page);
  });

  test('Create snake bond for chain with side chains', async ({ page }) => {
    await page.getByTestId('RNA-TAB').click();
    const { phosphate } = await addRnaPresetOnCanvas(
      page,
      'C_C_R_P',
      200,
      200,
      0,
      0,
    );
    const { sugar: sugar1, phosphate: phosphate1 } = await addRnaPresetOnCanvas(
      page,
      'G_G_R_P',
      500,
      300,
      1,
      1,
    );
    const { sugar: sugar2, phosphate: phosphate2 } = await addRnaPresetOnCanvas(
      page,
      'T_T_R_P',
      700,
      300,
      2,
      2,
    );
    await addRnaPresetOnCanvas(page, 'U_U_R_P', 900, 300, 3, 3);
    await page.getByTestId('summary-Sugars').click();
    const sugarOfNucleoside = await addSingleMonomerToCanvas(
      page,
      'R___Ribose',
      'R',
      350,
      350,
      4,
    );
    await page.getByTestId('summary-Bases').click();
    const baseOfNucleoside = await addSingleMonomerToCanvas(
      page,
      'nC6n8A___6-Aminohexyl-8-aminoadenine',
      'nC6n8A',
      350,
      500,
      0,
    );

    await page.getByTestId('PEPTIDES-TAB').click();
    const [peptide] = await addBondedMonomersToCanvas(
      page,
      'A___Alanine',
      'A',
      500,
      500,
      50,
      50,
      3,
    );

    const [hcyPeptide, hcyPeptide1] = await addBondedMonomersToCanvas(
      page,
      'Hcy___homocysteine',
      'Hcy',
      600,
      500,
      50,
      0,
      2,
    );

    const [balPeptide] = await addBondedMonomersToCanvas(
      page,
      'Bal___beta-Alanine',
      'Bal',
      700,
      700,
      50,
      0,
      2,
    );
    const balPeptide1 = await addSingleMonomerToCanvas(
      page,
      'Bal___beta-Alanine',
      'Bal',
      850,
      650,
      2,
    );

    await selectSingleBondTool(page);
    await bondTwoMonomers(page, sugarOfNucleoside, baseOfNucleoside);
    await bondTwoMonomers(page, baseOfNucleoside, peptide, 'R2', 'R1');

    await bondTwoMonomers(page, phosphate, sugarOfNucleoside);
    await bondTwoMonomers(page, sugarOfNucleoside, sugar1);
    await bondTwoMonomers(page, phosphate1, sugar2);
    await bondTwoMonomers(page, phosphate2, hcyPeptide, undefined, 'R1');
    await bondTwoMonomers(page, hcyPeptide1, balPeptide);
    await bondTwoMonomers(page, hcyPeptide1, balPeptide1, undefined, 'R1');
    await takeEditorScreenshot(page);

    await selectSnakeLayoutModeTool(page);
    await takeEditorScreenshot(page);
  });

  test('Create snake mode for single monomer and nucleoside', async ({
    page,
  }) => {
    await addSingleMonomerToCanvas(
      page,
      'Bal___beta-Alanine',
      'Bal',
      300,
      300,
      0,
    );
    await page.getByTestId('RNA-TAB').click();
    await page.getByTestId('summary-Sugars').click();
    const sugarOfNucleoside = await addSingleMonomerToCanvas(
      page,
      'R___Ribose',
      'R',
      500,
      500,
      0,
    );
    await page.getByTestId('summary-Bases').click();
    const baseOfNucleoside = await addSingleMonomerToCanvas(
      page,
      'A___Adenine',
      'A',
      600,
      600,
      0,
    );

    await selectSingleBondTool(page);
    await bondTwoMonomers(page, sugarOfNucleoside, baseOfNucleoside);

    await takeEditorScreenshot(page);

    await selectSnakeLayoutModeTool(page);
    await takeEditorScreenshot(page);
  });

  test('Check if monomers are located close to each other Snake bond become a straight line', async ({
    page,
  }) => {
    /* 
    Test case: Snake Mode
    Description: Monomers are located close to each other Snake bond become a straight line.
    */
    const x = 550;
    const y = 350;
    await selectSnakeLayoutModeTool(page);
    await openFileAndAddToCanvas(`KET/two-peptides-connected.ket`, page);
    await takeEditorScreenshot(page);
    await page.getByText('meE').locator('..').first().hover();
    await dragMouseTo(x, y, page);
    await takeEditorScreenshot(page);
  });

  test('Pressing "snake" layout button arrange nucleotides forming chain on screen in a snake-like pattern', async ({
    page,
  }) => {
    /* 
    Test case: Snake Mode
    Description: Pressing "snake" layout button arrange nucleotides forming chain on screen in a snake-like pattern.
    */
    await openFileAndAddToCanvasAsNewProject(
      `KET/peptides-flex-chain.ket`,
      page,
    );
    await takeEditorScreenshot(page);
    await selectSnakeLayoutModeTool(page);
    await takeEditorScreenshot(page);
  });

  test('Check if even very long chain fit into canvas (algorithm calculate the length of rows)', async ({
    page,
  }) => {
    /* 
    Test case: Snake Mode
    Description: Very long chain fit into canvas (algorithm calculate the length of rows).
    */
    await openFileAndAddToCanvasAsNewProject(
      `KET/long-peptide-chain.ket`,
      page,
    );
    await takeEditorScreenshot(page);
    await selectSnakeLayoutModeTool(page);
    await takeEditorScreenshot(page);
  });

  test('Check that switch to Flex mode on a snake chain change it into a chain with straight lines', async ({
    page,
  }) => {
    /* 
    Test case: Snake Mode
    Description: Check that switch to Flex mode on a snake chain change it into a chain with 
    straight lines press it again change it into curved lines.
    */
    await openFileAndAddToCanvasAsNewProject(
      `KET/long-peptide-chain.ket`,
      page,
    );
    await selectSnakeLayoutModeTool(page);
    await takeEditorScreenshot(page);
    await selectFlexLayoutModeTool(page);
    await takeEditorScreenshot(page);
    await selectSnakeLayoutModeTool(page);
    await takeEditorScreenshot(page);
  });

  test('Check move any peptide from middle of chain above main snake chain', async ({
    page,
  }) => {
    /* 
    Test case: Snake Mode
    Description: Peptide moved from middle of chain above and under main snake chain.
    The test is not functioning as expected. The monomer is separating from the bonds, 
    and it's unclear why. Manual verification on the bench shows it working. 
    Further investigation is needed.
    But in Flex mode it is work as expected(Look at next test for flex sequence)
    */
    const x = 450;
    const y = 150;
    const x2 = 100;
    const y2 = 100;
    await selectSnakeLayoutModeTool(page);
    await openFileAndAddToCanvasAsNewProject(
      `KET/peptides-flex-chain.ket`,
      page,
    );
    await takeEditorScreenshot(page);
    await page.getByText('DHis1B').locator('..').first().hover();
    await dragMouseTo(x, y, page);
    await page.mouse.click(x2, y2);
    await takeEditorScreenshot(page);
  });

  test('Check move any peptide from middle of chain above main flex chain', async ({
    page,
  }) => {
    /* 
    Test case: Snake Mode
    Description: Peptide moved from middle of chain above and under main snake chain.
    */
    const x = 450;
    const y = 150;
    const x2 = 100;
    const y2 = 100;
    await openFileAndAddToCanvasAsNewProject(
      `KET/peptides-flex-chain.ket`,
      page,
    );
    await takeEditorScreenshot(page);
    await page.getByText('DHis1B').locator('..').first().hover();
    await dragMouseTo(x, y, page);
    await page.mouse.click(x2, y2);
    await takeEditorScreenshot(page);
  });

  test('Bonds connecting through R3, R4, ... Rn attachment points remain straight lines', async ({
    page,
  }) => {
    /* 
    Test case: Snake Mode
    Description: Bonds connecting through R3, R4, ... Rn attachment points remain straight lines.
    */
    await openFileAndAddToCanvasAsNewProject(
      `KET/two-peptides-in-chain-connected-through-r3-r4.ket`,
      page,
    );
    await takeEditorScreenshot(page);
    await selectSnakeLayoutModeTool(page);
    await takeEditorScreenshot(page);
  });

  const testCases = [
    {
      filename: 'KET/rna-chain-connected-to-peptide-chain.ket',
      description:
        'Bonds connecting RNA monomers to monomers of different types (peptide monomers) remain straight.',
    },
    {
      filename: 'KET/rna-chain-connected-to-chem.ket',
      description:
        'Bonds connecting RNA monomers to monomers of different types (CHEM monomers) remain straight.',
    },
  ];

  for (const testCase of testCases) {
    test(testCase.description, async ({ page }) => {
      await openFileAndAddToCanvasAsNewProject(testCase.filename, page);
      await takeEditorScreenshot(page);
      await selectSnakeLayoutModeTool(page);
      await takeEditorScreenshot(page);
    });
  }
});
