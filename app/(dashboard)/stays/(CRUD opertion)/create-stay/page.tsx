"use client"

import React from 'react'
import AddStayDrawer from '@/components/_stay/AddStayDrawer'
import useStay from '@/hooks/useStay'

function CreateStay() {
  const stayHook = useStay();
  return (
    <div>
        <AddStayDrawer stayHook={stayHook}/>
    </div>
  )
}

export default CreateStay