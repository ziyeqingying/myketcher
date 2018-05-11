/****************************************************************************
 * Copyright 2018 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/

import Vec2 from '../../util/vec2';
import Pile from '../../util/pile';
import { RGroup } from '../../chem/struct';

import op from '../shared/op';
import Action from '../shared/action';

import { atomGetNeighbors, getRelSgroupsBySelection } from './utils';
import { fromRGroupFragment, fromUpdateIfThen } from './rgroup';

export function fromMultipleMove(restruct, lists, d) {
	d = new Vec2(d);

	const action = new Action();
	const struct = restruct.molecule;
	const loops = new Pile();
	const atomsToInvalidate = new Pile();

	if (lists.atoms) {
		const atomSet = new Pile(lists.atoms);
		const bondlist = [];

		restruct.bonds.forEach((bond, bid) => {
			if (atomSet.has(bond.b.begin) && atomSet.has(bond.b.end)) {
				bondlist.push(bid);
				// add all adjacent loops
				// those that are not completely inside the structure will get redrawn anyway
				['hb1', 'hb2'].forEach((hb) => {
					const loop = struct.halfBonds.get(bond.b[hb]).loop;
					if (loop >= 0)
						loops.add(loop);
				});
				return;
			}

			if (atomSet.has(bond.b.begin)) {
				atomsToInvalidate.add(bond.b.begin);
				return;
			}

			if (atomSet.has(bond.b.end))
				atomsToInvalidate.add(bond.b.end);
		});

		bondlist.forEach((bond) => {
			action.addOp(new op.BondMove(bond, d));
		});

		loops.forEach((loopId) => {
			if (restruct.reloops.get(loopId) && restruct.reloops.get(loopId).visel) // hack
				action.addOp(new op.LoopMove(loopId, d));
		});

		lists.atoms.forEach((aid) => {
			action.addOp(new op.AtomMove(aid, d, !atomsToInvalidate.has(aid)));
		});

		if (lists.sgroupData && lists.sgroupData.length === 0) {
			const sgroups = getRelSgroupsBySelection(restruct, lists.atoms);
			sgroups.forEach((sg) => {
				action.addOp(new op.SGroupDataMove(sg.id, d));
			});
		}
	}

	if (lists.rxnArrows) {
		lists.rxnArrows.forEach((rxnArrow) => {
			action.addOp(new op.RxnArrowMove(rxnArrow, d, true));
		});
	}

	if (lists.rxnPluses) {
		lists.rxnPluses.forEach((rxnPulse) => {
			action.addOp(new op.RxnPlusMove(rxnPulse, d, true));
		});
	}

	if (lists.sgroupData) {
		lists.sgroupData.forEach((sgData) => {
			action.addOp(new op.SGroupDataMove(sgData, d));
		});
	}

	if (lists.chiralFlags && struct.isChiral) {
		lists.chiralFlags.forEach(() => {
			action.addOp(new op.ChiralFlagMove(d));
		});
	}

	return action.perform(restruct);
}

/**
 * @param restruct { ReStruct }
 * @param aid { number }
 * @param frid { number }
 * @param newfrid { number }
 * @returns { Action }
 */
function processAtom(restruct, aid, frid, newfrid) {
	const action = new Action();
	const queue = [aid];
	const usedIds = new Pile(queue);
	const oldfrag = restruct.molecule.frags.get(frid);

	while (queue.length > 0) {
		const id = queue.shift();
		action.addOp(new op.AtomAttr(id, 'fragment', newfrid).perform(restruct));
		action.addOp(new op.UpdateStereoAtom(id, oldfrag.getStereoAtomMark(id)).perform(restruct));

		atomGetNeighbors(restruct, id).forEach((nei) => {
			if (restruct.molecule.atoms.get(nei.aid).fragment === frid && !usedIds.has(nei.aid)) {
				usedIds.add(nei.aid);
				queue.push(nei.aid);
			}
		});
	}

	return action;
}

/**
 * @param restruct { ReStruct }
 * @param frid { number }
 * @param rgForRemove
 * @return { Action }
 */
// TODO [RB] the thing is too tricky :) need something else in future
export function fromFragmentSplit(restruct, frid, rgForRemove = []) {
	const action = new Action();
	const rgid = RGroup.findRGroupByFragment(restruct.molecule.rgroups, frid);

	restruct.molecule.atoms.forEach((atom, aid) => {
		if (atom.fragment === frid) {
			const newfrid = action.addOp(new op.FragmentAdd().perform(restruct)).frid;

			action.mergeWith(processAtom(restruct, aid, frid, newfrid));

			if (rgid)
				action.mergeWith(fromRGroupFragment(restruct, rgid, newfrid));
		}
	});

	if (frid !== -1) {
		action.mergeWith(fromRGroupFragment(restruct, 0, frid));
		action.addOp(new op.FragmentDelete(frid).perform(restruct));
		action.mergeWith(fromUpdateIfThen(restruct, 0, rgid, rgForRemove));
	}

	if (restruct.molecule.isChiral && restruct.molecule.frags.size === 0)
		action.addOp(new op.ChiralFlagDelete().perform(restruct));

	return action;
}
