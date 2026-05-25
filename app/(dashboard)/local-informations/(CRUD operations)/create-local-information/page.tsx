"use client"

import React from 'react'
import AddLocalInfoDrawer from '@/components/_localInfo/AddLocalInfoDrawer'
import useLocalInfo from "@/hooks/useLocalInfo";

function AddLocalInformation() {
    const localInfoHook = useLocalInfo();
  return (
    <div className=''>
      <AddLocalInfoDrawer localInfoHook={localInfoHook}/>
    </div>
  )
}

export default AddLocalInformation