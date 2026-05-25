"use client";

import React from 'react'
import AddLocalInfoDrawer from '@/components/_localInfo/AddLocalInfoDrawer';
import useLocalInfo from '@/hooks/useLocalInfo';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function UpdateLocalInformation() {
  const localInfoHook = useLocalInfo();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      localInfoHook.setEditId(id);
    }
  }, [id, localInfoHook]);

  return (
    <div>
      <AddLocalInfoDrawer localInfoHook={localInfoHook} />
    </div>
  )
}

export default UpdateLocalInformation;