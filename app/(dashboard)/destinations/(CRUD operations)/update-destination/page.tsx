'use client'

import UpdateDestinationForm from "@/components/_destination/createAndUpdateDestinationForm"
import useDestination from "@/hooks/useDestination";
import { useSearchParams } from "next/navigation"
import { useEffect } from "react";

export default function UpdateDestinationPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const destinationHook = useDestination();
  
  const { setDestinationId } = destinationHook;
  
  useEffect(()=>{

    if(!id){
      return
    }

    setDestinationId(id);
  }, [id]);

  return (
    <UpdateDestinationForm destinationHook={destinationHook} />
  )
}       