import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Zap } from 'lucide-react';

interface SpendingTrendProps {
  currentMonth: number;
  previousMonth: number;
  trend: 'up' | 'down' | 'neutral';
}

export const SpendingTrend: React.FC<SpendingTrendProps> = ({ 
  currentMonth, 
  previousMonth, 
  trend 
}) => {
  const percentageChange = previousMonth > 0 
    ? ((currentMonth - previousMonth) / previousMonth) * 100 
    : 0;

  return (
    <div className="rounded-xl border border-border bg-gradient-to-br from-card to-secondary/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Spending Trend</h3>
        {trend === 'up' && <TrendingUp className="h-5 w-5 text-amber-500" />}
        {trend === 'down' && <TrendingDown className="h-5 w-5 text-emerald-500" />}
        {trend === 'neutral' && <Zap className="h-5 w-5 text-primary" />}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">₹{currentMonth}</span>
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-amber-600 dark:text-amber-400' : 
              trend === 'down' ? 'text-emerald-600 dark:text-emerald-400' : 
              'text-muted-foreground'
            }`}>
              {trend === 'up' && `+${percentageChange.toFixed(1)}%`}
              {trend === 'down' && `-${Math.abs(percentageChange).toFixed(1)}%`}
              {trend === 'neutral' && 'No change'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">This month</p>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Previous month</span>
            <span className="font-medium text-foreground">₹{previousMonth}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <div className="rounded-lg bg-primary/10 p-3">
            <p className="text-xs text-muted-foreground">Avg. Daily</p>
            <p className="text-lg font-bold text-primary">₹{(currentMonth / 30).toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-accent/10 p-3">
            <p className="text-xs text-muted-foreground">Projected</p>
            <p className="text-lg font-bold text-accent">₹{(currentMonth * 1.1).toFixed(0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ServiceBreakdownProps {
  services: Array<{
    name: string;
    amount: number;
    color: string;
    icon: React.ReactNode;
  }>;
}

export const ServiceBreakdown: React.FC<ServiceBreakdownProps> = ({ services }) => {
  const total = services.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Service Breakdown</h3>
      
      <div className="space-y-4">
        {services.map((service, index) => {
          const percentage = total > 0 ? (service.amount / total) * 100 : 0;
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${service.color}`}>
                    {service.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground">{service.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">₹{service.amount}</p>
                  <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${service.color.replace('bg-', 'bg-').split('/')[0]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {total === 0 && (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No service usage yet</p>
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Spending</span>
            <span className="text-xl font-bold text-foreground">₹{total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface MiniStatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  colorClass?: string;
}

export const MiniStatCard: React.FC<MiniStatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  colorClass = 'text-primary' 
}) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</span>
        <div className={colorClass}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {change !== undefined && (
          <span className={`text-xs font-medium ${
            change > 0 ? 'text-emerald-600 dark:text-emerald-400' : 
            change < 0 ? 'text-red-600 dark:text-red-400' : 
            'text-muted-foreground'
          }`}>
            {change > 0 && '+'}
            {change}%
          </span>
        )}
      </div>
    </div>
  );
};

export default { SpendingTrend, ServiceBreakdown, MiniStatCard };
