import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Pane,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

function FitMapToPoints({ center, mapPoints }) {
  const map = useMap();

  useEffect(() => {
    const points = [
      ...(center ? [[center.lat, center.lng]] : []),
      ...mapPoints.map((point) => [point.lat, point.lng]),
    ];

    if (points.length > 1) {
      map.fitBounds(points, { padding: [36, 36] });
    } else if (points.length === 1) {
      map.setView(points[0], 14);
    }
  }, [center, map, mapPoints]);

  return null;
}

export default function ItineraryMap({ center, mapPoints = [] }) {
  const mapCenter = center
    ? [center.lat, center.lng]
    : mapPoints.length > 0
      ? [mapPoints[0].lat, mapPoints[0].lng]
      : [20.5937, 78.9629];
  const routeLine = mapPoints.map((point) => [point.lat, point.lng]);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
          Anchor
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1">
          <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-300" />
          Planned stops
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1">
          <span className="block h-[2px] w-4 rounded-full bg-emerald-300" />
          Route order
        </div>
      </div>

      <div className="h-[26rem]">
        <MapContainer center={mapCenter} zoom={14} scrollWheelZoom className="h-full w-full">
          <FitMapToPoints center={center} mapPoints={mapPoints} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Pane name="routes" style={{ zIndex: 450 }} />
        {routeLine.length > 1 ? (
          <Polyline
            positions={routeLine}
            pane="routes"
            pathOptions={{ color: "#6ee7b7", weight: 4, opacity: 0.8, dashArray: "8 8" }}
          />
        ) : null}

        {center ? (
          <CircleMarker
            center={[center.lat, center.lng]}
            radius={11}
            pathOptions={{ color: "#22d3ee", fillColor: "#22d3ee", fillOpacity: 0.9 }}
          >
            <Tooltip permanent direction="bottom" offset={[0, 16]}>
              <span className="text-xs font-semibold">Anchor</span>
            </Tooltip>
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{center.label || "Your anchor location"}</p>
                <p>
                  {Number(center.lat).toFixed(4)}, {Number(center.lng).toFixed(4)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ) : null}

        {mapPoints.map((point) => (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            radius={12}
            pathOptions={{ color: "#f472b6", fillColor: "#f472b6", fillOpacity: 0.85 }}
          >
            <Tooltip permanent direction="top" offset={[0, -12]}>
              <span className="text-xs font-semibold">{point.order}</span>
            </Tooltip>
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{point.title}</p>
                <p>Stop {point.order}</p>
                <p>
                  {point.startTime} - {point.endTime}
                </p>
                <p>{point.reason}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        </MapContainer>
      </div>
    </div>
  );
}
