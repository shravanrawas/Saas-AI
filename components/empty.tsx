import Image from 'next/image';
import React from 'react'

interface Emptyprops {
    label: string;
}

function Empty({label} : Emptyprops) {
  return (
    <div className='h-full p-15 flex flex-col mt-5 items-center justify-center'>
      <div className='relative h-72 w-72'>
         <Image className='h-60 w-60' src='/empty.svg' alt='empty' fill/>
      </div>
      <p className='text-muted-foreground text-sm text-center mt-2'>
        {label}
      </p>
    </div>
  )
}

export default Empty
