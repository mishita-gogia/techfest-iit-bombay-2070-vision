export interface TimelineItem {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  specifications: string[];
  techTerm: string;
}

export interface PlanetData {
  id: string;
  name: string;
  description: string;
  sector: string;
  color: string;
  emissive: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  techHighlights: string[];
  metrics: { label: string; value: string };
}

export interface LabObject {
  id: string;
  name: string;
  description: string;
  modelType: "robotArm" | "holographicScreen" | "aiCore";
  coordinates: [number, number, number];
  color: string;
  specs: string[];
}

export interface GlobalImpactNode {
  name: string;
  lat: number;
  lng: number;
  type: "student" | "innovator" | "researcher" | "startup";
  connections: string[];
  value: string;
}

export interface AppMetric {
  value: number;
  suffix: string;
  label: string;
}
