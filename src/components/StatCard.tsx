import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  gradient?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className, gradient }: StatCardProps) {
  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-300 border-0",
      gradient || "bg-gradient-to-br from-card to-card/50",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            {trend && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                <span>{Math.abs(trend.value)}%</span>
                <span className="text-muted-foreground ml-1">vs mês anterior</span>
              </div>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-lg",
            gradient ? "bg-white/10" : "bg-primary/10"
          )}>
            <Icon className={cn(
              "w-6 h-6",
              gradient ? "text-white" : "text-primary"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
