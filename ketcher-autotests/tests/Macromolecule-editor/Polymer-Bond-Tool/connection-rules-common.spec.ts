/* eslint-disable prettier/prettier */
/* eslint-disable no-magic-numbers */
import { Page, chromium, test } from '@playwright/test';
import {
  takeEditorScreenshot,
  selectClearCanvasTool,
  openFileAndAddToCanvasMacro,
  moveMouseAway,
  dragMouseTo,
  waitForKetcherInit,
  waitForIndigoToLoad,
  waitForRender,
  selectSingleBondTool,
  selectFlexLayoutModeTool,
  selectSnakeLayoutModeTool,
} from '@utils';
import {
  turnOnMacromoleculesEditor,
  zoomWithMouseWheel,
} from '@utils/macromolecules';
import { bondTwoMonomersPointToPoint } from '@utils/macromolecules/polymerBond';

test.describe('Common connection rules: ', () => {
  let page: Page;
  test.setTimeout(300000);
  test.describe.configure({ retries: 0 });

  test.beforeAll(async ({ browser }) => {
    let sharedContext;
    try {
      sharedContext = await browser.newContext();
    } catch (error) {
      console.error('Error on creation browser context:', error);
      console.log('Restarting browser...');
      await browser.close();
      browser = await chromium.launch();
      sharedContext = await browser.newContext();
    }

    // Reminder: do not pass page as async
    page = await sharedContext.newPage();

    await page.goto('', { waitUntil: 'domcontentloaded' });
    await waitForKetcherInit(page);
    await waitForIndigoToLoad(page);
    await turnOnMacromoleculesEditor(page);
  });

  test.afterEach(async () => {
    await page.keyboard.press('Escape');
    await page.keyboard.press('Control+0');
    await selectClearCanvasTool(page);
  });

  test.afterAll(async ({ browser }) => {
    const cntxt = page.context();
    await page.close();
    await cntxt.close();
    await browser.contexts().forEach((someContext) => {
      someContext.close();
    });
    // await browser.close();
  });

  interface IMonomer {
    fileName: string;
    alias: string;
    connectionPoints: { [connectionPointName: string]: string };
  }

  async function dragBondFromMonomerCenterAwayTo(
    page: Page,
    monomerName: string,
    x: number,
    y: number,
  ) {
    await selectSingleBondTool(page);

    const monomerLocator = page
      .getByText(monomerName, { exact: true })
      .locator('..')
      .first();

    await monomerLocator.hover();
    await page.mouse.down();
    await waitForRender(page, async () => {
      await page.mouse.move(x, y);
    });
  }

  async function dragBondFromMonomerCenterTo(
    page: Page,
    leftMonomerName: string,
    rightMonomerName: string,
  ) {
    await selectSingleBondTool(page);

    const leftMmonomerLocator = page
      .getByText(leftMonomerName, { exact: true })
      .locator('..')
      .first();

    const rightMonomerLocator = page
      .getByText(rightMonomerName, { exact: true })
      .locator('..')
      .first();

    await leftMmonomerLocator.hover();
    await page.mouse.down();
    await waitForRender(page, async () => {
      await rightMonomerLocator.hover();
    });
  }

  async function hoverMouseOverMonomerNTymes(
    page: Page,
    monomerName: string,
    n: number,
  ) {
    await selectSingleBondTool(page);

    const monomerLocator = page
      .getByText(monomerName, { exact: true })
      .locator('..')
      .first();

    for (let i = 1; i < n; i = i + 1) {
      await monomerLocator.hover();
      await moveMouseAway(page);
    }
  }
  /*
   *  Test case1: https://github.com/epam/ketcher/issues/4600 - Cases 1-3
   *  Check that bond dissapears when 'ESC' button is pressed while pulling bond away from CHEM monomer placed on canvas
   *  Check that bond dissapears when 'ESC' button is pressed while pulling bond away from Peptide monomer placed on canvas
   *  Check that bond dissapears when 'ESC' button is pressed while pulling bond away from RNA monomer placed on canvas
   */
  test(`Check that bond dissapears when 'ESC' button is pressed while pulling bond away from monomers placed on canvas`, async () => {
    test.setTimeout(20000);

    await openFileAndAddToCanvasMacro(
      'KET/Common-Bond-Tests/Automation of Bond tests (203-211).ket',
      page,
    );
    // Peptide
    await dragBondFromMonomerCenterAwayTo(page, 'SMPEG2', 500, 400);
    await page.keyboard.press('Escape');
    await takeEditorScreenshot(page);
    await page.mouse.up();
    // CHEM
    await dragBondFromMonomerCenterAwayTo(page, 'LysiPr', 500, 400);
    await page.keyboard.press('Escape');
    await takeEditorScreenshot(page);
    await page.mouse.up();
    // Sugar
    await dragBondFromMonomerCenterAwayTo(page, '12ddR', 500, 400);
    await page.keyboard.press('Escape');
    await takeEditorScreenshot(page);
    await page.mouse.up();
    // Phosphate
    await dragBondFromMonomerCenterAwayTo(page, 'P', 500, 400);
    await page.keyboard.press('Escape');
    await takeEditorScreenshot(page);
    await page.mouse.up();
    // Base
    await dragBondFromMonomerCenterAwayTo(page, 'c7io7n', 500, 400);
    await page.keyboard.press('Escape');
    await takeEditorScreenshot(page);
    await page.mouse.up();
  });

  /*
   *  Test case2: https://github.com/epam/ketcher/issues/4600 - Cases 4-5
   *  Check that attachment points dissapear when dragging bond from one peptide on canvas to another and clicking 'ESC' when hover second peptide
   *  Check that attachment points dissapear when dragging bond from one RNA monomer on canvas to another and clicking 'ESC' when hover second RNA
   *  Check that attachment points dissapear when dragging bond from one CHEM monomer on canvas to another and clicking 'ESC' when hover second CHEM
   */
  test(`Check that attachment points dissapear when dragging bond from one monomer on canvas to another and clicking 'ESC' when hover second monomer`, async () => {
    test.setTimeout(20000);

    await openFileAndAddToCanvasMacro(
      'KET/Common-Bond-Tests/Automation of Bond tests (203-211).ket',
      page,
    );
    // Peptide
    await dragBondFromMonomerCenterTo(page, 'SMPEG2', 'sDBL');
    await page.keyboard.press('Escape');
    await takeEditorScreenshot(page);
    await page.mouse.up();
    // CHEM
    await dragBondFromMonomerCenterTo(page, 'LysiPr', 'Hcy');
    await page.keyboard.press('Escape');
    await takeEditorScreenshot(page);
    await page.mouse.up();
    // Sugar
    await dragBondFromMonomerCenterTo(page, '12ddR', 'nC62r');
    await page.keyboard.press('Escape');
    await takeEditorScreenshot(page);
    await page.mouse.up();
    // Phosphate
    await dragBondFromMonomerCenterTo(page, 'P', 'mn');
    await page.keyboard.press('Escape');
    await takeEditorScreenshot(page);
    await page.mouse.up();
    // Base
    await dragBondFromMonomerCenterTo(page, 'c7io7n', 'nC6n5U');
    await page.keyboard.press('Escape');
    await takeEditorScreenshot(page);
    await page.mouse.up();
  });

  /*
   *  Test case3: https://github.com/epam/ketcher/issues/4600 - Cases 6-9
   *  Check that attachment points disappear in snake viewed chain of peptides when hovering them multiple times
   *  Check that attachment points disappear in chain of CHEMs when hovering them multiple times
   *  Check that attachment points disappear in chain of RNAs when hovering them multiple times
   */
  test(`Check that attachment points disappear in chain of monomers when hovering them multiple times`, async () => {
    test.setTimeout(40000);

    await openFileAndAddToCanvasMacro(
      'KET/Common-Bond-Tests/Automation of Bond tests (203-211).ket',
      page,
    );
    await selectSnakeLayoutModeTool(page);

    // Peptide
    await hoverMouseOverMonomerNTymes(page, 'sDBL', 10);
    await takeEditorScreenshot(page);
    // CHEM
    await hoverMouseOverMonomerNTymes(page, 'Hcy', 10);
    await takeEditorScreenshot(page);
    // Sugar
    await hoverMouseOverMonomerNTymes(page, 'nC62r', 10);
    await takeEditorScreenshot(page);
    // Phosphate
    await hoverMouseOverMonomerNTymes(page, 'mn', 10);
    await takeEditorScreenshot(page);
    // Base
    await hoverMouseOverMonomerNTymes(page, 'nC6n5U', 10);
    await takeEditorScreenshot(page);

    await selectFlexLayoutModeTool(page);
  });
});
