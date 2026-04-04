import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Incident } from '@/lib/supabase/reports';
import { IncidentList } from './incident-list';

interface IncidentCardProps {
  onIncidentSelect?: (incident: Incident) => void;
}

export default function IncidentsCard({ onIncidentSelect }: IncidentCardProps) {
  const handleIncidentSelect = (incident: Incident) => {
    if (incident) onIncidentSelect!(incident);
  };

  // TODO: refactor measurements to accept relative values
  return (
    <Card className="flex w-full max-h-[calc(100vh-175px)] max-w-xs">
      <CardHeader className="border-b">
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100vh-350px)]">
        <IncidentList onIncidentSelect={handleIncidentSelect} />
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Archive
        </Button>
      </CardFooter>
    </Card>
  );
}
