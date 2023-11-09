import {
  turnOnMacromoleculesEditor,
  turnOnMicromoleculesEditor,
} from '@utils/macromolecules';
import { Page, test, expect } from '@playwright/test';
import {
  Bases,
  DropDown,
  Phosphates,
  Sugars,
  addMonomerToCenterOfCanvas,
  clickInTheMiddleOfTheScreen,
  dragMouseTo,
  moveMouseToTheMiddleOfTheScreen,
  openFileAndAddToCanvas,
  receiveFileComparisonData,
  saveToFile,
  selectEraseTool,
  selectMonomer,
  selectRectangleSelectionTool,
  selectSingleBondTool,
  takeEditorScreenshot,
  takeLeftToolbarMacromoleculeScreenshot,
  takeMonomerLibraryScreenshot,
  takePageScreenshot,
  takePresetsScreenshot,
  takeRNABuilderScreenshot,
  waitForPageInit,
  waitForRender,
} from '@utils';
import { getKet } from '@utils/formats';

async function drawThreeMonomers(page: Page) {
  const x = 800;
  const y = 350;
  const x1 = 650;
  const y1 = 150;
  await selectMonomer(DropDown.SugarsDropDown, Sugars.ThreeA6, page);
  await clickInTheMiddleOfTheScreen(page);
  await selectMonomer(DropDown.BasesDropDown, Bases.NBebnzylAdenine, page);
  await page.mouse.click(x, y);
  await selectMonomer(DropDown.PhosphatesDropDown, Phosphates.Phosphate, page);
  await page.mouse.click(x1, y1);
}

async function drawThreeMonomersConnectedWithBonds(page: Page) {
  const x = 800;
  const y = 350;
  const x1 = 650;
  const y1 = 150;
  const sugars = await page.getByText('3A6').locator('..');
  const sugar1 = sugars.nth(0);
  const bases = await page.getByText('baA').locator('..');
  const base1 = bases.nth(0);
  const phosphates = await page.getByText('P').locator('..');
  const phosphate1 = phosphates.nth(0);
  await selectMonomer(DropDown.SugarsDropDown, Sugars.ThreeA6, page);
  await clickInTheMiddleOfTheScreen(page);
  await selectMonomer(DropDown.BasesDropDown, Bases.NBebnzylAdenine, page);
  await page.mouse.click(x, y);
  await selectMonomer(DropDown.PhosphatesDropDown, Phosphates.Phosphate, page);
  await page.mouse.click(x1, y1);
  await selectSingleBondTool(page);
  await sugar1.hover();
  await page.mouse.down();
  await base1.hover();
  await page.mouse.up();
  await sugar1.hover();
  await page.mouse.down();
  await phosphate1.hover();
  await page.mouse.up();
}

async function drawBasePhosphate(page: Page) {
  const x = 800;
  const y = 350;
  const bases = await page.getByText('baA').locator('..');
  const base1 = bases.nth(0);
  const phosphates = await page.getByText('P').locator('..');
  const phosphate1 = phosphates.nth(0);
  await selectMonomer(DropDown.BasesDropDown, Bases.NBebnzylAdenine, page);
  await clickInTheMiddleOfTheScreen(page);
  await selectMonomer(DropDown.PhosphatesDropDown, Phosphates.Phosphate, page);
  await page.mouse.click(x, y);
  await selectSingleBondTool(page);
  await base1.hover();
  await page.mouse.down();
  await phosphate1.hover();
  await page.mouse.up();
}

async function drawSugarPhosphate(page: Page) {
  const x = 800;
  const y = 350;
  const sugars = await page.getByText('3A6').locator('..');
  const sugar1 = sugars.nth(0);
  const phosphates = await page.getByText('P').locator('..');
  const phosphate1 = phosphates.nth(0);
  await selectMonomer(DropDown.SugarsDropDown, Sugars.ThreeA6, page);
  await clickInTheMiddleOfTheScreen(page);
  await selectMonomer(DropDown.PhosphatesDropDown, Phosphates.Phosphate, page);
  await page.mouse.click(x, y);
  await selectSingleBondTool(page);
  await sugar1.hover();
  await page.mouse.down();
  await phosphate1.hover();
  await page.mouse.up();
}

async function drawSugarBase(page: Page) {
  const x = 800;
  const y = 350;
  const sugars = await page.getByText('3A6').locator('..');
  const sugar1 = sugars.nth(0);
  const bases = await page.getByText('baA').locator('..');
  const base1 = bases.nth(0);
  await selectMonomer(DropDown.SugarsDropDown, Sugars.ThreeA6, page);
  await clickInTheMiddleOfTheScreen(page);
  await selectMonomer(DropDown.BasesDropDown, Bases.NBebnzylAdenine, page);
  await page.mouse.click(x, y);
  await selectSingleBondTool(page);
  await sugar1.hover();
  await page.mouse.down();
  await base1.hover();
  await page.mouse.up();
}

async function pressEscapeWhenPullBond(page: Page) {
  const anyPointX = 300;
  const anyPointY = 500;
  await page.mouse.down();
  await page.mouse.move(anyPointX, anyPointY);
  await page.keyboard.press('Escape');
  await waitForRender(page, async () => {
    await page.mouse.up();
  });
}

test.describe('RNA Library', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPageInit(page);
    await turnOnMacromoleculesEditor(page);
  });

  test('Check that switch between Macro and Micro mode does not crash application', async ({
    page,
  }) => {
    /* 
    Test case: #3498
    Description: Application does not crash. 
    Test working incorrect because we have bug: https://github.com/epam/ketcher/issues/3498
    */
    await turnOnMicromoleculesEditor(page);
    await turnOnMacromoleculesEditor(page);
    await takePageScreenshot(page);
  });

  test('Check the RNA components panel', async ({ page }) => {
    /* 
    Test case: #2748, #2751 - RNA Builder. Accordion component
    Description: Check the RNA components panel. 
    RNA panel consist of:
    RNA Builder(expanded), Presets(5)(expanded), Sugars(199)(collapsed), 
    Bases(160)(collapsed), Phosphates(32)(collapsed)
    */
    await page.getByTestId('RNA-TAB').click();
    await takeMonomerLibraryScreenshot(page);
  });

  test('Collapse RNA Builder', async ({ page }) => {
    /* 
    Test case: #2748, #2751 - RNA Builder. Accordion component
    Description: After click on arrow RNA Builder collapsed.
    */
    await page.getByTestId('RNA-TAB').click();
    await page
      .locator('div')
      .filter({ hasText: /^RNA Builder$/ })
      .getByRole('button')
      .click();
    await takeMonomerLibraryScreenshot(page);
  });

  const testData = [
    {
      component: 'Presets',
      description:
        'After clicking on the arrow, the Presets component collapsed.',
    },
    {
      component: 'Sugars',
      description:
        'After clicking on the arrow, the Sugars component expanded.',
    },
    {
      component: 'Bases',
      description: 'After clicking on the arrow, the Bases component expanded.',
    },
    {
      component: 'Phosphates',
      description:
        'After clicking on the arrow, the Phosphates component expanded.',
    },
  ];

  for (const data of testData) {
    test(`Check ${data.component} component`, async ({ page }) => {
      /* 
      Test case: #2748, #2751 - RNA Builder. Accordion component
      */
      await page.getByTestId('RNA-TAB').click();
      await page.getByTestId(`summary-${data.component}`).click();
      await takeMonomerLibraryScreenshot(page);
    });
  }

  test('Add Sugar monomer to canvas', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: The selected sugar monomer should be added to the canvas 
    in the form of a square with rounded edges and in the corresponding color.
    */
    await addMonomerToCenterOfCanvas(
      DropDown.SugarsDropDown,
      Sugars.TwelveddR,
      page,
    );
    await takeEditorScreenshot(page);
  });

  test('Add Base monomer to canvas', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: The selected base monomer should be added to the canvas 
    in the form of a rhombus and in the corresponding color.
    */
    await addMonomerToCenterOfCanvas(
      DropDown.BasesDropDown,
      Bases.Adenine,
      page,
    );
    await takeEditorScreenshot(page);
  });

  test('Add Phosphate monomer to canvas', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: The selected phosphate monomer should be added to the canvas 
    in the form of a circle and in the corresponding color.
    */
    await addMonomerToCenterOfCanvas(
      DropDown.PhosphatesDropDown,
      Phosphates.Test6Ph,
      page,
    );
    await takeEditorScreenshot(page);
  });

  test('Sugar preview window when hovered on canvas', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: The selected sugar monomer should be added to the canvas 
    in the form of a square with rounded edges and in the corresponding color.
    When hover over monomer window with preview appears.
    */
    await addMonomerToCenterOfCanvas(
      DropDown.SugarsDropDown,
      Sugars.TwelveddR,
      page,
    );
    await page.getByText('12ddR').locator('..').first().hover();
    await takeEditorScreenshot(page);
  });

  test('Base preview window when hovered on canvas', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: The selected base monomer should be added to the canvas 
    in the form of a rhombus and in the corresponding color.
    When hover over monomer window with preview appears.
    */
    await addMonomerToCenterOfCanvas(
      DropDown.BasesDropDown,
      Bases.TClampOMe,
      page,
    );
    await page.getByText('clA').locator('..').first().hover();
    await takeEditorScreenshot(page);
  });

  test('Phosphate preview window when hovered on canvas', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: The selected phosphate monomer should be added to the canvas 
    in the form of a circle and in the corresponding color.
    When hover over monomer window with preview appears.
    */
    await addMonomerToCenterOfCanvas(
      DropDown.PhosphatesDropDown,
      Phosphates.Test6Ph,
      page,
    );
    await page.getByText('Test-6-Ph').locator('..').first().hover();
    await takeEditorScreenshot(page);
  });

  test('Add Custom preset to Presets section', async ({ page }) => {
    /* 
    Test case: #2759 - Edit RNA mode
    Description: Custom presets added to Presets section.
    */
    await selectMonomer(DropDown.SugarsDropDown, Sugars.TwelveddR, page);
    await selectMonomer(DropDown.BasesDropDown, Bases.Adenine, page);
    await selectMonomer(DropDown.PhosphatesDropDown, Phosphates.Test6Ph, page);
    await page.getByTestId('add-to-presets-btn').click();
    await page.getByTestId('12ddR(A)Test-6-Ph_A_12ddR_Test-6-Ph').click();
    await takePresetsScreenshot(page);
  });

  test('Add Custom preset to Canvas', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Custom presets added to Canvas.
    */
    await selectMonomer(DropDown.SugarsDropDown, Sugars.ThreeA6, page);
    await selectMonomer(DropDown.BasesDropDown, Bases.NBebnzylAdenine, page);
    await selectMonomer(
      DropDown.PhosphatesDropDown,
      Phosphates.Boranophosphate,
      page,
    );
    await page.getByTestId('add-to-presets-btn').click();
    await page.getByTestId('3A6(baA)bP_baA_3A6_bP').click();
    await clickInTheMiddleOfTheScreen(page);
    await selectRectangleSelectionTool(page);
    await takeEditorScreenshot(page);
  });

  test('Add to presets (different combinations: Sugar+Base', async ({
    page,
  }) => {
    /*
    Test case: #2759 - Edit RNA mode
    Description: Custom presets added to Presets section.
    */
    await selectMonomer(DropDown.SugarsDropDown, Sugars.TwelveddR, page);
    await selectMonomer(DropDown.BasesDropDown, Bases.Adenine, page);
    await page.getByTestId('add-to-presets-btn').click();
    await page.getByTestId('12ddR(A)_A_12ddR_.').click();
    await clickInTheMiddleOfTheScreen(page);
    await takePresetsScreenshot(page);
  });

  test('Add to presets (different combinations: Sugar+Phosphate', async ({
    page,
  }) => {
    /*
    Test case: #2759 - Edit RNA mode
    Description: Custom presets added to Presets section.
    */
    await selectMonomer(DropDown.SugarsDropDown, Sugars.TwelveddR, page);
    await selectMonomer(
      DropDown.PhosphatesDropDown,
      Phosphates.Boranophosphate,
      page,
    );
    await page.getByTestId('add-to-presets-btn').click();
    await page.getByTestId('12ddR()bP_._12ddR_bP').click();
    await takePresetsScreenshot(page);
  });

  test('Add to presets (different combinations: Base+Phosphate', async ({
    page,
  }) => {
    /*
    Test case: #2759 - Edit RNA mode
    Description: Custom presets added to Presets section.
    */
    await selectMonomer(DropDown.BasesDropDown, Bases.Adenine, page);
    await selectMonomer(
      DropDown.PhosphatesDropDown,
      Phosphates.Boranophosphate,
      page,
    );
    await page.getByTestId('add-to-presets-btn').click();
    await page.getByTestId('(A)bP_A_._bP').click();
    await takePresetsScreenshot(page);
  });

  test('Add Custom preset to Presets section and Edit', async ({ page }) => {
    /* 
    Test case: #2759 - Edit RNA mode
    Description: Custom presets added to Presets section and can be edited.
    */
    await selectMonomer(DropDown.SugarsDropDown, Sugars.TwelveddR, page);
    await selectMonomer(DropDown.BasesDropDown, Bases.Adenine, page);
    await selectMonomer(DropDown.PhosphatesDropDown, Phosphates.Test6Ph, page);
    await page.getByTestId('add-to-presets-btn').click();
    await page.getByTestId('12ddR(A)Test-6-Ph_A_12ddR_Test-6-Ph').click({
      button: 'right',
    });
    await page.getByTestId('edit').locator('div').click();
    await page.getByTestId('rna-builder-slot--base').click();
    await page.getByTestId('baA___N-benzyl-adenine').click();
    await page.getByTestId('save-btn').click();
    await page.getByTestId('12ddR(baA)Test-6-Ph_baA_12ddR_Test-6-Ph').click();
    await clickInTheMiddleOfTheScreen(page);
    await takePresetsScreenshot(page);
  });

  test('Add Custom preset to Presets section then Duplicate and Edit', async ({
    page,
  }) => {
    /* 
    Test case: #2759 - Edit RNA mode
    Description: Custom presets added to Presets section then can be duplicated and edited.
    */
    await selectMonomer(DropDown.SugarsDropDown, Sugars.TwelveddR, page);
    await selectMonomer(DropDown.BasesDropDown, Bases.Adenine, page);
    await selectMonomer(DropDown.PhosphatesDropDown, Phosphates.Test6Ph, page);
    await page.getByTestId('add-to-presets-btn').click();
    await page.getByTestId('12ddR(A)Test-6-Ph_A_12ddR_Test-6-Ph').click({
      button: 'right',
    });
    await page.getByTestId('duplicateandedit').locator('div').click();
    await page.getByTestId('12ddR(A)Test-6-Ph_Copy_A_12ddR_Test-6-Ph').click({
      button: 'right',
    });
    await page.getByTestId('edit').locator('div').click();
    await page.getByTestId('rna-builder-slot--phosphate').click();
    await page.getByTestId('P___Phosphate').click();
    await page.getByTestId('save-btn').click();
    await page.getByTestId('12ddR(A)P_A_12ddR_P').click();
    await clickInTheMiddleOfTheScreen(page);
    await takePresetsScreenshot(page);
  });

  test('Add Custom preset to Presets section and Delete', async ({ page }) => {
    /* 
    Test case: #2759 - Edit RNA mode
    Description: Custom presets added to Presets section and can be deleted.
    */
    await selectMonomer(DropDown.SugarsDropDown, Sugars.TwelveddR, page);
    await selectMonomer(DropDown.BasesDropDown, Bases.Adenine, page);
    await selectMonomer(DropDown.PhosphatesDropDown, Phosphates.Test6Ph, page);
    await page.getByTestId('add-to-presets-btn').click();
    await page.getByTestId('12ddR(A)Test-6-Ph_A_12ddR_Test-6-Ph').click({
      button: 'right',
    });
    await page.getByTestId('deletepreset').locator('div').click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await takePresetsScreenshot(page);
  });

  test('Add Custom preset to Presets section and Rename', async ({ page }) => {
    /* 
    Test case: #2759 - Edit RNA mode
    Description: Custom presets added to Presets section and can be renamed.
    */
    await selectMonomer(DropDown.SugarsDropDown, Sugars.TwentyFiveR, page);
    await selectMonomer(DropDown.BasesDropDown, Bases.NBebnzylAdenine, page);
    await selectMonomer(
      DropDown.PhosphatesDropDown,
      Phosphates.Boranophosphate,
      page,
    );
    await page.getByTestId('add-to-presets-btn').click();
    await page.getByTestId('25R(baA)bP_baA_25R_bP').click({
      button: 'right',
    });
    await page.getByTestId('edit').locator('div').click();
    await page.getByPlaceholder('Name your structure').click();
    await page.getByPlaceholder('Name your structure').fill('TestMonomers');
    await page.getByTestId('save-btn').click();
    await takePresetsScreenshot(page);
  });

  test('Autofilling RNA name when selects RNA parts', async ({ page }) => {
    /* 
    Test case: #2759 - Edit RNA mode
    Description: RNA name autofilling when selects RNA parts.
    */
    await page.getByTestId('RNA-TAB').click();
    await page.getByTestId('rna-builder-slot--sugar').click();
    await page.getByTestId("3A6___6-amino-hexanol (3' end)").click();
    await page.getByTestId('rna-builder-slot--base').click();
    await page.getByTestId('baA___N-benzyl-adenine').click();
    await page.getByTestId('rna-builder-slot--phosphate').click();
    await page.getByTestId('bP___Boranophosphate').click();
    await clickInTheMiddleOfTheScreen(page);
    await takeRNABuilderScreenshot(page);
  });

  test('Add names to RNA manually', async ({ page }) => {
    /* 
    Test case: #2759 - Edit RNA mode
    Description: RNA name added.
    */
    await page.getByTestId('RNA-TAB').click();
    await page.getByTestId('rna-builder-slot--sugar').click();
    await page.getByTestId('25R___2,5-Ribose').click();
    await page.getByTestId('rna-builder-slot--base').click();
    await page.getByTestId('A___Adenine').click();
    await page.getByTestId('rna-builder-slot--phosphate').click();
    await page.getByTestId('Test-6-Ph___Test-6-AP-Phosphate').click();
    await page.getByPlaceholder('Name your structure').click();
    await page.getByPlaceholder('Name your structure').fill('cTest');
    await page.getByTestId('add-to-presets-btn').click();
    await clickInTheMiddleOfTheScreen(page);
    await takeRNABuilderScreenshot(page);
  });

  test('Highlight Sugar, Phosphate and Base in Library, once it chosen in RNA Builder', async ({
    page,
  }) => {
    /* 
    Test case: #2759 - Edit RNA mode
    Description: Sugar, Phosphate and Base highlighted in Library.
    Test is not working properly. Need fix bug https://github.com/epam/ketcher/issues/3489
    */
    const monomers = [
      { type: 'sugar', name: "3A6___6-amino-hexanol (3' end)" },
      { type: 'base', name: 'baA___N-benzyl-adenine' },
      { type: 'phosphate', name: 'bP___Boranophosphate' },
    ];

    for (const monomer of monomers) {
      await page.getByTestId('RNA-TAB').click();
      await page.getByTestId(`rna-builder-slot--${monomer.type}`).click();
      await page.getByTestId(monomer.name).click();
      await clickInTheMiddleOfTheScreen(page);
      await takeMonomerLibraryScreenshot(page);
    }
  });

  test('Add Sugar-Base Combination to Canvas', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Sugar-Base Combination added to Canvas.
    */
    await selectMonomer(DropDown.SugarsDropDown, Sugars.ThreeA6, page);
    await selectMonomer(DropDown.BasesDropDown, Bases.NBebnzylAdenine, page);
    await page.getByTestId('add-to-presets-btn').click();
    await page.getByTestId('3A6(baA)_baA_3A6_.').click();
    await clickInTheMiddleOfTheScreen(page);
    await selectRectangleSelectionTool(page);
    await takeEditorScreenshot(page);
  });

  test('Add Sugar-Phosphate Combination to Canvas', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Sugar-Phosphate Combination added to Canvas.
    */
    await selectMonomer(DropDown.SugarsDropDown, Sugars.ThreeA6, page);
    await selectMonomer(
      DropDown.PhosphatesDropDown,
      Phosphates.Boranophosphate,
      page,
    );
    await page.getByTestId('add-to-presets-btn').click();
    await page.getByTestId('3A6()bP_._3A6_bP').click();
    await clickInTheMiddleOfTheScreen(page);
    await selectRectangleSelectionTool(page);
    await takeEditorScreenshot(page);
  });

  test('Can not Add Base-Phosphate Combination to Canvas', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Base-Phosphate Combination not added to Canvas.
    */
    await selectMonomer(DropDown.BasesDropDown, Bases.NBebnzylAdenine, page);
    await selectMonomer(
      DropDown.PhosphatesDropDown,
      Phosphates.Boranophosphate,
      page,
    );
    await page.getByTestId('add-to-presets-btn').click();
    await page.getByTestId('(baA)bP_baA_._bP').click();
    await moveMouseToTheMiddleOfTheScreen(page);
    await takeEditorScreenshot(page);
  });

  test('Add Sugar and Base Combination to Canvas and connect with bond', async ({
    page,
  }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Sugar and Base Combination added to Canvas and connect with bond.
    */
    const bondLine = await page.locator('g[pointer-events="stroke"]');
    await drawSugarBase(page);
    await bondLine.hover();
    await takeEditorScreenshot(page);
  });

  test('Add Sugar and Phosphate Combination to Canvas and connect with bond', async ({
    page,
  }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Sugar and Phosphate Combination added to Canvas and connect with bond.
    */
    const bondLine = await page.locator('g[pointer-events="stroke"]');
    await drawSugarPhosphate(page);
    await bondLine.hover();
    await takeEditorScreenshot(page);
  });

  test('Add Base and Phosphate Combination to Canvas and connect with bond', async ({
    page,
  }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Base and Phosphate Combination added to Canvas and connect with bond.
    */
    const bondLine = await page.locator('g[pointer-events="stroke"]');
    await drawBasePhosphate(page);
    await bondLine.hover();
    await takeEditorScreenshot(page);
  });

  test('Add Sugar-Base-Phosphate Combination to Canvas and connect with bond', async ({
    page,
  }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Sugar-Base-Phosphate Combination added to Canvas and connect with bond.
    */
    const bondLine = await page.locator('g[pointer-events="stroke"]').first();
    await drawThreeMonomersConnectedWithBonds(page);
    await bondLine.hover();
    await takeEditorScreenshot(page);
  });

  test('Open file from .ket and Delete Sugar monomer', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Sugar monomer deleted.
    */
    await openFileAndAddToCanvas('KET/monomers-connected-with-bonds.ket', page);
    await selectEraseTool(page);
    await page.getByText('12ddR').locator('..').click();
    await takeEditorScreenshot(page);
  });

  test('Open file from .ket and Delete Base monomer', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Base monomer deleted.
    */
    await openFileAndAddToCanvas('KET/monomers-connected-with-bonds.ket', page);
    await selectEraseTool(page);
    await page.getByText('baA').locator('..').click();
    await takeEditorScreenshot(page);
  });

  test('Open file from .ket and Delete Phosphate monomer', async ({ page }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Phosphate monomer deleted.
    */
    await openFileAndAddToCanvas('KET/monomers-connected-with-bonds.ket', page);
    await selectEraseTool(page);
    await page.getByText('P').locator('..').first().click();
    await takeEditorScreenshot(page);
  });

  test('Draw Sugar-Base-Phosphate and Delete Sugar monomer', async ({
    page,
  }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Sugar monomer deleted.
    */
    await drawThreeMonomersConnectedWithBonds(page);
    await selectEraseTool(page);
    await page.getByText('3A6').locator('..').first().click();
    await takeEditorScreenshot(page);
  });

  test('Draw Sugar-Base-Phosphate and Delete Base monomer', async ({
    page,
  }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Base monomer deleted.
    */
    await drawThreeMonomersConnectedWithBonds(page);
    await selectEraseTool(page);
    await page.getByText('baA').locator('..').first().click();
    await takeEditorScreenshot(page);
  });

  test('Draw Sugar-Base-Phosphate and Delete Phosphate monomer', async ({
    page,
  }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Phosphate monomer deleted.
    */
    await drawThreeMonomersConnectedWithBonds(page);
    await selectEraseTool(page);
    await page.getByText('P').locator('..').first().click();
    await takeEditorScreenshot(page);
  });

  test('Draw Sugar-Base-Phosphate and Delete connecting bond', async ({
    page,
  }) => {
    /* 
    Test case: Bond tool
    Description: Bond deleted.
    */
    const bondLine = await page.locator('g[pointer-events="stroke"]').first();
    await drawThreeMonomersConnectedWithBonds(page);
    await selectEraseTool(page);
    await bondLine.click();
    await takeEditorScreenshot(page);
  });

  test('Draw Sugar-Base-Phosphate and try to attach bond to occupied attachment point', async ({
    page,
  }) => {
    /* 
    Test case: Bond tool
    Description: A message appears at the bottom of the canvas: 
    Monomers don't have any connection point available.
    */
    const sugars = await page.getByText('3A6').locator('..');
    const sugar1 = sugars.nth(0);
    const bases = await page.getByText('baA').locator('..');
    const base1 = bases.nth(0);
    const phosphates = await page.getByText('P').locator('..');
    const phosphate1 = phosphates.nth(0);
    await drawThreeMonomers(page);
    await selectSingleBondTool(page);
    await sugar1.hover();
    await page.mouse.down();
    await base1.hover();
    await page.mouse.up();
    await phosphate1.hover();
    await page.mouse.down();
    await base1.hover();
    await page.mouse.up();
    await takeEditorScreenshot(page);
  });

  const molecules = [
    { type: 'Sugars', description: '25R___2,5-Ribose' },
    { type: 'Bases', description: 'baA___N-benzyl-adenine' },
    { type: 'Phosphates', description: 'bP___Boranophosphate' },
  ];

  for (const molecule of molecules) {
    test(`Move ${molecule.type} on canvas to new position`, async ({
      page,
    }) => {
      /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Sugar/Base/Phosphate moved to new position.
    */
      const anyPointX = 300;
      const anyPointY = 500;
      await page.getByTestId('RNA-TAB').click();
      await page.getByTestId(`summary-${molecule.type}`).click();
      await page.getByTestId(molecule.description).click();
      await clickInTheMiddleOfTheScreen(page);
      await selectRectangleSelectionTool(page);
      await clickInTheMiddleOfTheScreen(page);
      await dragMouseTo(anyPointX, anyPointY, page);
      await takeEditorScreenshot(page);
    });
  }

  const monomersToMove = ['3A6', 'baA', 'P'];

  for (const monomer of monomersToMove) {
    test(`Draw Sugar-Base-Phosphate and Move ${monomer} monomer`, async ({
      page,
    }) => {
      /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Sugar/Base/Phosphate monomer moved to new position. 
    Bonds are connected to monomers. 
    */
      const anyPointX = 300;
      const anyPointY = 500;
      await drawThreeMonomersConnectedWithBonds(page);
      await selectRectangleSelectionTool(page);
      await page.getByText(monomer).locator('..').first().click();
      await dragMouseTo(anyPointX, anyPointY, page);
      await takeEditorScreenshot(page);
    });
  }

  test('Press "Escape" button while pull the bond from monomer', async ({
    page,
  }) => {
    /* 
    Test case: #2507 - Add RNA monomers to canvas
    Description: Bond does not remain on the canvas and returns to original position.
    Test working incorrect now because we have bug https://github.com/epam/ketcher/issues/3539
    */
    await addMonomerToCenterOfCanvas(
      DropDown.SugarsDropDown,
      Sugars.TwentyFiveR,
      page,
    );
    await selectSingleBondTool(page);
    await page.getByText('25R').locator('..').first().click();
    await pressEscapeWhenPullBond(page);
    await takeEditorScreenshot(page);
  });

  test('Check presence of Clear canvas button in left menu', async ({
    page,
  }) => {
    /* 
    Test case: Clear Canvas tool
    Description: Clear canvas button presence in left menu
    */
    await takeLeftToolbarMacromoleculeScreenshot(page);
  });

  test('Draw Sugar-Base-Phosphate and press Clear canvas', async ({ page }) => {
    /* 
    Test case: Clear Canvas tool
    Description: Canvas is cleared
    */
    await drawThreeMonomersConnectedWithBonds(page);
    await page.getByTestId('clear-canvas-button').click();
    await takeEditorScreenshot(page);
  });

  test('Open Sugar-Base-Phosphate from .ket file and press Clear canvas', async ({
    page,
  }) => {
    /* 
    Test case: Clear Canvas tool
    Description: Canvas is cleared
    */
    await openFileAndAddToCanvas('KET/monomers-connected-with-bonds.ket', page);
    await page.getByTestId('clear-canvas-button').click();
    await takeEditorScreenshot(page);
  });

  test('Save file with three Monomers as .ket file', async ({ page }) => {
    /* 
    Test case: Open&save files
    Description: File saved with three Monomers as .ket file
    Test working as not expected. API getKet returns an incorrect ket.
    */
    await openFileAndAddToCanvas('KET/monomers-connected-with-bonds.ket', page);
    const expectedFile = await getKet(page);
    await saveToFile(
      'KET/monomers-connected-with-bonds-expected.ket',
      expectedFile,
    );

    const { fileExpected: ketFileExpected, file: ketFile } =
      await receiveFileComparisonData({
        page,
        expectedFileName:
          'tests/test-data/KET/monomers-connected-with-bonds-expected.ket',
      });
    expect(ketFile).toEqual(ketFileExpected);
  });

  test('Open Sugar-Base-Phosphate from .ket file and switch to Micromolecule mode', async ({
    page,
  }) => {
    /* 
    Test case: https://github.com/epam/ketcher/issues/3498
    Description: Ketcher switch to Micromolecule mode
    Test is not working properly because we have bug.
    */
    await openFileAndAddToCanvas('KET/monomers-connected-with-bonds.ket', page);
    await turnOnMicromoleculesEditor(page);
    await takePageScreenshot(page);
  });
});
