export interface HealthFactor {
  value: number;
  name: string;
  description: string;
}

export const healthChartData: HealthFactor[] = [
  {
    value: 150,
    name: 'medical-dashboard.health.lifestyle.title',
    description: 'example description 1',
  },
  {
    value: 20,
    name: 'medical-dashboard.health.ecology.title',
    description: 'example description 2',
  },
  {
    value: 20,
    name: 'medical-dashboard.health.genetics.title',
    description: 'medical-dashboard.health.genetics.description',
  },
  {
    value: 10,
    name: 'medical-dashboard.health.medicine.title',
    description: 'medical-dashboard.health.medicine.description',
  },
  {
    value: 150,
    name: "AA",
    description: 'medical-dashboard.health.medicine.description',
  },
];
