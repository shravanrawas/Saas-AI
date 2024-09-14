'use client';

import { useEffect, useState } from "react";
import Promodal from "./pro-modal";

export const Modalprovider = () => {
    const [ismounted, setismonted] = useState(false);

    useEffect(() => {
      setismonted(true);
    }, [])    

    if(!ismounted){
       return null;
    }

    return (
        <>
          <Promodal/>
        </>
    )

} 