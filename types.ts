
export enum RiskLevel {
    Low = 'Low',
    Moderate = 'Moderate',
    High = 'High',
    Critical = 'Critical',
}

export interface RiskData {
    type: 'Flood' | 'Storm' | 'Earthquake' | 'Heatwave';
    emoji: string;
    current: {
        level: RiskLevel;
        trend: 'up' | 'down' | 'stable';
    };
    predicted: {
        level: RiskLevel;
        trend: 'up' | 'down' | 'stable';
    };
}

export interface WeatherData {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
}

export interface AnalyticsData {
    totalAlerts: number;
    averageSeverity: RiskLevel;
    frequentType: string;
    frequency: { name: string; alerts: number }[];
    byType: { name: string; value: number }[];
    bySeverity: { name: RiskLevel; value: number }[];
}
