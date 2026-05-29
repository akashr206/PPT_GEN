"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function OutlineReview({ isUpdating, pptData }) {
  return (
    <div className="flex-1 pb-10">
      {isUpdating ? (
        <div className="space-y-4 animate-pulse select-none pb-16 relative">
          {[1, 2, 3].map((item, idx) => (
            <Card key={idx} className="rounded-none first-of-type:rounded-t-lg last-of-type:rounded-b-lg border-border bg-card/50">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Skeleton className="w-8 h-8 rounded-lg bg-muted/30 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3 bg-muted/40 rounded-md" />
                  <Skeleton className="h-3.5 w-1/4 bg-muted/20 rounded-md" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pl-[3.25rem] pb-4">
                <Skeleton className="h-3.5 w-5/6 bg-muted/15 rounded-md" />
                <Skeleton className="h-3.5 w-4/5 bg-muted/10 rounded-md" />
              </CardContent>
            </Card>
          ))}
          
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-primary/95 text-primary-foreground px-3.5 py-1.5 rounded-full border border-primary/20 backdrop-blur-md z-10 shadow-lg text-xs font-semibold tracking-wide">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Updating outline...</span>
          </div>
        </div>
      ) : (
        pptData?.slides?.map((slide, idx) => (
          <Card key={idx} className="hover:bg-accent rounded-none transition-colors first-of-type:rounded-t-lg last-of-type:rounded-b-lg">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center rounded-lg text-sm bg-primary/20 text-primary hover:bg-primary/30 shrink-0 px-0">
                {idx + 1}
              </Badge>
              <div className="flex flex-col gap-1 w-full pr-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{slide.title}</CardTitle>
                  {slide.type && (
                    <Badge variant="outline" className="text-xs bg-card shrink-0 capitalize">
                      {slide.type.replace(/_/g, ' ')} {slide.layout !== undefined ? `(Layout ${slide.layout})` : ''}
                    </Badge>
                  )}
                </div>
                {slide.subtitle && (
                  <CardDescription className="text-sm">{slide.subtitle}</CardDescription>
                )}
              </div>
            </CardHeader>
            
            {slide.items && slide.items.length > 0 && (
              <CardContent>
                <ul className="space-y-2 pl-[3.25rem]">
                {slide.items.map((item, iIdx) => (
                  <li key={iIdx} className="text-sm text-muted-foreground list-disc">
                    {item.header && (
                      <span className="font-semibold text-foreground block mb-1">{item.header}</span>
                    )}
                    <span className="text-muted-foreground leading-relaxed block">
                      {item.description}
                    </span>
                  </li>
                ))}
                </ul>
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
