"use client";

import React from "react";
import { Loader2, Plus, Trash, ArrowUp, ArrowDown, Save } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const checkSlideOverflow = (slide) => {
  if (!slide.items) return false;
  if (slide.items.length > 5) return true;
  return slide.items.some(item => item.description && item.description.length > 200);
};

export function OutlineReview({ 
  isUpdating, 
  pptData, 
  slides = [], 
  setSlides, 
  onSave, 
  isSaving, 
  hasChanges 
}) {

  const updateSlideTitle = (idx, value) => {
    const updated = [...slides];
    updated[idx] = { ...updated[idx], title: value };
    setSlides(updated);
  };

  const updateSlideSubtitle = (idx, value) => {
    const updated = [...slides];
    updated[idx] = { ...updated[idx], subtitle: value };
    setSlides(updated);
  };

  const updateItemHeader = (slideIdx, itemIdx, value) => {
    const updated = [...slides];
    const updatedItems = [...updated[slideIdx].items];
    updatedItems[itemIdx] = { ...updatedItems[itemIdx], header: value };
    updated[slideIdx] = { ...updated[slideIdx], items: updatedItems };
    setSlides(updated);
  };

  const updateItemDescription = (slideIdx, itemIdx, value) => {
    const updated = [...slides];
    const updatedItems = [...updated[slideIdx].items];
    updatedItems[itemIdx] = { ...updatedItems[itemIdx], description: value };
    updated[slideIdx] = { ...updated[slideIdx], items: updatedItems };
    setSlides(updated);
  };

  const deleteBulletItem = (slideIdx, itemIdx) => {
    const updated = [...slides];
    const updatedItems = updated[slideIdx].items.filter((_, i) => i !== itemIdx);
    updated[slideIdx] = { ...updated[slideIdx], items: updatedItems };
    setSlides(updated);
  };

  const addBulletItem = (slideIdx) => {
    const updated = [...slides];
    const items = updated[slideIdx].items || [];
    updated[slideIdx] = { ...updated[slideIdx], items: [...items, { header: "", description: "" }] };
    setSlides(updated);
  };

  const deleteSlide = (slideIdx) => {
    const updated = slides.filter((_, i) => i !== slideIdx);
    setSlides(updated);
  };

  const insertSlideBelow = (slideIdx) => {
    const updated = [...slides];
    const newSlide = {
      title: "New Slide",
      subtitle: "",
      type: "BULLET_POINTS",
      layout: 1,
      items: []
    };
    updated.splice(slideIdx + 1, 0, newSlide);
    setSlides(updated);
  };

  const moveSlide = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= slides.length) return;
    const updated = [...slides];
    const item = updated.splice(fromIndex, 1)[0];
    updated.splice(toIndex, 0, item);
    setSlides(updated);
  };

  return (
    <div className="flex-1 pb-16 relative">
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
      ) : slides.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card/30 flex flex-col items-center p-8">
          <p className="text-sm text-muted-foreground mb-4">No slides in this outline.</p>
          <Button
            onClick={() => {
              setSlides([{ title: "Title Slide", subtitle: "Presentation Subtitle", type: "TITLE", layout: 1, items: [] }]);
            }}
            className="cursor-pointer"
          >
            Add First Slide
          </Button>
        </div>
      ) : (
        <div className="space-y-0.5">
          {slides.map((slide, idx) => {
            const hasOverflow = checkSlideOverflow(slide);
            return (
              <Card 
                key={idx} 
                className={`rounded-none border transition-all duration-200 hover:shadow-xs first-of-type:rounded-t-xl last-of-type:rounded-b-xl group/card relative ${
                  hasOverflow 
                    ? "border-amber-500/40 bg-amber-500/[0.02] dark:bg-amber-500/[0.01] hover:bg-amber-500/[0.04] shadow-[inset_0_0_8px_rgba(245,158,11,0.02)]" 
                    : "border-border bg-card/25 hover:bg-accent/15"
                }`}
              >
              <CardHeader className="flex flex-row items-start gap-3.5 pb-2 pt-4">
                <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center rounded-lg text-sm bg-primary/10 text-primary hover:bg-primary/20 shrink-0 px-0 mt-1.5 font-bold">
                  {idx + 1}
                </Badge>
                
                <div className="flex-1 flex flex-col gap-2 pr-1">
                  <div className="flex items-start justify-between gap-3">
                    <input
                      value={slide.title || ""}
                      onChange={(e) => updateSlideTitle(idx, e.target.value)}
                      placeholder="Slide Title"
                      className="text-lg font-bold sm:text-xl bg-[#f4f4f5]/65 dark:bg-[#18181b]/60 border border-zinc-200/50 dark:border-zinc-800/50 focus:border-primary focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-primary/5 focus:shadow-xs outline-none w-full transition-all duration-200 px-3.5 py-1.5 rounded-lg text-foreground"
                    />
                    
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {slide.type && (
                        <Badge variant="outline" className="text-[10px] bg-card/85 text-muted-foreground capitalize py-0.5 mt-1.5 select-none font-medium">
                          {slide.type.replace(/_/g, ' ')} {slide.layout !== undefined ? `(Layout ${slide.layout})` : ''}
                        </Badge>
                      )}
                      {checkSlideOverflow(slide) && (
                        <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 py-0.5 mt-0.5 flex items-center gap-1 font-medium select-none shadow-xs">
                          <span>⚠️ Text may overflow on compile</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {slide.subtitle !== undefined && slide.subtitle !== null && (
                    <input
                      value={slide.subtitle || ""}
                      onChange={(e) => updateSlideSubtitle(idx, e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value.trim() === "") {
                          updateSlideSubtitle(idx, undefined);
                        }
                      }}
                      placeholder="Add subtitle..."
                      className="text-sm text-muted-foreground bg-[#f4f4f5]/40 dark:bg-[#18181b]/35 border border-zinc-200/20 dark:border-zinc-800/20 focus:border-primary/50 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-primary/5 focus:shadow-xs outline-none w-full transition-all duration-200 px-3.5 py-1.5 rounded-lg"
                    />
                  )}
                </div>

                {/* Card Controls (Omitted for Title Slide) */}
                {idx !== 0 && (
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/card:opacity-100 focus-within:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={idx === 1}
                      onClick={() => moveSlide(idx, idx - 1)}
                      className="w-6.5 h-6.5 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Slide Up"
                    >
                      <ArrowUp size={13} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={idx === slides.length - 1}
                      onClick={() => moveSlide(idx, idx + 1)}
                      className="w-6.5 h-6.5 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Slide Down"
                    >
                      <ArrowDown size={13} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSlide(idx)}
                      className="w-6.5 h-6.5 text-muted-foreground hover:text-destructive cursor-pointer"
                      title="Delete Slide"
                    >
                      <Trash size={13} />
                    </Button>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="pb-3 pt-1">
                {slide.items && slide.items.length > 0 && (
                  <ul className="space-y-3.5 pl-11.5 pr-4">
                    {slide.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex gap-2 items-start relative group/item">
                        <span className="text-muted-foreground/60 mt-2 shrink-0 select-none text-sm">•</span>
                        <div className="flex-1 flex flex-col gap-1.5">
                          <input
                            value={item.header || ""}
                            onChange={(e) => updateItemHeader(idx, iIdx, e.target.value)}
                            placeholder="Item Header (optional)"
                            className="font-semibold text-foreground text-sm bg-[#f4f4f5]/60 dark:bg-[#18181b]/50 border border-zinc-200/40 dark:border-zinc-800/40 focus:border-primary focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-primary/5 focus:shadow-xs outline-none w-full transition-all duration-200 px-3 py-1.5 rounded-lg"
                          />
                          <textarea
                            value={item.description || ""}
                            onChange={(e) => updateItemDescription(idx, iIdx, e.target.value)}
                            placeholder="Bullet description..."
                            rows={2}
                            className={`text-sm text-muted-foreground transition-all duration-200 px-3 py-1.5 rounded-lg resize-none min-h-[56px] leading-relaxed outline-none w-full ${
                              item.description && item.description.length > 200
                                ? "bg-amber-500/[0.04] dark:bg-amber-500/[0.02] border border-amber-500/50 dark:border-amber-500/40 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:shadow-xs"
                                : "bg-[#f4f4f5]/40 dark:bg-[#18181b]/35 border border-zinc-200/20 dark:border-zinc-800/20 focus:border-primary/50 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-primary/5 focus:shadow-xs"
                            }`}
                          />
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-6 h-6 rounded-md text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-opacity self-center shrink-0 cursor-pointer mt-1"
                          onClick={() => deleteBulletItem(idx, iIdx)}
                          title="Remove item"
                        >
                          <Trash size={12} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                
                {/* Actions Row within Slide Card */}
                <div className="flex items-center gap-2.5 pl-11.5 mt-3">
                  {(slide.subtitle === undefined || slide.subtitle === null) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateSlideSubtitle(idx, "Subtitle")}
                      className="text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/70 h-6.5 px-2.5 rounded-md cursor-pointer flex items-center gap-1 font-medium border border-zinc-200/40 dark:border-zinc-800/40"
                    >
                      <Plus size={11} />
                      <span>Add Subtitle</span>
                    </Button>
                  )}

                  {idx !== 0 && idx !== slides.length - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addBulletItem(idx)}
                      className="text-[10px] text-primary/80 hover:text-primary hover:bg-primary/5 h-6.5 px-2.5 rounded-md cursor-pointer flex items-center gap-1 font-medium border border-primary/20"
                    >
                      <Plus size={11} />
                      <span>Add Point</span>
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertSlideBelow(idx)}
                    className="text-xs text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 h-7.5 px-3 rounded-lg cursor-pointer flex items-center gap-1 font-medium opacity-0 group-hover/card:opacity-100 transition-opacity border border-zinc-200/30 dark:border-zinc-800/30 shadow-2xs"
                  >
                    <Plus size={12} />
                    <span>Insert Slide Below</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

          {/* Add Slide button at the very end */}
          <div className="pt-5 px-2">
            <Button
              variant="outline"
              onClick={() => insertSlideBelow(slides.length - 1)}
              className="w-full py-7.5 border-2 border-dashed border-zinc-200/80 dark:border-zinc-800/80 hover:border-primary bg-[#f4f4f5]/30 dark:bg-[#18181b]/30 hover:bg-[#f4f4f5]/60 dark:hover:bg-[#18181b]/60 text-muted-foreground hover:text-primary transition-all duration-300 rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer text-sm font-bold tracking-wide shadow-sm"
            >
              <Plus size={16} />
              <span>Add New Slide</span>
            </Button>
          </div>
        </div>
      )}

      {/* Floating Sticky Save Changes Bar */}
      {hasChanges && (
        <div className="sticky bottom-4 left-0 right-0 z-30 flex justify-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-primary text-primary-foreground rounded-full px-5 py-2 flex items-center justify-between gap-6 shadow-xl border border-primary/20 backdrop-blur-md">
            <span className="text-xs font-semibold tracking-wide select-none">You have unsaved changes</span>
            <Button
              size="sm"
              onClick={() => onSave()}
              disabled={isSaving}
              className="bg-white hover:bg-zinc-100 text-black font-semibold rounded-full h-8 px-4 flex items-center gap-1.5 cursor-pointer shadow-sm text-xs border-none"
            >
              {isSaving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Save size={13} />
              )}
              <span>Save Outline</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
