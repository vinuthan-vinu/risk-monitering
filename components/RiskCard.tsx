import React from 'react';
import { RiskData, RiskLevel } from '../types';

const RiskLevelIndicator: React.FC<{ level: RiskLevel, trend: 'up' | 'down' | 'stable' }> = ({ level, trend }) => {
    const levelInfo = {
        [RiskLevel.Low]: { color: 'text-risk-green', width: '20%' },
        [RiskLevel.Moderate]: { color: 'text-risk-yellow', width: '50%' },
        [RiskLevel.High]: { color: 'text-risk-red', width: '75%' },
        [RiskLevel.Critical]: { color: 'text-risk-critical', width: '90%' },
    };

    const trendInfo = {
        up: { icon: 'trending_up', color: 'text-risk-red' },
        down: { icon: 'arrow_downward', color: 'text-risk-green' },
        stable: { icon: 'horizontal_rule', color: 'text-risk-green' },
    };
    
    return (
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold mb-1">Current</p>
            <div className="flex items-center gap-2">
                <p className={`${levelInfo[level].color} text-sm font-bold leading-normal`}>{level}</p>
                <span className={`material-symbols-outlined text-base ${trendInfo[trend].color}`}>{trendInfo[trend].icon}</span>
            </div>
            <div className="rounded-full bg-slate-300 dark:bg-slate-700 mt-1 h-2">
                <div className={`h-2 rounded-full ${levelInfo[level].color.replace('text-', 'bg-')}`} style={{ width: levelInfo[level].width }}></div>
            </div>
        </div>
    );
};

const RiskCard: React.FC<{ risk: RiskData }> = ({ risk }) => {
    return (
        <div className="flex flex-col gap-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
                <p className="text-3xl">{risk.emoji}</p>
                <p className="text-slate-800 dark:text-white text-base font-medium flex-1">{risk.type} Risk</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <RiskLevelIndicator level={risk.current.level} trend={risk.current.trend} />
                 <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold mb-1">Predicted</p>
                     <div className="flex items-center gap-2">
                         <p className={`text-sm font-bold leading-normal ${ {
                             [RiskLevel.Low]: 'text-risk-green',
                             [RiskLevel.Moderate]: 'text-risk-yellow',
                             [RiskLevel.High]: 'text-risk-red',
                             [RiskLevel.Critical]: 'text-risk-critical',
                         }[risk.predicted.level]}`}>{risk.predicted.level}</p>
                         <span className={`material-symbols-outlined text-base ${ {
                             up: 'text-risk-red',
                             down: 'text-risk-green',
                             stable: 'text-risk-green',
                         }[risk.predicted.trend]}`}>{ {
                             up: 'trending_up',
                             down: 'arrow_downward',
                             stable: 'horizontal_rule',
                         }[risk.predicted.trend]}</span>
                     </div>
                     <div className="rounded-full bg-slate-300 dark:bg-slate-700 mt-1 h-2">
                         <div className={`h-2 rounded-full ${ {
                             [RiskLevel.Low]: 'bg-risk-green',
                             [RiskLevel.Moderate]: 'bg-risk-yellow',
                             [RiskLevel.High]: 'bg-risk-red',
                             [RiskLevel.Critical]: 'bg-risk-critical',
                         }[risk.predicted.level]}`} style={{ width: {
                             [RiskLevel.Low]: '25%',
                             [RiskLevel.Moderate]: '45%',
                             [RiskLevel.High]: '70%',
                             [RiskLevel.Critical]: '90%',
                         }[risk.predicted.level]}}></div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default RiskCard;