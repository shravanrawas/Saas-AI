import { Landingcontent } from '@/components/landingcontent'
import { Landinghero } from '@/components/landinghero'
import Landingnavbar from '@/components/landingnavbar'
import React from 'react'

function Landingpage() {
  return (
    <div className='h-full'>
       <Landingnavbar/>
       <Landinghero/>
       <Landingcontent/>
    </div>
  )
}

export default Landingpage
