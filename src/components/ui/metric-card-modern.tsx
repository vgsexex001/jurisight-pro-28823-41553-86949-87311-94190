import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface MetricCardModernProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  gradient?: string;
  subtitle?: string;
  className?: string;
}

export function MetricCardModern({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  gradient,
  subtitle,
  className 
}: MetricCardModernProps) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl bg-white border border-border p-6 transition-all duration-300 hover:shadow-xl hover:border-border hover:-translate-y-1",
      className
    )}>
      {/* Background Gradient */}
      {gradient && (
        <>
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: gradient }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
              trend === 'up' ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-muted">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Value */}
        <div className="mb-3">
          <p className="text-4xl font-bold text-foreground tracking-tight">
            {value}
          </p>
        </div>

        {/* Change Indicator */}
        {change && trend && (
          <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold",
            trend === 'up' 
              ? "bg-success/10 text-success" 
              : "bg-muted text-muted-foreground"
          )}>
            {trend === 'up' ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Decorative Element */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br from-muted to-muted/50 opacity-50 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
