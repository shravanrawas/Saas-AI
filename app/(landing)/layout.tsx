import React from 'react'

function Landinglayout({children}: {children : React.ReactNode}) {
  return (
      <main className='h-full bg-[#111827] overflow-auto w-full'>
          {children}
      </main>
  )
}

export default Landinglayout
