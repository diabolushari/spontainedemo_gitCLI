interface Props {
  definition: JSONDefinition
  setDefinition: (definition: JSONDefinition) => void
}

export interface JSONDefinition {
  id: number
  name: string
  type: string
  children: JSONDefinition[]
}

export default function SetDataStructure({ definition }: Readonly<Props>) {
  return (
    <div className='flex flex-col'>
      <></>
    </div>
  )
}
