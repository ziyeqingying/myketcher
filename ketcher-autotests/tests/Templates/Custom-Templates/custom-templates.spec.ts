import { test } from '@playwright/test';
import {
  pressButton,
  takeEditorScreenshot,
  STRUCTURE_LIBRARY_BUTTON_NAME,
  waitForPageInit,
  selectUserTemplatesAndPlaceInTheMiddle,
  TemplateLibrary,
  clickInTheMiddleOfTheScreen,
  selectFunctionalGroups,
  FunctionalGroups,
  openEditDialogForTemplate,
  selectAzuleneOnTemplateLibrary,
} from '@utils';

test.describe('Open Ketcher', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPageInit(page);
  });

  test.afterEach(async ({ page }) => {
    await takeEditorScreenshot(page);
  });

  test('Custom Templates - Template Library folders', async ({ page }) => {
    /*
   Test case: EPMLSOPKET-1697 - 'The 'Template Library' tab is opened by default.'
  */
    await pressButton(page, STRUCTURE_LIBRARY_BUTTON_NAME);
  });

  test('Custom Templates - Template Library folders content', async ({
    page,
  }) => {
    /*
   Test case: EPMLSOPKET-1698 - Any structure is saved by the user as a template.
   Click the 'Custom Template' button.
   Click on some template folders.
   Check any structures
   Open the 'User Templates' folder'
  */
    await selectUserTemplatesAndPlaceInTheMiddle(TemplateLibrary.Azulene, page);
  });

  test('Custom Templates - Window UI', async ({ page }) => {
    /*
   Test case: EPMLSOPKET-2887 
   Click the 'Custom Templates' button.
   Click on the 'Functional Groups' tab
   Click on the 'Salts and Solvents' tab
   Click the 'X' button.
   Click on the 'Custom Templates' button.
   */
    await pressButton(page, STRUCTURE_LIBRARY_BUTTON_NAME);
    await page.getByRole('tab', { name: 'Functional Groups' }).click();
    await page.getByRole('tab', { name: 'Salts and Solvents' }).click();
    await page.getByTestId('close-icon').click();
    await pressButton(page, STRUCTURE_LIBRARY_BUTTON_NAME);
  });

  test('When switching between tabs-the focus is active', async ({ page }) => {
    /*
   Test case: EPMLSOPKET-8908 
   Launch Ketcher
   Open 'Custom Templates'
   Switch between tabs
   */
    await pressButton(page, STRUCTURE_LIBRARY_BUTTON_NAME);
    await page.getByRole('tab', { name: 'Salts and Solvents' }).click();
    await page.getByRole('tab', { name: 'Functional Groups' }).click();
    await page.getByRole('tab', { name: 'Salts and Solvents' }).click();
  });

  test('Thumbnail images are readable in Template Dialog', async ({ page }) => {
    /*
   Test case: EPMLSOPKET-8932 
   Open template dialog
   Switch to "Functional Groups" tab
   Observe some large structure
   */
    await selectFunctionalGroups(FunctionalGroups.Tf, page);
    await clickInTheMiddleOfTheScreen(page);
  });

  test('Check automatically reset the search filter', async ({ page }) => {
    /*
   Test case: EPMLSOPKET-8906 
    Enter the abbreviation in the search box (e.g. DMF)
    Close 'Custom Templates' window
    Open 'Custom Templates' window
   */
    await pressButton(page, STRUCTURE_LIBRARY_BUTTON_NAME);
    await page.getByPlaceholder('Search by elements...').fill('DMF');
    await page.getByPlaceholder('Search by elements...').press('Enter');
    await takeEditorScreenshot(page);
    await page.getByTestId('close-icon').click();
    await pressButton(page, STRUCTURE_LIBRARY_BUTTON_NAME);
  });

  test('Adding template to canvas', async ({ page }) => {
    /*
   Test case: EPMLSOPKET-1667 
   Click the 'Custom Templates' button.
   Choose a template from any folder.
   Click to add the selected template on the canvas.
   */
    await selectUserTemplatesAndPlaceInTheMiddle(
      TemplateLibrary.Anthracene,
      page,
    );
    await clickInTheMiddleOfTheScreen(page);
  });

  test('The scroll should not be displayed in the edit', async ({ page }) => {
    /*
   Test case: EPMLSOPKET-4736 
   Launch Ketcher
   Open Templates window
   Open alpha-D-Sugars tab of Templates window
   Click on Edit button in right down corner of template (e.g. alpha-D-Arabinofuranose)
   */
    await pressButton(page, STRUCTURE_LIBRARY_BUTTON_NAME);
    await page.getByRole('tab', { name: 'Template Library' }).click();
    await page.getByRole('button', { name: 'Aromatics (18)' }).click();
    await page.getByTitle('Azulene').getByRole('button').click();
    await takeEditorScreenshot(page);
    await page.getByRole('button', { name: 'Edit' }).click();
  });
  test('Edit templates - Close window', async ({ page }) => {
    /*
   Test case: EPMLSOPKET-1700 
   Click the 'Custom Template' button.
   Click 'Edit' button for any template.
   Click the 'X' button at the top right corner.
   Click 'Edit' button for the same template.
   Click the 'Cancel' button.
   Click 'Edit' button for the same template.
   Make any change(s) in the window. Click the 'Apply' button.
   */
    await pressButton(page, STRUCTURE_LIBRARY_BUTTON_NAME);
    await selectAzuleneOnTemplateLibrary(page);
    await page.getByTestId('close-icon').click();
    await selectAzuleneOnTemplateLibrary(page);
    await page.getByRole('button', { name: 'Cancel' }).click();
    await selectAzuleneOnTemplateLibrary(page);
    await page.getByRole('button', { name: 'Edit' }).click();
  });

  test('Edit templates - Template Name', async ({ page }) => {
    /*
   Test case: EPMLSOPKET-1701 
   Click the 'Custom Template' button.
   Paste in the 'Molecule name' field text (more than 128 symbols).
   */
    await openEditDialogForTemplate(page, TemplateLibrary.Azulene);
    await page.getByPlaceholder('template').click();
    await page
      .getByPlaceholder('template')
      .fill(
        'My new template for everyone who want to create new table with more than 128 symbols of elements like Azulene with merged Cyclopentadiene',
      );
  });

  test('Edit templates -  Greek symbols in Template Name', async ({ page }) => {
    /*
   Test case: EPMLSOPKET-1707 
   Description: The edited template has the 'γ-template name' (Greek symbol) name in the Template Library.
   */
    await openEditDialogForTemplate(page, TemplateLibrary.Azulene);
    await page.getByPlaceholder('template').click();
    await page.getByPlaceholder('template').fill('γ-template name');
  });

  test('Edit templates -  Attachment atom and bond', async ({ page }) => {
    /*
   Test case: EPMLSOPKET-1708
   Description: The info text 'Atom Id: xx; Bond Id: yy' contains the ids of the new attachment atom and bond.
   */
    await openEditDialogForTemplate(page, TemplateLibrary.Azulene);
    await page.getByPlaceholder('template').click();
    await page.getByRole('dialog').getByTestId('canvas').click();
  });
});
