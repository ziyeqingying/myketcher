export const testGraph = {
	atoms: [
		{
			label: 'C',
			location: [1, 1.5, 0],
			alias: 'superatom',
			rgroups: [1, 23, 30],
			isotope: 5
		},
		{
			label: 'C',
			location: [1, 1.5, 0],
			charge: 50,
			explicitValence: 2,
			radical: 2,
			attachmentPoints: 3
		},
		{
			label: 'C',
			location: [1, 2, 0],
			stereoParity: 1,
			weight: 100,
			substitutionCount: -2,
			unsaturatedAtom: true,
			hCount: 3,
			mapping: 5,
			invRet: 1,
			exactChangeFlag: true
		}
	],
	bonds: [
		{
			type: 1,
			atoms: [0, 1]
		},
		{
			type: 1,
			atoms: [1, 2]
		}
	],
	root: {
		nodes: [
			{
				type: 'arrow',
				location: [0, 0, 0]
			},
			{
				$ref: 'mol0'
			}
		]
	}
};
