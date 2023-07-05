/* eslint-disable @typescript-eslint/no-empty-function */
import { ReAtom, ReBond } from 'application/render'

import { Pool } from 'domain/entities'

const mockAtoms = [
  {
    aam: 0,
    alias: null,
    atomList: null,
    attpnt: null,
    badConn: false,
    charge: 0,
    exactChangeFlag: false,
    explicitValence: -1,
    fragment: 0,
    hCount: 0,
    hasImplicitH: undefined,
    implicitH: 0,
    invRet: 0,
    isotope: 0,
    label: 'C',
    neighbors: [14, 0, 11],
    pp: { x: 8.9, y: 6.324985332956878, z: 0 },
    pseudo: '',
    radical: 0,
    rglabel: null,
    ringBondCount: 0,
    rxnFragmentType: -1,
    sgs: {},
    stereoLabel: null,
    stereoParity: 0,
    substitutionCount: 0,
    unsaturatedAtom: 0,
    valence: 4
  },
  {
    aam: 0,
    alias: null,
    atomList: null,
    attpnt: null,
    badConn: false,
    charge: 0,
    exactChangeFlag: false,
    explicitValence: -1,
    fragment: 0,
    hCount: 0,
    hasImplicitH: undefined,
    implicitH: 0,
    invRet: 0,
    isotope: 0,
    label: 'C',
    neighbors: [14, 0, 11],
    pp: { x: 8.9, y: 6.324985332956878, z: 0 },
    pseudo: '',
    radical: 0,
    rglabel: null,
    ringBondCount: 0,
    rxnFragmentType: -1,
    sgs: {},
    stereoLabel: null,
    stereoParity: 0,
    substitutionCount: 0,
    unsaturatedAtom: 0,
    valence: 4
  },
  {
    aam: 0,
    alias: null,
    atomList: null,
    attpnt: null,
    badConn: false,
    charge: 0,
    exactChangeFlag: false,
    explicitValence: -1,
    fragment: 0,
    hCount: 0,
    hasImplicitH: undefined,
    implicitH: 1,
    invRet: 0,
    isotope: 0,
    label: 'C',
    neighbors: [3, 4],
    pp: { x: 9.766012701659344, y: 7.825007333521562, z: 0 },
    pseudo: '',
    radical: 0,
    rglabel: null,
    ringBondCount: 0,
    rxnFragmentType: -1,
    sgs: {},
    stereoLabel: null,
    stereoParity: 0,
    substitutionCount: 0,
    unsaturatedAtom: 0,
    valence: 4
  },
  {
    aam: 0,
    alias: null,
    atomList: null,
    attpnt: null,
    badConn: false,
    charge: 0,
    exactChangeFlag: false,
    explicitValence: -1,
    fragment: 0,
    hCount: 0,
    hasImplicitH: undefined,
    implicitH: 1,
    invRet: 0,
    isotope: 0,
    label: 'C',
    neighbors: [6, 5],
    pp: { x: 8.9, y: 8.325014667043122, z: 0 },
    pseudo: '',
    radical: 0,
    rglabel: null,
    ringBondCount: 0,
    rxnFragmentType: -1,
    sgs: {},
    stereoLabel: null,
    stereoParity: 0,
    substitutionCount: 0,
    unsaturatedAtom: 0,
    valence: 4
  },
  {
    aam: 0,
    alias: null,
    atomList: null,
    attpnt: null,
    badConn: false,
    charge: 0,
    exactChangeFlag: false,
    explicitValence: -1,
    fragment: 0,
    hCount: 0,
    hasImplicitH: undefined,
    implicitH: 1,
    invRet: 0,
    isotope: 0,
    label: 'C',
    neighbors: [8, 7],
    pp: { x: 8.033987298340657, y: 7.825007333521562, z: 0 },
    pseudo: '',
    radical: 0,
    rglabel: null,
    ringBondCount: 0,
    rxnFragmentType: -1,
    sgs: {},
    stereoLabel: null,
    stereoParity: 0,
    substitutionCount: 0,
    unsaturatedAtom: 0,
    valence: 4
  },
  {
    aam: 0,
    alias: null,
    atomList: null,
    attpnt: null,
    badConn: false,
    charge: 0,
    exactChangeFlag: false,
    explicitValence: -1,
    fragment: 0,
    hCount: 0,
    hasImplicitH: undefined,
    implicitH: 0,
    invRet: 0,
    isotope: 0,
    label: 'C',
    neighbors: [12, 10, 9],
    pp: { x: 8.033987298340657, y: 6.824992666478439, z: 0 },
    pseudo: '',
    radical: 0,
    rglabel: null,
    ringBondCount: 0,
    rxnFragmentType: -1,
    sgs: {},
    stereoLabel: 'abs',
    stereoParity: 1,
    substitutionCount: 0,
    unsaturatedAtom: 0,
    valence: 4
  },
  {
    aam: 0,
    alias: null,
    atomList: null,
    attpnt: null,
    badConn: false,
    charge: 0,
    exactChangeFlag: 0,
    explicitValence: -1,
    fragment: 0,
    hCount: 0,
    hasImplicitH: undefined,
    implicitH: 3,
    invRet: 0,
    isotope: 0,
    label: 'C',
    neighbors: [13],
    pp: { x: 7.167958719030767, y: 6.3249981666901975, z: 0 },
    pseudo: '',
    radical: 0,
    rglabel: null,
    ringBondCount: 0,
    rxnFragmentType: -1,
    sgs: {},
    stereoLabel: null,
    stereoParity: 0,
    substitutionCount: 0,
    unsaturatedAtom: 0,
    valence: 4
  },
  {
    aam: 0,
    alias: null,
    atomList: null,
    attpnt: null,
    badConn: false,
    charge: 0,
    exactChangeFlag: 0,
    explicitValence: -1,
    fragment: 0,
    hCount: 0,
    hasImplicitH: undefined,
    implicitH: 3,
    invRet: 0,
    isotope: 0,
    label: 'C',
    neighbors: [15],
    pp: { x: 8.9, y: 5.324985332956878, z: 0 },
    pseudo: '',
    radical: 0,
    rglabel: null,
    ringBondCount: 0,
    rxnFragmentType: -1,
    sgs: {},
    stereoLabel: null,
    stereoParity: 0,
    substitutionCount: 0,
    unsaturatedAtom: 0,
    valence: 4
  }
]

const mockBonds = [
  {
    angle: 30.00072778082736,
    begin: 0,
    center: { x: 9.333006350829672, y: 6.574988999717658, z: 0 },
    end: 1,
    hb1: 0,
    hb2: 1,
    len: 39.99970665913751,
    reactingCenterStatus: 0,
    sa: 15.999853329568754,
    sb: 10,
    stereo: 0,
    topology: 0,
    type: 1,
    xxx: '   '
  },
  {
    angle: 90,
    begin: 1,
    center: { x: 9.766012701659344, y: 7.325, z: 0 },
    end: 2,
    hb1: 2,
    hb2: 3,
    len: 40.00058668172494,
    reactingCenterStatus: 0,
    sa: 16.00029334086247,
    sb: 10,
    stereo: 0,
    topology: 0,
    type: 2,
    xxx: '   '
  },
  {
    angle: 149.99927221917264,
    begin: 2,
    center: { x: 9.333006350829672, y: 8.075011000282341, z: 0 },
    end: 3,
    hb1: 4,
    hb2: 5,
    len: 39.99970665913751,
    reactingCenterStatus: 0,
    sa: 15.999853329568754,
    sb: 10,
    stereo: 0,
    topology: 0,
    type: 1,
    xxx: '   '
  },
  {
    angle: -149.99927221917264,
    begin: 3,
    center: { x: 8.466993649170329, y: 8.075011000282341, z: 0 },
    end: 4,
    hb1: 6,
    hb2: 7,
    len: 39.99970665913751,
    reactingCenterStatus: 0,
    sa: 15.999853329568754,
    sb: 10,
    stereo: 0,
    topology: 0,
    type: 2,
    xxx: '   '
  },
  {
    angle: -90,
    begin: 4,
    center: { x: 8.033987298340657, y: 7.325, z: 0 },
    end: 5,
    hb1: 8,
    hb2: 9,
    len: 40.00058668172494,
    reactingCenterStatus: 0,
    sa: 16.00029334086247,
    sb: 10,
    stereo: 0,
    topology: 0,
    type: 1,
    xxx: '   '
  },
  {
    angle: -30.00072778082736,
    begin: 5,
    center: { x: 8.466993649170329, y: 6.574988999717658, z: 0 },
    end: 0,
    hb1: 10,
    hb2: 11,
    len: 39.99970665913751,
    reactingCenterStatus: 0,
    sa: 15.999853329568754,
    sb: 10,
    stereo: 0,
    topology: 0,
    type: 2,
    xxx: '   '
  },
  {
    angle: -150.00036389041367,
    begin: 5,
    center: { x: 7.6009730086857115, y: 6.5749954165843185, z: 0 },
    end: 6,
    hb1: 12,
    hb2: 13,
    len: 39.99999999999997,
    reactingCenterStatus: 0,
    sa: 15.999999999999986,
    sb: 10,
    stereo: 1,
    topology: 0,
    type: 1,
    xxx: ''
  },
  {
    angle: 0,
    begin: 0,
    center: { x: 0, y: 0, z: 0 },
    end: 7,
    hb1: 14,
    hb2: 15,
    len: 0,
    reactingCenterStatus: 0,
    sa: 0,
    sb: 0,
    stereo: 0,
    topology: 0,
    type: 1,
    xxx: ''
  }
]

const atoms = new Pool()
mockAtoms.forEach((atom, key) => atoms.set(key, atom))

const bonds = new Pool()
mockBonds.forEach((bond, key) => bonds.set(key, bond))

const mockHalfBonds = [
  {
    begin: 0,
    end: 1,
    bid: 0,
    dir: {
      x: 0.8660190526287391,
      y: 0.5000110003630132,
      z: 0
    },
    norm: {
      x: -0.5000110003630132,
      y: 0.8660190526287391,
      z: 0
    },
    ang: 0.5236114777699692,
    p: {
      x: 356,
      y: 252.99941331827512,
      z: 0
    },
    loop: -2,
    contra: 1,
    next: 2,
    leftSin: 0,
    leftCos: 0,
    leftNeighbor: 14,
    rightSin: 0.8660381056766496,
    rightCos: -0.4999779990319577,
    rightNeighbor: 11
  },
  {
    begin: 1,
    end: 0,
    bid: 0,
    dir: {
      x: -0.8660190526287391,
      y: -0.5000110003630132,
      z: 0
    },
    norm: {
      x: 0.5000110003630132,
      y: -0.8660190526287391,
      z: 0
    },
    ang: -2.617981175819824,
    p: {
      x: 390.64050806637374,
      y: 272.99970665913753,
      z: 0
    },
    loop: -1,
    contra: 0,
    next: 11,
    leftSin: 0.8660190526287391,
    leftCos: -0.5000110003630132,
    leftNeighbor: 2,
    rightSin: -0.8660190526287391,
    rightCos: -0.5000110003630132,
    rightNeighbor: 2
  },
  {
    begin: 1,
    end: 2,
    bid: 1,
    dir: {
      x: 0,
      y: 1,
      z: 0
    },
    norm: {
      x: -1,
      y: 0,
      z: 0
    },
    ang: 1.5707963267948966,
    p: {
      x: 390.64050806637374,
      y: 272.99970665913753,
      z: 0
    },
    loop: -2,
    contra: 3,
    next: 4,
    leftSin: -0.8660190526287391,
    leftCos: -0.5000110003630132,
    leftNeighbor: 1,
    rightSin: 0.8660190526287391,
    rightCos: -0.5000110003630132,
    rightNeighbor: 1
  },
  {
    begin: 2,
    end: 1,
    bid: 1,
    dir: {
      x: 0,
      y: -1,
      z: 0
    },
    norm: {
      x: 1,
      y: 0,
      z: 0
    },
    ang: -1.5707963267948966,
    p: {
      x: 390.64050806637374,
      y: 313.00029334086247,
      z: 0
    },
    loop: -1,
    contra: 2,
    next: 1,
    leftSin: 0.8660190526287391,
    leftCos: -0.5000110003630132,
    leftNeighbor: 4,
    rightSin: -0.8660190526287391,
    rightCos: -0.5000110003630132,
    rightNeighbor: 4
  },
  {
    begin: 2,
    end: 3,
    bid: 2,
    dir: {
      x: -0.8660190526287391,
      y: 0.5000110003630132,
      z: 0
    },
    norm: {
      x: -0.5000110003630132,
      y: -0.8660190526287391,
      z: 0
    },
    ang: 2.617981175819824,
    p: {
      x: 390.64050806637374,
      y: 313.00029334086247,
      z: 0
    },
    loop: -2,
    contra: 5,
    next: 6,
    leftSin: -0.8660190526287391,
    leftCos: -0.5000110003630132,
    leftNeighbor: 3,
    rightSin: 0.8660190526287391,
    rightCos: -0.5000110003630132,
    rightNeighbor: 3
  },
  {
    begin: 3,
    end: 2,
    bid: 2,
    dir: {
      x: 0.8660190526287391,
      y: -0.5000110003630132,
      z: 0
    },
    norm: {
      x: 0.5000110003630132,
      y: 0.8660190526287391,
      z: 0
    },
    ang: -0.5236114777699692,
    p: {
      x: 356,
      y: 333.0005866817249,
      z: 0
    },
    loop: -1,
    contra: 4,
    next: 3,
    leftSin: 0.8660381056766496,
    leftCos: -0.4999779990319577,
    leftNeighbor: 6,
    rightSin: -0.8660381056766496,
    rightCos: -0.4999779990319577,
    rightNeighbor: 6
  },
  {
    begin: 3,
    end: 4,
    bid: 3,
    dir: {
      x: -0.8660190526287391,
      y: -0.5000110003630132,
      z: 0
    },
    norm: {
      x: 0.5000110003630132,
      y: -0.8660190526287391,
      z: 0
    },
    ang: -2.617981175819824,
    p: {
      x: 356,
      y: 333.0005866817249,
      z: 0
    },
    loop: -2,
    contra: 7,
    next: 8,
    leftSin: -0.8660381056766496,
    leftCos: -0.4999779990319577,
    leftNeighbor: 5,
    rightSin: 0.8660381056766496,
    rightCos: -0.4999779990319577,
    rightNeighbor: 5
  },
  {
    begin: 4,
    end: 3,
    bid: 3,
    dir: {
      x: 0.8660190526287391,
      y: 0.5000110003630132,
      z: 0
    },
    norm: {
      x: -0.5000110003630132,
      y: 0.8660190526287391,
      z: 0
    },
    ang: 0.5236114777699692,
    p: {
      x: 321.35949193362626,
      y: 313.00029334086247,
      z: 0
    },
    loop: -1,
    contra: 6,
    next: 5,
    leftSin: 0.8660190526287391,
    leftCos: -0.5000110003630132,
    leftNeighbor: 8,
    rightSin: -0.8660190526287391,
    rightCos: -0.5000110003630132,
    rightNeighbor: 8
  }
]
const halfBonds = new Map()
mockHalfBonds.forEach((halfBond, key) => halfBonds.set(key, halfBond))

const mockFrags = [
  {
    stereoAtoms: [5],
    stereoFlagPosition: undefined,
    enhancedStereoFlag: 'ABS',
    updateStereoFlag() {}
  }
]
const frags = new Map()
mockFrags.forEach((frag, key) => frags.set(key, frag))

const molecule = {
  atoms,
  bonds,
  frags,
  halfBonds,
  isReaction: false,
  loops: { nextId: 0 },
  name: '',
  rgroups: { nextId: 0 },
  rxnArrows: new Map(),
  rxnPluses: { nextId: 0 },
  sGroupForest: {
    parent: {},
    children: {
      key: -1,
      value: []
    },
    atomSets: {}
  },
  sgroups: { nextId: 0 },
  simpleObjects: { nextId: 0 },
  texts: { nextId: 0 },
  atomGetNeighbors() {
    return [
      {
        aid: 1,
        bid: 2
      },
      {
        aid: 3,
        bid: 4
      }
    ]
  },
  findBondId() {
    return 6
  },
  atomSetPos() {},
  bondInitHalfBonds() {},
  atomAddNeighbor() {},
  setImplicitHydrogen() {}
}

export const restruct = {
  atoms: new Map(),
  bonds: new Map(),
  molecule,
  connectedComponents: new Set(),
  render: {
    options: {
      stereoLabelStyle: 'Iupac'
    }
  },
  markAtom() {},
  markBond() {},
  markItem() {}
}

molecule.atoms.forEach((atom, aid) => {
  restruct.atoms.set(aid, new ReAtom(atom))
})
molecule.bonds.forEach((bond, bid) => {
  restruct.bonds.set(bid, new ReBond(bond))
})

export const singleBond = { type: 1, stereo: 0 }
