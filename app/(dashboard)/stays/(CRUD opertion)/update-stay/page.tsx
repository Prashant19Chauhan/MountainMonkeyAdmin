"use client";

import AddStayDrawer from '@/components/_stay/AddStayDrawer';
import useStay from '@/hooks/useStay'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

function UpdateStayPage() {
    const searchParams = useSearchParams();
    const stayId = searchParams.get('stayId');

    const stayHook = useStay();

    const {setEditId} = stayHook;

    useEffect(()=>{  
        if(!stayId){
            return
        }
        setEditId(stayId)
    },[stayId, setEditId])
    
  return (
    <>
        <AddStayDrawer stayHook={stayHook}/>
    </>
  )
}

export default UpdateStayPage