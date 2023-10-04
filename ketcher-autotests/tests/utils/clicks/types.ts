export type AtomLabelType =
  | 'C'
  | 'O'
  | 'N'
  | 'H'
  | 'L#'
  | 'Cl'
  | 'S'
  | 'F'
  | 'Br'
  | 'P'
  | 'I';

export type AtomExtendedType =
  | 'G'
  | 'GH'
  | 'G*'
  | 'GH*'
  | 'ACY'
  | 'ACH'
  | 'ABC'
  | 'ABH'
  | 'AYH'
  | 'AYL'
  | 'ALK'
  | 'ALH'
  | 'AEL'
  | 'AEH'
  | 'AHC'
  | 'AHH'
  | 'AOX'
  | 'AOH'
  | 'CYC'
  | 'CYH'
  | 'CXX'
  | 'CXH'
  | 'CBC'
  | 'CBH'
  | 'ARY'
  | 'ARH'
  | 'CAL'
  | 'CAH'
  | 'CEL'
  | 'CEH'
  | 'CHC'
  | 'CHH'
  | 'HAR'
  | 'HAH';

export type DropdownIds =
  | 'bonds'
  | 'rgroup-label'
  | 'select-rectangle'
  | 'reaction-arrow-open-angle'
  | 'reaction-map'
  | 'shape-ellipse';

export type DropdownToolIds =
  | 'rgroup-label'
  | 'rgroup-fragment'
  | 'rgroup-attpoints'
  // bonds
  | 'bond-single'
  | 'bond-double'
  | 'bond-triple'
  | 'bond-any'
  | 'bond-aromatic'
  | 'bond-singledouble'
  | 'bond-singlearomatic'
  | 'bond-doublearomatic'
  | 'bond-dative'
  | 'bond-hydrogen'
  | 'bond-up'
  | 'bond-down'
  | 'bond-updown'
  | 'bond-crossed'
  // reactions
  | 'reaction-map'
  | 'reaction-unmap'
  | 'reaction-automap'
  // shapes
  | 'shape-ellipse'
  | 'shape-rectangle'
  | 'shape-line'
  // select
  | 'select-rectangle'
  | 'select-lasso'
  | 'select-fragment'
  // rotate
  | 'transform-rotate'
  | 'transform-flip-h'
  | 'transform-flip-v'
  // arrows
  | 'reaction-arrow-open-angle'
  | 'reaction-arrow-filled-triangle'
  | 'reaction-arrow-filled-bow'
  | 'reaction-arrow-dashed-open-angle'
  | 'reaction-arrow-failed'
  | 'reaction-arrow-both-ends-filled-triangle'
  | 'reaction-arrow-equilibrium-filled-half-bow'
  | 'reaction-arrow-equilibrium-filled-triangle'
  | 'reaction-arrow-equilibrium-open-angle'
  | 'reaction-arrow-unbalanced-equilibrium-filled-half-bow'
  | 'reaction-arrow-unbalanced-equilibrium-open-half-angle'
  | 'reaction-arrow-unbalanced-equilibrium-large-filled-half-bow'
  | 'reaction-arrow-unbalanced-equilibrium-filled-half-triangle'
  | 'reaction-arrow-elliptical-arc-arrow-filled-bow'
  | 'reaction-arrow-elliptical-arc-arrow-filled-triangle'
  | 'reaction-arrow-elliptical-arc-arrow-open-angle'
  | 'reaction-arrow-elliptical-arc-arrow-open-half-angle';
