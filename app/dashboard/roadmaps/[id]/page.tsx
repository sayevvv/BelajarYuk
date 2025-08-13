// app/dashboard/roadmaps/[id]/page.tsx
import RoadmapTracker from '../../../../components/RoadmapTracker';

export default function RoadmapTrackerPage({ params }: { params: { id: string } }) {
  return <RoadmapTracker roadmapId={params.id} />;
}
