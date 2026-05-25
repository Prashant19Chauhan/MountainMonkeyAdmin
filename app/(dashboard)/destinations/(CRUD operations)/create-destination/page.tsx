'use client'

import CreateDestinationForm from "@/components/_destination/createAndUpdateDestinationForm"
import useDestination from "@/hooks/useDestination";

export default function CreateDestinationPage() {
  const destinationHook = useDestination();
  return (
    <CreateDestinationForm destinationHook={destinationHook}/>
  )
}