'use client'

import {Crisp} from 'crisp-sdk-web'
import { useEffect } from 'react'

export const Crispchat = () => {
     useEffect(() => {
       Crisp.configure('b3c07efb-20b2-483f-bc66-37fc32e0ad38');
     }, [])

     return null;
}