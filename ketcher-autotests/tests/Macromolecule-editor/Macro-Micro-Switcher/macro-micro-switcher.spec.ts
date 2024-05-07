/* eslint-disable no-magic-numbers */
import {
  turnOnMacromoleculesEditor,
  turnOnMicromoleculesEditor,
} from '@utils/macromolecules';
import { Page, test } from '@playwright/test';
import {
  FILE_TEST_DATA,
  TopPanelButton,
  clickInTheMiddleOfTheScreen,
  dragMouseTo,
  openFileAndAddToCanvas,
  openFileAndAddToCanvasMacro,
  pressButton,
  selectTopPanelButton,
  takeEditorScreenshot,
  takeMonomerLibraryScreenshot,
  takePageScreenshot,
  waitForLoad,
  waitForPageInit,
  waitForRender,
  moveMouseToTheMiddleOfTheScreen,
  selectOptionInDropdown,
  waitForSpinnerFinishedWork,
  selectRing,
  RingButton,
} from '@utils';

const topLeftCorner = {
  x: -325,
  y: -235,
};

async function zoomWithMouseWheel(page: Page, scrollValue: number) {
  await waitForRender(page, async () => {
    await page.keyboard.down('Control');
    await page.mouse.wheel(0, scrollValue);
    await page.keyboard.up('Control');
  });
}

async function scrollHorizontally(page: Page, scrollValue: number) {
  await waitForRender(page, async () => {
    await page.mouse.wheel(scrollValue, 0);
  });
}

async function pasteFromClipboard(
  page: Page,
  fileFormats: string,
  filename = '.ket',
) {
  await selectTopPanelButton(TopPanelButton.Open, page);
  await page.getByText('Paste from clipboard').click();
  await page.getByRole('dialog').getByRole('textbox').fill(fileFormats);
  await selectOptionInDropdown(filename, page);

  await waitForLoad(page, async () => {
    await pressButton(page, 'Add to Canvas');
  });
}

async function addToFavoritesMonomers(page: Page) {
  await page.getByTestId('Bal___beta-Alanine').getByText('★').click();
  await page
    .getByTestId('Phe4Me___p-Methylphenylalanine')
    .getByText('★')
    .click();
  await page.getByTestId('meM___N-Methyl-Methionine').getByText('★').click();
  await page.getByTestId('RNA-TAB').click();
  await page.getByTestId('summary-Sugars').click();
  await page.getByTestId('25R___2,5-Ribose').getByText('★').click();
  await page.getByTestId('summary-Bases').click();
  await page.getByTestId('baA___N-benzyl-adenine').getByText('★').click();
  await page.getByTestId('summary-Phosphates').click();
  await page.getByTestId('bP___Boranophosphate').getByText('★').click();
  await page.getByTestId('CHEM-TAB').click();
  await page.getByTestId('Test-6-Ch___Test-6-AP-Chem').getByText('★').click();
}

test.describe('Macro-Micro-Switcher', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPageInit(page);
    await turnOnMacromoleculesEditor(page);
  });

  test('Check that preview window of macro structure does not change in micro mode ', async ({
    page,
  }) => {
    /* 
    Test case: https://github.com/epam/ketcher/issues/3603
    Description: Preview window of macro structure doesn't change in micro mode
    Test working incorrect now because we have bug https://github.com/epam/ketcher/issues/3603
    */
    const scrollValue = -400;
    const moleculeLabels = ['A', '25R', 'baA', 'Test-6-Ph', 'Test-6-Ch'];
    await openFileAndAddToCanvasMacro('KET/five-monomers.ket', page);
    await turnOnMicromoleculesEditor(page);
    await scrollHorizontally(page, scrollValue);
    for (const label of moleculeLabels) {
      await waitForRender(page, async () => {
        await page.getByText(label, { exact: true }).hover();
      });
      await takeEditorScreenshot(page);
    }
  });

  test('Check that macromolecule structures in micromode are represented as S-Groups with bonds', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Macromolecule structures in micromode are represented as S-Groups with bonds
    */
    await openFileAndAddToCanvasMacro(
      'KET/three-monomers-connected-with-bonds.ket',
      page,
    );
    await turnOnMicromoleculesEditor(page);
    await page.getByText('Edc').hover();
    await takeEditorScreenshot(page);
  });

  test('Micromolecules in macromode will be represented as CHEMs with generated name(F1, F2, ...Fn)', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Micromolecules in macromode represented as CHEMs with generated name(F1, F2, ...Fn)
    */
    await turnOnMicromoleculesEditor(page);
    await openFileAndAddToCanvas(
      'KET/eight-micromolecules.ket',
      page,
      topLeftCorner.x,
      topLeftCorner.y,
    );
    await turnOnMacromoleculesEditor(page);
    await takeEditorScreenshot(page);
  });

  test('Check that After hiding Library in Macro mode possible to see Show Library button', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: After hiding Library in Macro mode 'Show Library' button is visible.
    */
    await page.getByText('Hide').click();
    await takePageScreenshot(page);
    await page.getByText('Show Library').click();
    await page.getByText('Show Library').isVisible();
  });

  test('Check that the Mol-structure opened from the file in Macro mode is visible on Micro mode', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Mol-structure opened from the file in Macro mode is visible on Micro mode
    */
    await openFileAndAddToCanvasMacro('Molfiles-V2000/glutamine.mol', page);
    await turnOnMicromoleculesEditor(page);
    await takeEditorScreenshot(page);
  });

  test('Check that the Ket-structure opened from the file in Macro mode is visible in Micro mode', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Mol-structure opened from the file in Macro mode is visible on Micro mode when
    */
    await openFileAndAddToCanvasMacro('KET/stereo-and-structure.ket', page);
    await turnOnMicromoleculesEditor(page);
    await takeEditorScreenshot(page);
  });

  test('Create a sequence of monomers in macro mode then switch to micro mode select the entire structure and move it to a new position', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Sequence of monomers moved to a new position in Micro mode
    Now test working not properly because we have bug https://github.com/epam/ketcher/issues/3654
    */
    const x = 400;
    const y = 400;
    await openFileAndAddToCanvasMacro(
      'KET/three-monomers-connected-with-bonds.ket',
      page,
    );
    await turnOnMicromoleculesEditor(page);
    await page.keyboard.press('Control+a');
    await page.getByText('Edc').hover();
    await dragMouseTo(x, y, page);
    await takeEditorScreenshot(page);
  });

  test('Add monomers in macro mode then switch to micro mode and check that it can not be expanded and abreviation can not be removed', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Abbreviation of monomer expanded without errors.
    Now test working not properly because we have bug https://github.com/epam/ketcher/issues/3659
    */
    await openFileAndAddToCanvasMacro(
      'KET/three-monomers-connected-with-bonds.ket',
      page,
    );
    await turnOnMicromoleculesEditor(page);
    await page.getByText('A6OH').click({ button: 'right' });
    await takeEditorScreenshot(page);
  });

  test('Add monomers in macro mode then switch to micro mode and check that it can not be moved', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Sequence of monomers moved to a new position in Micro mode
    Now test working not properly because we have bug https://github.com/epam/ketcher/issues/3658
    */
    const x1 = 400;
    const y1 = 400;
    const x2 = 500;
    const y2 = 500;
    await openFileAndAddToCanvasMacro(
      'KET/three-monomers-not-connected-with-bonds.ket',
      page,
    );
    await turnOnMicromoleculesEditor(page);
    await page.getByText('Edc').hover();
    await dragMouseTo(x1, y1, page);
    await page.getByText('Edc').hover();
    await dragMouseTo(x2, y2, page);
    await takeEditorScreenshot(page);
  });

  test('Check that Zoom In/Zoom Out/ Reset Zoom Tools work (UI Buttons) after switching to Macro mode', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Zoom In/Zoom Out/ Reset Zoom Tools work after switching to Macro mode
    */
    const numberOfPressZoomIn = 5;
    const numberOfPressZoomOut = 8;
    await openFileAndAddToCanvasMacro(
      'KET/three-monomers-connected-with-bonds.ket',
      page,
    );
    await turnOnMicromoleculesEditor(page);
    await turnOnMacromoleculesEditor(page);
    for (let i = 0; i < numberOfPressZoomIn; i++) {
      await waitForRender(page, async () => {
        await page.getByTestId('zoom-in-button').click();
      });
    }

    await takeEditorScreenshot(page);

    for (let i = 0; i < numberOfPressZoomOut; i++) {
      await waitForRender(page, async () => {
        await page.getByTestId('zoom-out-button').click();
      });
    }
    await takeEditorScreenshot(page);
    await page.getByTestId('reset-zoom-button').click();
    await takeEditorScreenshot(page);
  });

  test('Check that Zoom In/Zoom Out/ Reset Zoom Tools work (Mouse scroll) after switching to Macro mode', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Zoom In/Zoom Out/ Reset Zoom Tools work after switching to Macro mode
    */
    await openFileAndAddToCanvasMacro(
      'KET/three-monomers-connected-with-bonds.ket',
      page,
    );
    await turnOnMicromoleculesEditor(page);
    await turnOnMacromoleculesEditor(page);
    await moveMouseToTheMiddleOfTheScreen(page);
    await zoomWithMouseWheel(page, -400);

    await takeEditorScreenshot(page);

    await zoomWithMouseWheel(page, 250);

    await takeEditorScreenshot(page);
    await page.getByTestId('reset-zoom-button').click();
    await takeEditorScreenshot(page);
  });

  test('Check that the zoomed in/out structure from Macro mode become standart 100% when switch to Micro mode and again to Macro mode', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Zoomed In/Out structure from Macro mode become standart 100% when switch to Micro mode and again to Macro mode
    */
    const numberOfPressZoomIn = 5;
    await openFileAndAddToCanvasMacro(
      'KET/three-monomers-connected-with-bonds.ket',
      page,
    );
    for (let i = 0; i < numberOfPressZoomIn; i++) {
      await waitForRender(page, async () => {
        await page.getByTestId('zoom-in-button').click();
      });
    }
    await turnOnMicromoleculesEditor(page);
    await takeEditorScreenshot(page);

    await zoomWithMouseWheel(page, 250);

    await turnOnMacromoleculesEditor(page);
    await takeEditorScreenshot(page);
  });

  test('Add to Favorites section Peptides, Sugars, Bases, Phosphates and CHEMs then switch to Micro mode and back', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Added to Favorites section Peptides, Sugars, Bases, Phosphates and CHEMs 
    when switching from Macro mode to Micro mode and back to Macro is saved
    */
    await addToFavoritesMonomers(page);
    await page.getByTestId('FAVORITES-TAB').click();
    await turnOnMicromoleculesEditor(page);
    await turnOnMacromoleculesEditor(page);
    await takeMonomerLibraryScreenshot(page);
  });

  test('Add to Favorites section Peptides, Sugars, Bases, Phosphates and CHEMs then Hide Library and switch to Micro mode and back', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Added to Favorites section Peptides, Sugars, Bases, Phosphates and CHEMs 
    when Hide Library and switching from Macro mode to Micro mode and back to Macro is saved
    */
    await addToFavoritesMonomers(page);
    await page.getByText('Hide').click();
    await turnOnMicromoleculesEditor(page);
    await turnOnMacromoleculesEditor(page);
    await page.getByTestId('FAVORITES-TAB').click();
    await takeMonomerLibraryScreenshot(page);
  });

  test('Check that the Ket-structure pasted from the clipboard in Macro mode  is visible in Micro mode.', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Ket-structure pasted from the clipboard in Macro mode is visible in Micro mode
    */
    await pasteFromClipboard(
      page,
      FILE_TEST_DATA.oneFunctionalGroupExpandedKet,
    );
    await clickInTheMiddleOfTheScreen(page);
    await turnOnMicromoleculesEditor(page);
    await takeEditorScreenshot(page);
  });

  test('Check that the Mol-structure pasted from the clipboard in Macro mode is visible in Micro mode.', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Mol-structure pasted from the clipboard in Macro mode  is visible in Micro mode
    */
    await pasteFromClipboard(
      page,
      FILE_TEST_DATA.functionalGroupsExpandedContractedV3000,
      '.mol',
    );
    await clickInTheMiddleOfTheScreen(page);
    await turnOnMicromoleculesEditor(page);
    await takeEditorScreenshot(page);
  });

  const tests = [
    { button: TopPanelButton.Layout, description: 'Layout' },
    { button: TopPanelButton.Clean, description: 'Clean Up' },
  ];

  for (const testInfo of tests) {
    test(`Check that Pressing ${testInfo.description} button not erase all macromolecules from canvas`, async ({
      page,
    }) => {
      /* 
      Test case: Macro-Micro-Switcher/3712
      Description: Pressing Layout or Clean Up button not erase all macromolecules from canvas
      */
      await page.getByTestId('A___Alanine').click();
      await clickInTheMiddleOfTheScreen(page);
      await turnOnMicromoleculesEditor(page);
      await waitForSpinnerFinishedWork(
        page,
        async () => await selectTopPanelButton(testInfo.button, page),
      );
      await takeEditorScreenshot(page);
    });
  }

  test('Check that for CHEMs monomer from when switch to micro mode restricted remove abbreviation', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Remove abbreviation restricted for CHEMs in micro mode.
    */
    await page.getByTestId('CHEM-TAB').click();
    await page.getByTestId('Test-6-Ch___Test-6-AP-Chem').click();
    await clickInTheMiddleOfTheScreen(page);
    await turnOnMicromoleculesEditor(page);
    await page.getByText('Test-6-Ch').click({ button: 'right' });
    await takeEditorScreenshot(page);
  });

  const cases = [
    {
      fileName: 'Molfiles-V3000/dna-mod-base-sugar-phosphate-example.mol',
      description: 'DNA with modified monomer',
    },
    {
      fileName: 'Molfiles-V3000/rna-mod-phosphate-mod-base-example.mol',
      description: 'RNA with modified monomer',
    },
  ];

  for (const testInfo of cases) {
    test(`Check that switching between Macro and Micro mode not crash application when opened ${testInfo.description} with modyfied monomer`, async ({
      page,
    }) => {
      /* 
      Test case: Macro-Micro-Switcher/#3747
      Description: Switching between Macro and Micro mode not crash application when opened DNA/RNA with modyfied monomer
      */
      await openFileAndAddToCanvasMacro(testInfo.fileName, page);
      await turnOnMicromoleculesEditor(page);
      await takeEditorScreenshot(page);
      await turnOnMacromoleculesEditor(page);
      await takeEditorScreenshot(page);
    });
  }

  test('The 3D view works for micromolecules when there are macromolecules on the canvas', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher/#4203
    Description: The 3D view works for micromolecules when there are macromolecules on the canvas.
    Now test working not properly because we have open ticket https://github.com/epam/ketcher/issues/4203
    After closing the ticket, should update the screenshots.

    */
    await page.getByTestId('Bal___beta-Alanine').click();
    await clickInTheMiddleOfTheScreen(page);
    await turnOnMicromoleculesEditor(page);
    await selectRing(RingButton.Benzene, page);
    await clickInTheMiddleOfTheScreen(page);
    await selectTopPanelButton(TopPanelButton.ThreeD, page);
    await takeEditorScreenshot(page);
  });

  test('Check that there are no errors in DevTool console when switching to full screen mode after switching from micro mode', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher/#4094
    Description: There are no errors in DevTool console when switching to full screen mode after switching from micro mode.
    */
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        test.fail(
          msg.type() === 'error',
          `There is error in console: ${msg.text}`,
        );
      }
    });
    await page.getByTestId('Bal___beta-Alanine').click();
    await clickInTheMiddleOfTheScreen(page);
    await turnOnMicromoleculesEditor(page);
    await turnOnMacromoleculesEditor(page);
    await page.locator('.css-1kbfai8').click();
  });
});

test.describe('Macro-Micro-Switcher', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPageInit(page);
  });

  test('Check that the Mol-structure opened from the file in Micro mode is visible on Macro mode when hover on it', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Mol-structure opened from the file in Micro mode is visible on Macro mode when hover on it
    */
    await openFileAndAddToCanvas(
      'Molfiles-V2000/glutamine.mol',
      page,
      topLeftCorner.x,
      topLeftCorner.y,
    );
    await turnOnMacromoleculesEditor(page);
    await page.getByText('F1').locator('..').click();
    await takeEditorScreenshot(page);
  });

  test('Check that the Ket-structure opened from the file in Micro mode  is visible in Macro mode when hover on it', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Mol-structure opened from the file in Micro mode is visible on Macro mode when hover on it
    */
    await openFileAndAddToCanvas(
      'KET/stereo-and-structure.ket',
      page,
      topLeftCorner.x,
      topLeftCorner.y,
    );
    await turnOnMacromoleculesEditor(page);
    await page.getByText('F1').locator('..').hover();
    await takeEditorScreenshot(page);
  });

  test('Create two Benzene rings structure with Charge Plus (+) and Charge Plus (-) Tool added in Micro mode and switch to Macro mode', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Structure exists on the canvas with changes by Charge Plus (+) Tool and Charge Plus (-).
    */
    await openFileAndAddToCanvas(
      'KET/two-benzene-charged.ket',
      page,
      topLeftCorner.x,
      topLeftCorner.y,
    );
    await turnOnMacromoleculesEditor(page);
    await page.getByText('F2').locator('..').hover();
    await takeEditorScreenshot(page);
  });

  test('Create two Benzene rings structure with some text added in Micro mode and switch to Macro mode.', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Structure exists on the canvas without text.
    */
    await openFileAndAddToCanvas(
      'KET/benzene-rings-with-text.ket',
      page,
      topLeftCorner.x,
      topLeftCorner.y,
    );
    await turnOnMacromoleculesEditor(page);
    await page.getByText('F1').locator('..').hover();
    await takeEditorScreenshot(page);
  });

  test('Create two Benzene rings structure with Shape Ellipse Tool added in Micro mode and switch to Macro mode.', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Structure exists on the canvas without Shape Ellipse.
    */
    await openFileAndAddToCanvas(
      'KET/two-benzene-and-ellipse.ket',
      page,
      topLeftCorner.x,
      topLeftCorner.y,
    );
    await turnOnMacromoleculesEditor(page);
    await takeEditorScreenshot(page);
  });

  test('Create two Benzene rings structure with Arrow Open Angle Tool added in Micro mode and switch to Macro mode.', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Structures exists on the canvas without  arrow ( Arrow Open Angle Tool )
    */
    await openFileAndAddToCanvas(
      'KET/two-benzene-and-arrow.ket',
      page,
      topLeftCorner.x,
      topLeftCorner.y,
    );
    await turnOnMacromoleculesEditor(page);
    await takeEditorScreenshot(page);
  });

  test('Create ABS, new OR Group, new AND Group. Switch to Macro mode and check that ABS, AND and OR isn not appear.', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: In Macro mode ABS, AND and OR is not appear
    */
    const xOffsetFromCenter = 200;
    const yOffsetFromCenter = 0;
    await openFileAndAddToCanvas(
      'KET/three-alpha-d-allopyranose.ket',
      page,
      xOffsetFromCenter,
      yOffsetFromCenter,
    );
    await turnOnMacromoleculesEditor(page);
    await waitForRender(page, async () => {
      await page.getByText('F1').locator('..').hover();
    });
    await takeEditorScreenshot(page);
  });

  test('Create two Benzene rings structure with Reaction Plus Tool in Micro mode and switch to Macro mode.', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: In Macro mode plus sign is not appear
    */
    await openFileAndAddToCanvas(
      'KET/two-benzene-and-plus.ket',
      page,
      topLeftCorner.x,
      topLeftCorner.y,
    );
    await turnOnMacromoleculesEditor(page);
    await takeEditorScreenshot(page);
  });

  test('Check that the Ket-structure pasted from the clipboard in Micro mode is visible in Macro mode when hover on it.', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Ket-structure pasted from the clipboard in Micro mode  is visible in Macro mode when hover on it
    */
    const topLeftCornerCoords = {
      x: 500,
      y: 100,
    };
    await pasteFromClipboard(
      page,
      FILE_TEST_DATA.oneFunctionalGroupExpandedKet,
    );
    await page.mouse.click(topLeftCornerCoords.x, topLeftCornerCoords.y);
    await turnOnMacromoleculesEditor(page);
    await page.getByText('F1').locator('..').click();
    await takeEditorScreenshot(page);
  });

  test('Check that the Mol-structure pasted from the clipboard in Micro mode is visible in Macro mode when hover on it.', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Mol-structure pasted from the clipboard in Micro mode  is visible in Macro mode when hover on it
    */
    const coordsToClick = {
      x: 400,
      y: 100,
    };
    await pasteFromClipboard(
      page,
      FILE_TEST_DATA.functionalGroupsExpandedContractedV3000,
      '.mol',
    );
    await waitForRender(page, async () => {
      await page.mouse.click(coordsToClick.x, coordsToClick.y);
    });
    await turnOnMacromoleculesEditor(page);
    await page.getByText('F1').locator('..').hover();
    await takeEditorScreenshot(page);
  });

  test('Make full screen mode in micro mode and switch to macro mode.', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description:  Full screen mode is not reset
    Test working not properly now because we have bug https://github.com/epam/ketcher/issues/3656
    */
    await openFileAndAddToCanvas(
      'KET/two-benzene-and-plus.ket',
      page,
      topLeftCorner.x,
      topLeftCorner.y,
    );
    await page.getByTestId('fullscreen-mode-button').click();
    await turnOnMacromoleculesEditor(page);
    await takePageScreenshot(page);
  });

  test('Confirm that in macromolecules mode, atoms are displayed as dots without any accompanying text or additional information bonds as one line', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher
    Description: Atoms displayed as dots, without any text or other additional information. 
    Bonds displayed as one line regardless which type of bond it is.
    Now test working not properly because we have open ticket https://github.com/epam/ketcher/issues/3618
    After closing the ticket, should update the screenshots.
    */
    await openFileAndAddToCanvas('KET/all-type-of-atoms-and-bonds.ket', page);
    await turnOnMacromoleculesEditor(page);
    for (let i = 0; i < 3; i++) {
      await waitForRender(page, async () => {
        await page.getByTestId('zoom-out-button').click();
      });
    }
    await takeEditorScreenshot(page);
  });

  test('Open a macro file and put in center of canvas in micro mode then switch to macro, check that structure is in center of canvas', async ({
    page,
  }) => {
    /* 
    Test case: Macro-Micro-Switcher/#3902
    Description: Structure is in center of canvas
    */
    await openFileAndAddToCanvas('KET/peptides-connected-with-bonds.ket', page);
    await takeEditorScreenshot(page);
    await turnOnMacromoleculesEditor(page);
    await takeEditorScreenshot(page);
  });
});
