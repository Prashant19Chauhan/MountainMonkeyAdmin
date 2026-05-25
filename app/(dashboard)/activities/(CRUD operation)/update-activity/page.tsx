'use client'
import AddActivityDrawer from '@/components/_activity/AddActivityDrawer'
import useActivity from '@/hooks/useActivity'
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function UpdateActivity() {
  const activityHook = useActivity();

  const { setEditActivityId } = activityHook;
  const searchParams = useSearchParams();

  const activityId = searchParams.get("activityId");

  useEffect(() => {
    if (activityId) {
      setEditActivityId(activityId);
    }
  }, [activityId, setEditActivityId]);

  return (
    <div>
      <AddActivityDrawer activityHook={activityHook} />
    </div>
  )
}

export default UpdateActivity