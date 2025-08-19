// app/dashboard/roadmaps/[id]/page.tsx
import RoadmapTracker from '../../../../components/RoadmapTracker';

export default function RoadmapTrackerPage(props: any) {
  const { params } = (props || {}) as { params: { id: string } };
  return <RoadmapTracker roadmapId={params.id} />;
}
