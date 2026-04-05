'use client';

import { useMemo, useState } from 'react';

import { AdvisoryComposeForm } from '@/components/advisory-compose-form';
import {
  Map,
  MapControls,
  MapPolygonDraw,
  type MapPolygonFeature,
} from '@/components/control-center/map/map';
import { Card } from '@/components/ui/card';
import type { AdvisoryTemplateItem } from '@/lib/advisories/types';

function getPolygonCoordinates(
  features: MapPolygonFeature[]
): [number, number][] | null {
  if (features.length === 0) return null;

  const latestFeature = features[features.length - 1];
  const ring = latestFeature.geometry.coordinates[0];

  if (!Array.isArray(ring) || ring.length < 4) {
    return null;
  }

  return ring as [number, number][];
}

export function AdvisoryTargetingPanel({
  templates,
}: {
  templates: AdvisoryTemplateItem[];
}) {
  const [polygonCoordinates, setPolygonCoordinates] = useState<
    [number, number][] | null
  >(null);

  const polygonJson = useMemo(() => {
    if (!polygonCoordinates) return '';
    return JSON.stringify({
      type: 'Polygon',
      coordinates: [polygonCoordinates],
    });
  }, [polygonCoordinates]);

  return (
    <>
      <AdvisoryComposeForm templates={templates} targetPolygon={polygonJson} />

      <Card className="h-80 overflow-hidden p-0">
        <Map center={[121.0533, 14.6512]} zoom={11}>
          <MapPolygonDraw
            onChange={(features) => {
              setPolygonCoordinates(getPolygonCoordinates(features));
            }}
          />
          <MapControls showZoom showCompass />
        </Map>
      </Card>
    </>
  );
}
