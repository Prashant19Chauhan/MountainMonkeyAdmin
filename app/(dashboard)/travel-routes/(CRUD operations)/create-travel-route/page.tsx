'use client'

import TravelRouteForm from "@/components/_travelRoute/TravelRouteForm"
import useTravelRoute from "@/hooks/useTravelRoute";

export default function CreateTravelRoutePage() {
  const travelRouteHook = useTravelRoute();
  return (
    <TravelRouteForm isUpdate={false} travelRouteHook={travelRouteHook} />
  )
}
