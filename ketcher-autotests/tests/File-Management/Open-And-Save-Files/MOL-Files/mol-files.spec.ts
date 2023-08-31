/* eslint-disable no-magic-numbers */
import { expect, test } from '@playwright/test';
import {
  takeEditorScreenshot,
  receiveFileComparisonData,
  openFileAndAddToCanvas,
  saveToFile,
} from '@utils';
import { getMolfile } from '@utils/formats';

test('Open and Save files - Open/Save structure with atom properties 1/2 - open', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1855(1)
   * Description: Sctucrute with atom properties is opened and saved correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('mol_1855_to_open.mol', page);
  // check that structure opened from file is displayed correctly
  await takeEditorScreenshot(page);
});

test('Open and Save files - Open/Save structure with atom properties 2/2 - save', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1855(2)
   * Description: Sctucrute with atom properties is opened and saved correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('mol_1855_to_open.mol', page);
  const expectedFile = await getMolfile(page, 'v2000');
  await saveToFile('mol_1855_to_open-expected.mol', expectedFile);

  const METADATA_STRING_INDEX = [1];
  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/mol_1855_to_open-expected.mol',
      fileFormat: 'v2000',
      metaDataIndexes: METADATA_STRING_INDEX,
    });

  expect(molFile).toEqual(molFileExpected);
});

test('Open and Save file - Open/Save V3000 file with atom and bond properties 1/2 - open', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1857(1)
   * Description: Strucrute with atom and bond properties is opened and saved correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('Marvin_Atom_properties_V3000.mol', page);
  // check that structure opened from file is displayed correctly
  await takeEditorScreenshot(page);
});

test('Open and Save file - Open/Save V3000 file with atom and bond properties 2/2 - save', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1857(2)
   * Description: Strucrute with atom and bond properties is opened and saved correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('Marvin_Atom_properties_V3000.mol', page);
  const expectedFile = await getMolfile(page, 'v3000');
  await saveToFile('atom-properties-V3000-expected.mol', expectedFile);

  const METADATA_STRING_INDEX = [1];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/atom-properties-V3000-expected.mol',
      fileFormat: 'v3000',
      metaDataIndexes: METADATA_STRING_INDEX,
    });

  expect(molFile).toEqual(molFileExpected);
});

test.fixme(
  'Open and Save file - Open/Save Markush files 1/2 - open',
  async ({ page }) => {
    /**
     * Test case: EPMLSOPKET-1894(1)
     * Description: Markush structure is displayed as an RGroup structure.
     */
    await page.goto('');

    await openFileAndAddToCanvas('Markush.mol', page);
    // check that structure opened from file is displayed correctly
    await takeEditorScreenshot(page);
  },
);

test('Open and Save file - Open/Save Markush files 2/2 - save', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1894(2)
   * Description: Markush structure is displayed as an RGroup structure.
   */
  await page.goto('');

  await openFileAndAddToCanvas('Markush.mol', page);
  const expectedFile = await getMolfile(page, 'v2000');
  await saveToFile('markush-expected.mol', expectedFile);

  const METADATA_STRINGS_INDEXES = [0, 4];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/markush-expected.mol',
      fileFormat: 'v2000',
      metaDataIndexes: METADATA_STRINGS_INDEXES,
    });

  expect(molFile).toEqual(molFileExpected);
});

test('Open and Save file - Open/Save V2000 *.mol file contains abbreviation 1/2 - open', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1858(1)
   * Description: v2000 mol file with abbreviation is opened and saved correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('sec_butyl_abr.mol', page);
  // check that structure opened from file is displayed correctly
  await takeEditorScreenshot(page);
});

test('Open and Save file - Open/Save V2000 *.mol file contains abbreviation 2/2 - save', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1858(2)
   * Description: v2000 mol file with abbreviation is opened and saved correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('sec_butyl_abr.mol', page);
  const expectedFile = await getMolfile(page, 'v2000');
  await saveToFile('sec_butyl_abr-expected.mol', expectedFile);

  const METADATA_STRING_INDEX = [1];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/sec_butyl_abr-expected.mol',
      fileFormat: 'v2000',
      metaDataIndexes: METADATA_STRING_INDEX,
    });

  expect(molFile).toEqual(molFileExpected);
});

test('Open and Save file - Open/Save V3000 *.mol file contains abbreviation 1/2 - open', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1859(1)
   * Description: v3000 mol file with abbreviation is opened and saved correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('sec_butyl_abr_V3000.mol', page);
  // check that structure opened from file is displayed correctly
  await takeEditorScreenshot(page);
});

test('Open and Save file - Open/Save V3000 *.mol file contains abbreviation 2/2 - save', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1859(2)
   * Description: v3000 mol file with abbreviation is opened and saved correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('sec_butyl_abr_V3000.mol', page);
  const expectedFile = await getMolfile(page, 'v3000');
  await saveToFile('sec_butyl_abr_V3000-expected.mol', expectedFile);
  const METADATA_STRING_INDEX = [1];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/sec_butyl_abr_V3000-expected.mol',
      fileFormat: 'v3000',
      metaDataIndexes: METADATA_STRING_INDEX,
    });

  expect(molFile).toEqual(molFileExpected);
});

test('Open and Save file - Open/Save file with R-Groups 1/2 - open', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1873(1)
   * Description: Structure with R-Groups is correctly opened from Mol file
   */
  await page.goto('');

  await openFileAndAddToCanvas('Rgroup.mol', page);
  // check that structure opened from file is displayed correctly
  await takeEditorScreenshot(page);
});

test('Open and Save file - Open/Save file with R-Groups 2/2 - save', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1873(2)
   * Description: Structure with R-Groups is correctly saved to Mol file
   */
  await page.goto('');

  await openFileAndAddToCanvas('Rgroup.mol', page);
  const expectedFile = await getMolfile(page, 'v2000');
  await saveToFile('r-group-expected.mol', expectedFile);

  const METADATA_STRINGS_INDEXES = [0, 4];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/r-group-expected.mol',
      fileFormat: 'v2000',
      metaDataIndexes: METADATA_STRINGS_INDEXES,
    });

  expect(molFile).toEqual(molFileExpected);
});

test.fixme(
  'Open and Save file - Open/Save file contains Heteroatoms 1/2 - open',
  async ({ page }) => {
    /**
     * Test case: EPMLSOPKET-1878(1)
     * Description: Structure with heteroatoms is opened from mol file correctly
     */
    await page.goto('');

    await openFileAndAddToCanvas('Heteroatoms.mol', page);
    // check that structure opened from file is displayed correctly
    await takeEditorScreenshot(page);
  },
);

test('Open and Save file - Open/Save file contains Heteroatoms 2/2 - save', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1878(2)
   * Description: Structure with heteroatoms is saved to mol file correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('Heteroatoms.mol', page);
  const expectedFile = await getMolfile(page, 'v2000');
  await saveToFile('heteroatoms-expected.mol', expectedFile);
  const METADATA_STRING_INDEX = [1];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/heteroatoms-expected.mol',
      metaDataIndexes: METADATA_STRING_INDEX,
    });

  expect(molFile).toEqual(molFileExpected);
});

test('Open and Save file - Open/Save V3000 mol file contains attached data 1/2 - open', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1882(1)
   * Description: Structure with attached data is opened from mol file correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('Attached data_V3000.mol', page);
  // check that structure opened from file is displayed correctly
  await takeEditorScreenshot(page);
});

test('Open and Save file - Open/Save V3000 mol file contains attached data 2/2 - save', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1882(2)
   * Description: Structure with attached data is saved to mol file correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('Attached data_V3000.mol', page);
  const expectedFile = await getMolfile(page, 'v3000');
  await saveToFile('Attached data_V3000-expected.mol', expectedFile);
  const METADATA_STRING_INDEX = [1];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/Attached data_V3000-expected.mol',
      fileFormat: 'v3000',
      metaDataIndexes: METADATA_STRING_INDEX,
    });

  expect(molFile).toEqual(molFileExpected);
});

test('Open and Save file - V3000 *.mol file contains Heteroatoms 1/2 - open', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1879(1)
   * Description: Structure with heteroatoms is opened from mol v3000 file correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('Heteroatoms_V3000.mol', page);
  // check that structure opened from file is displayed correctly
  await takeEditorScreenshot(page);
});

test('Open and Save file - V3000 *.mol file contains Heteroatoms 2/2 - save', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1879(2)
   * Description: Structure with heteroatoms is saved correctly to mol file
   */
  await page.goto('');

  await openFileAndAddToCanvas('Heteroatoms_V3000.mol', page);
  const expectedFile = await getMolfile(page, 'v3000');
  await saveToFile('heteroatoms-V3000-expected.mol', expectedFile);
  const METADATA_STRING_INDEX = [1];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/heteroatoms-V3000-expected.mol',
      fileFormat: 'v3000',
      metaDataIndexes: METADATA_STRING_INDEX,
    });

  expect(molFile).toEqual(molFileExpected);
});

test('Open and Save file - Open/Save file with Attached data 1/2 - open', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1880(1)
   * Description: Structure with heteroatoms is opened from mol v3000 file correctly
   */
  await page.goto('');

  await openFileAndAddToCanvas('Attached data.mol', page);
  // check that structure opened from file is displayed correctly
  await takeEditorScreenshot(page);
});

test('Open and Save file - Open/Save file with Attached data 2/2 - save', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1880(2)
   * Description: Structure with heteroatoms is saved correctly to mol file
   */
  await page.goto('');

  await openFileAndAddToCanvas('Attached data.mol', page);
  const expectedFile = await getMolfile(page, 'v2000');
  await saveToFile('Attached data-expected.mol', expectedFile);
  const METADATA_STRING_INDEX = [1];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/Attached data-expected.mol',
      fileFormat: 'v2000',
      metaDataIndexes: METADATA_STRING_INDEX,
    });

  expect(molFile).toEqual(molFileExpected);
});

test('Open and Save file - Open/Save file contains abs stereochemistry 1/2 - open', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1883(1)
   * Description: File with abs stereochemistry is opened correctly from mol file
   */
  await page.goto('');

  await openFileAndAddToCanvas('V2000_abs.mol', page);
  // check that structure opened from file is displayed correctly
  await takeEditorScreenshot(page);
});

test('Open and Save file - Open/Save file contains abs stereochemistry 2/2 - save', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1883(2)
   * Description: Structure with abs stereochemistry is saved correctly to mol file
   */
  await page.goto('');

  await openFileAndAddToCanvas('V2000_abs.mol', page);
  const expectedFile = await getMolfile(page, 'v2000');
  await saveToFile('V2000-abs-expected.mol', expectedFile);
  const METADATA_STRING_INDEX = [1];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/V2000-abs-expected.mol',
      fileFormat: 'v2000',
      metaDataIndexes: METADATA_STRING_INDEX,
    });

  expect(molFile).toEqual(molFileExpected);
});

test('Open and Save file - Open/Save V3000 mol file contains abs stereochemistry 1/2 - open', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1884(1)
   * Description: File with abs stereochemistry is opened correctly from mol v3000 file
   */
  await page.goto('');

  await openFileAndAddToCanvas('V3000_abs.mol', page);
  // check that structure opened from file is displayed correctly
  await takeEditorScreenshot(page);
});

test('Open and Save file - Open/Save V3000 mol file contains abs stereochemistry 2/2 - save', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1884(2)
   * Description: Structure with abs stereochemistry is saved correctly to mol file
   */
  await page.goto('');

  await openFileAndAddToCanvas('V3000_abs.mol', page);
  const expectedFile = await getMolfile(page, 'v3000');
  await saveToFile('V3000-abs-expected.mol', expectedFile);
  const METADATA_STRING_INDEX = [1];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/V3000-abs-expected.mol',
      fileFormat: 'v3000',
      metaDataIndexes: METADATA_STRING_INDEX,
    });

  expect(molFile).toEqual(molFileExpected);
});

test('Open and Save file - Save V2000 molfile as V3000 molfile', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1985
   * Description: Structure opened from V2000 molfile can be saved to V3000 molfile
   */
  await page.goto('');

  await openFileAndAddToCanvas('spiro.mol', page);
  const expectedFile = await getMolfile(page, 'v3000');
  await saveToFile('spiro-expected.mol', expectedFile);

  const METADATA_STRINGS_INDEXES = [1, 3];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/spiro-expected.mol',
      metaDataIndexes: METADATA_STRINGS_INDEXES,
      fileFormat: 'v3000',
    });

  expect(molFile).toEqual(molFileExpected);
});

test('Open and Save file - Save V3000 molfile as V2000 molfile', async ({
  page,
}) => {
  /**
   * Test case: EPMLSOPKET-1986
   * Description: Structure opened from V3000 molfile can be saved to V2000 molfile
   */
  await page.goto('');

  await openFileAndAddToCanvas('ketcher (4).mol', page);
  const expectedFile = await getMolfile(page, 'v2000');
  await saveToFile('ketcher (4)-expected.mol', expectedFile);
  const METADATA_STRINGS_INDEXES = [1];

  const { fileExpected: molFileExpected, file: molFile } =
    await receiveFileComparisonData({
      page,
      expectedFileName: 'tests/test-data/ketcher (4)-expected.mol',
      metaDataIndexes: METADATA_STRINGS_INDEXES,
      fileFormat: 'v2000',
    });

  expect(molFile).toEqual(molFileExpected);
});

test('Open V3000 file with R-Groups with Fragments', async ({ page }) => {
  // Related Github issue https://github.com/epam/ketcher/issues/2774
  await page.goto('');
  await openFileAndAddToCanvas('RGroup-With-Fragments.mol', page);
  await takeEditorScreenshot(page);
});

test.describe('', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Open and Save files - Open/Save structure with bond properties', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-1852
     * Description: Structure with the correct Bond properties is correctly represented
     */

    await openFileAndAddToCanvas(
      'Molfiles-V2000/all_bond_properties.mol',
      page,
    );
    await takeEditorScreenshot(page);
  });

  test.fixme(
    'Open and Save files - V3000 mol file contains different Bond properties',
    async ({ page }) => {
      /**
       * Test case: EPMLSOPKET-1853
       * Description: Structre is correctly generated from Molstring and vise versa molstring is correctly generated from structure.
       * A file with V3000 format is resaved in V2000 format
       *
       * Now we can`t open the file - `Convert error! Cannot deserialize input JSON.`
       */

      await openFileAndAddToCanvas(
        'Molfiles-V3000/marvin-bond-properties-V3000(1).mol',
        page,
      );

      const expectedFile = await getMolfile(page, 'v2000');
      await saveToFile(
        'Molfiles-V2000/marvin-bond-properties-V3000-expected.mol',
        expectedFile,
      );

      const METADATA_STRING_INDEX = [1];
      const { fileExpected: molFileExpected, file: molFile } =
        await receiveFileComparisonData({
          page,
          expectedFileName:
            'tests/test-data/Molfiles-V2000/marvin-bond-properties-V3000-expected.mol',
          fileFormat: 'v2000',
          metaDataIndexes: METADATA_STRING_INDEX,
        });

      expect(molFile).toEqual(molFileExpected);
    },
  );

  test('Open and Save file - Open/Save Alias and Pseudoatoms 1/2 - open', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-1856(1)
     * Description: The saved structure is correctly rendered on the canvas
     */

    await openFileAndAddToCanvas('Molfiles-V2000/mol_1856_to_open.mol', page);
    await takeEditorScreenshot(page);
  });

  test('Open and Save file - Open/Save Alias and Pseudoatoms 2/2 - save', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-1856(2)
     * Description: The saved structure is correctly rendered on the canvas
     * */

    await openFileAndAddToCanvas('Molfiles-V2000/mol_1856_to_open.mol', page);

    const expectedFile = await getMolfile(page, 'v2000');
    await saveToFile(
      'Molfiles-V2000/mol_1856_to_open-expected.mol',
      expectedFile,
    );

    const METADATA_STRING_INDEX = [1];
    const { fileExpected: molFileExpected, file: molFile } =
      await receiveFileComparisonData({
        page,
        expectedFileName:
          'tests/test-data/Molfiles-V2000/mol_1856_to_open-expected.mol',
        fileFormat: 'v2000',
        metaDataIndexes: METADATA_STRING_INDEX,
      });

    expect(molFile).toEqual(molFileExpected);
  });

  test('Open and Save file - Open/Save V3000 mol file contains Rgroup 1/2 - open', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-1874(1)
     * Description: Structure is correctly generated from Molstring
     * and vise versa molstring is correctly generated from structure.
     */

    await openFileAndAddToCanvas('Molfiles-V3000/rgroup-V3000.mol', page);
    await takeEditorScreenshot(page);
  });

  test('Open and Save file - Open/Save V3000 mol file contains Rgroup 2/2 - save', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-1874(2)
     * Description: Structure is correctly generated from Molstring
     * and vise versa molstring is correctly generated from structure.
     * A file with V3000 format is resaved in V2000 format (now).
     * */

    await openFileAndAddToCanvas('Molfiles-V3000/rgroup-V3000.mol', page);

    const expectedFile = await getMolfile(page, 'v3000');
    await saveToFile('Molfiles-V3000/rgroup-V3000-expected.mol', expectedFile);

    const METADATA_STRING_INDEX = [1];
    const { fileExpected: molFileExpected, file: molFile } =
      await receiveFileComparisonData({
        page,
        expectedFileName:
          'tests/test-data/Molfiles-V3000/rgroup-V3000-expected.mol',
        fileFormat: 'v3000',
        metaDataIndexes: METADATA_STRING_INDEX,
      });

    expect(molFile).toEqual(molFileExpected);
  });

  test.fixme(
    'Open and Save file - Open/Save file with S-Groups 1/2 - open',
    async ({ page }) => {
      /**
       * Test case: EPMLSOPKET-1875(1)
       * Description: Structure is correctly generated from Molstring
       * and vise versa molstring is correctly generated from structure.
       */

      await openFileAndAddToCanvas('Molfiles-V2000/sgroup_different.mol', page);
      await takeEditorScreenshot(page);
    },
  );

  test.fixme(
    'Open and Save file - Open/Save file with S-Groups 2/2 - save',
    async ({ page }) => {
      /**
       * Test case: EPMLSOPKET-1875(2)
       * Description: Structure is correctly generated from Molstring
       * and vise versa molstring is correctly generated from structure.
       * */

      await openFileAndAddToCanvas('Molfiles-V2000/sgroup_different.mol', page);
      const expectedFile = await getMolfile(page, 'v2000');
      await saveToFile(
        'Molfiles-V2000/sgroup_different-expected.mol',
        expectedFile,
      );

      const METADATA_STRING_INDEX = [1];
      const { fileExpected: molFileExpected, file: molFile } =
        await receiveFileComparisonData({
          page,
          expectedFileName:
            'tests/test-data/Molfiles-V2000/sgroup_different-expected.mol',
          fileFormat: 'v2000',
          metaDataIndexes: METADATA_STRING_INDEX,
        });

      expect(molFile).toEqual(molFileExpected);
    },
  );

  test.fixme(
    'Open and Save file - Open/Save  V3000 mol file contains Sgroup 1/2 - open',
    async ({ page }) => {
      /**
       * Test case: EPMLSOPKET-1876(1)
       * Description: Structure is correctly generated from Molstring
       * and vise versa molstring is correctly generated from structure.
       * Now it is a bug
       */

      await openFileAndAddToCanvas(
        'Molfiles-V3000/sgroup_different_V3000',
        page,
      );
      await takeEditorScreenshot(page);
    },
  );

  test.fixme(
    'Open and Save file - Open/Save  V3000 mol file contains Sgroup 2/2 - save',
    async ({ page }) => {
      /**
       * Test case: EPMLSOPKET-1876(2)
       * Description: A file with V3000 format is resaved in V2000 format.
       * Now it is a bug
       * */

      await openFileAndAddToCanvas(
        'Molfiles-V3000/sgroup_different_V3000',
        page,
      );
      const expectedFile = await getMolfile(page, 'v2000');
      await saveToFile(
        'Molfiles-V2000/sgroup_different_V2000-expected.mol',
        expectedFile,
      );

      const METADATA_STRING_INDEX = [1];
      const { fileExpected: molFileExpected, file: molFile } =
        await receiveFileComparisonData({
          page,
          expectedFileName:
            'tests/test-data/Molfiles-V2000/sgroup_different_V2000-expected.mol',
          fileFormat: 'v2000',
          metaDataIndexes: METADATA_STRING_INDEX,
        });

      expect(molFile).toEqual(molFileExpected);
    },
  );

  test('Open and Save file - Open/Save V3000 mol file contains more than 900 symbols 1/2 - open', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-1890(1)
     * Description: Structure is correctly generated from Molstring
     * and vise versa molstring is correctly generated from structure.
     */

    await openFileAndAddToCanvas('Molfiles-V3000/more_900_atoms.mol', page);
    await takeEditorScreenshot(page);
  });

  test('Open and Save file - Open/Save V3000 mol file contains more than 900 symbols 2/2 - save', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-1890(2)
     * Description: Structure is correctly generated from Molstring
     * and vise versa molstring is correctly generated from structure.
     * */

    await openFileAndAddToCanvas('Molfiles-V3000/more_900_atoms.mol', page);
    const expectedFile = await getMolfile(page, 'v3000');
    await saveToFile(
      'Molfiles-V3000/more_900_atoms-expected.mol',
      expectedFile,
    );

    const METADATA_STRING_INDEX = [1];
    const { fileExpected: molFileExpected, file: molFile } =
      await receiveFileComparisonData({
        page,
        expectedFileName:
          'tests/test-data/Molfiles-V3000/more_900_atoms-expected.mol',
        fileFormat: 'v3000',
        metaDataIndexes: METADATA_STRING_INDEX,
      });

    expect(molFile).toEqual(molFileExpected);
  });

  for (let i = 1; i < 9; i++) {
    test(`'Open and Save file - Open/Save files for ferrocen-like structures 1/2 - open ferrocene_radical0${i}.mol`, async ({
      page,
    }) => {
      /**
       * Test case: EPMLSOPKET-1893(1)
       * Description: Structures are rendered correctly
       */

      await openFileAndAddToCanvas(
        `Molfiles-V2000/ferrocene_radical0${i}.mol`,
        page,
      );
      await takeEditorScreenshot(page);
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Delete');
    });
  }

  test('Open and Save file - Open/Save files for ferrocen-like structures 2/2 - save', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-1893(2)
     * Description: Structures are rendered correctly.
     * */

    for (let i = 1; i < 9; i++) {
      await openFileAndAddToCanvas(
        `Molfiles-V2000/ferrocene_radical0${i}.mol`,
        page,
      );
    }

    const expectedFile = await getMolfile(page, 'v2000');
    await saveToFile(
      'Molfiles-V2000/ferrocene_radical-8-expected.mol',
      expectedFile,
    );

    const METADATA_STRING_INDEX = [1];
    const { fileExpected: molFileExpected, file: molFile } =
      await receiveFileComparisonData({
        page,
        expectedFileName:
          'tests/test-data/Molfiles-V2000/ferrocene_radical-8-expected.mol',
        fileFormat: 'v2000',
        metaDataIndexes: METADATA_STRING_INDEX,
      });

    expect(molFile).toEqual(molFileExpected);
  });

  test('Open and Save file - Open/Save V3000 mol file contains Sgroup 1/2 - open', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-1895(1)
     * Description: Structure is correctly generated from Molstring
     * and vise versa molstring is correctly generated from structure.
     */

    await openFileAndAddToCanvas('Molfiles-V3000/multi_V3000.mol', page);
    await takeEditorScreenshot(page);
  });

  test('Open and Save file - Open/Save V3000 mol file contains Sgroup 2/2 - save', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-1895(2)
     * Description:Structure is correctly generated from Molstring
     * and vise versa molstring is correctly generated from structure.
     * */

    await openFileAndAddToCanvas('Molfiles-V3000/multi_V3000.mol', page);

    const expectedFile = await getMolfile(page, 'v3000');
    await saveToFile('Molfiles-V3000/multi_V3000-expected.mol', expectedFile);

    const METADATA_STRING_INDEX = [1];
    const { fileExpected: molFileExpected, file: molFile } =
      await receiveFileComparisonData({
        page,
        expectedFileName:
          'tests/test-data/Molfiles-V3000/multi_V3000-expected.mol',
        fileFormat: 'v3000',
        metaDataIndexes: METADATA_STRING_INDEX,
      });

    expect(molFile).toEqual(molFileExpected);
  });

  test('Open and Save file - Save structure as *.mol V3000', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-1979
     * Description: Structure is displayed correctly
     * */

    await openFileAndAddToCanvas('Molfiles-V3000/multi_V3000.mol', page);
    await takeEditorScreenshot(page);
  });

  test('MDL Molfile v2000: Correct padding for M ALS 1/2 - open', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-8914(1)
     * Description: Structure is correctly generated from Molstring
     * and vise versa molstring is correctly generated from structure.
     */

    await openFileAndAddToCanvas('Molfiles-V2000/molfile_with_als.mol', page);
    await takeEditorScreenshot(page);
  });

  test('MDL Molfile v2000: Correct padding for M ALS 2/2 - check padding', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-8914(2)
     * Description: Files opens.
     * Alias is located on the atom to which we assigned it
     * */

    await openFileAndAddToCanvas('Molfiles-V2000/molfile_with_als.mol', page);
    const expectedFile = await getMolfile(page, 'v2000');
    const isCorrectPadding = expectedFile.includes('N   ');

    expect(isCorrectPadding).toEqual(true);
  });

  test.fixme(
    'Open and Save file - Open/Save v3000 mol file with assigned Alias 1/2 - open',
    async ({ page }) => {
      /**
       * Test case: EPMLSOPKET-12963(1)
       * Description: Files opens. Alias is located on the atom to which we assigned it
       * Now it is a bug
       */

      await openFileAndAddToCanvas(
        'Molfiles-V3000/mol_12963_to_open.mol',
        page,
      );
      await takeEditorScreenshot(page);
    },
  );

  test.fixme(
    'Open and Save file - Open/Save v3000 mol file with assigned Alias 2/2 - save',
    async ({ page }) => {
      /**
       * Test case: EPMLSOPKET-12963(2)
       * Description: Files opens. Alias is located on the atom to which we assigned it
       * Now it is a bug
       * */

      await openFileAndAddToCanvas(
        'Molfiles-V3000/mol_12963_to_open.mol',
        page,
      );
      const expectedFile = await getMolfile(page, 'v3000');
      await saveToFile(
        'Molfiles-V3000/mol_12963_to_open-expected',
        expectedFile,
      );

      const METADATA_STRING_INDEX = [1];
      const { fileExpected: molFileExpected, file: molFile } =
        await receiveFileComparisonData({
          page,
          expectedFileName:
            'tests/test-data/Molfiles-V3000/mol_12963_to_open-expected.mol',
          fileFormat: 'v3000',
          metaDataIndexes: METADATA_STRING_INDEX,
        });

      expect(molFile).toEqual(molFileExpected);
    },
  );

  test('Open and Save file - Open structure with R-Group from v3000 mol file', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-12966
     * Description: Structure is displayed correctly
     * */

    await openFileAndAddToCanvas('Molfiles-V3000/rgroup-V3000.mol', page);
    await takeEditorScreenshot(page);
  });

  test('Open and Save file - Don`t creates invalid molfiles with "NaN"', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-4731
     * Description: Preview doesn't contains NaN
     * */

    await openFileAndAddToCanvas('Molfiles-V2000/mol_4731_to_open.mol', page);
    await takeEditorScreenshot(page);
  });

  test('Open and Save file - Functional group name layout close to attachment point', async ({
    page,
  }) => {
    /**
     * Test case: EPMLSOPKET-5259
     * Description: Functional group label is located at the right location
     * */

    await openFileAndAddToCanvas(
      'Molfiles-V2000/display-abbrev-groups-example.mol',
      page,
    );

    await takeEditorScreenshot(page);
  });
});
