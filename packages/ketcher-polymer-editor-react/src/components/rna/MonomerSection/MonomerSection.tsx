/****************************************************************************
 * Copyright 2021 EPAM Systems
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
import { Switcher } from 'components/rna/Switcher'
import { useEffect, useState } from 'react'
import { Group, MonomerList } from 'components/monomerLibrary'

type selectedMonomersType = {
  Sugar: string
  Nucleobase: string
  Phosphate: string
}

interface MonomerSectionProps {
  selectItem: (item) => void
  items: {
    Nucleotide: Array<Group>
    Nucleobase: Array<Group>
    Sugar: Array<Group>
    Phosphate: Array<Group>
  }
}

const MonomerSection = ({ selectItem, items }: MonomerSectionProps) => {
  const getInitialMonomers = () => {
    return items.Nucleotide[0].groupItems[0].monomers as selectedMonomersType
  }

  const selectMonomerType = (type) => {
    if (type === 'reset') {
      setActiveMonomerType('Nucleotide')
      setSelectedMonomers(getInitialMonomers())
    } else {
      setActiveMonomerType(type)
    }
  }

  const selectMonomer = (item) => {
    if (activeMonomerType === 'Nucleotide') {
      setSelectedMonomers(item.monomers)
    } else {
      setSelectedMonomers((prevState) => {
        return {
          ...prevState,
          [activeMonomerType]: item.label
        }
      })
    }
  }

  const [selectedMonomers, setSelectedMonomers] =
    useState<selectedMonomersType>(getInitialMonomers())
  const [activeMonomerType, setActiveMonomerType] = useState('Nucleotide')
  useEffect(() => {
    const matchMonomerByType =
      activeMonomerType === 'Nucleotide'
        ? selectedMonomers
        : selectedMonomers[activeMonomerType]
    selectItem(matchMonomerByType)
  }, [selectItem, activeMonomerType, selectedMonomers])

  return (
    <>
      <Switcher
        selectedMonomers={Object.values(selectedMonomers)}
        setActiveMonomerType={selectMonomerType}
      />
      <MonomerList
        list={items[activeMonomerType]}
        onItemClick={selectMonomer}
      />
    </>
  )
}
export { MonomerSection as RnaMonomerSection }
