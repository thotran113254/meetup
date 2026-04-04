"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import type { ItineraryDay } from "@/lib/types/tours-cms-types";

type Props = {
  itinerary: ItineraryDay[];
  onChange: (itinerary: ItineraryDay[]) => void;
};

const EMPTY_DAY: ItineraryDay = {
  title: "", details: [], images: [], accommodation: "", meals: "", included: [], excluded: [],
};

/** Itinerary tab — CRUD for day-by-day tour plan */
export function AdminTourItineraryTab({ itinerary, onChange }: Props) {
  const addDay = () => onChange([...itinerary, { ...EMPTY_DAY }]);
  const removeDay = (i: number) => onChange(itinerary.filter((_, idx) => idx !== i));
  const updateDay = (i: number, patch: Partial<ItineraryDay>) =>
    onChange(itinerary.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));

  // Helpers for newline-separated list fields
  const toLines = (arr: string[]) => arr.join("\n");
  const fromLines = (val: string) => val.split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">{itinerary.length} ngày</p>
        <Button size="sm" variant="outline" onClick={addDay}>
          <Plus className="h-4 w-4 mr-1" /> Thêm ngày
        </Button>
      </div>

      {itinerary.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--color-muted-foreground)]">
          Chưa có lịch trình nào. Trang chi tiết sẽ hiển thị nội dung mặc định.
        </p>
      )}

      <div className="space-y-4">
        {itinerary.map((day, i) => (
          <div key={i} className="p-4 rounded-lg border border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">
                Ngày {i + 1}
              </span>
              <Button size="sm" variant="outline" onClick={() => removeDay(i)}
                className="text-red-500 hover:text-red-600 hover:border-red-200">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <FormField label="Tên điểm đến" htmlFor={`it-title-${i}`}>
              <input id={`it-title-${i}`} className={inputStyles} value={day.title}
                onChange={(e) => updateDay(i, { title: e.target.value })} placeholder="Destination 1" />
            </FormField>

            <FormField label="Hoạt động (mỗi dòng 1 mục)" htmlFor={`it-details-${i}`}>
              <textarea id={`it-details-${i}`} rows={4} className={inputStyles}
                value={toLines(day.details)}
                onChange={(e) => updateDay(i, { details: fromLines(e.target.value) })}
                placeholder={"08:00 AM - Pickup from hotel\n09:30 AM - Visit Cu Chi Tunnels"} />
            </FormField>

            <FormField label="Ảnh trong ngày (URL, mỗi dòng 1 ảnh)" htmlFor={`it-imgs-${i}`}>
              <textarea id={`it-imgs-${i}`} rows={2} className={inputStyles}
                value={toLines(day.images)}
                onChange={(e) => updateDay(i, { images: fromLines(e.target.value) })}
                placeholder={"/images/tour-day-1.jpg\n/images/tour-day-1b.jpg"} />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Chỗ ở" htmlFor={`it-accom-${i}`}>
                <input id={`it-accom-${i}`} className={inputStyles} value={day.accommodation}
                  onChange={(e) => updateDay(i, { accommodation: e.target.value })} placeholder="Saigon Grand Hotel" />
              </FormField>
              <FormField label="Bữa ăn" htmlFor={`it-meals-${i}`}>
                <input id={`it-meals-${i}`} className={inputStyles} value={day.meals}
                  onChange={(e) => updateDay(i, { meals: e.target.value })} placeholder="Breakfast and Lunch" />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Bao gồm (mỗi dòng 1 mục)" htmlFor={`it-inc-${i}`}>
                <textarea id={`it-inc-${i}`} rows={3} className={inputStyles}
                  value={toLines(day.included)}
                  onChange={(e) => updateDay(i, { included: fromLines(e.target.value) })}
                  placeholder={"Hotel pickup\nEnglish guide\nEntrance fees"} />
              </FormField>
              <FormField label="Không bao gồm (mỗi dòng 1 mục)" htmlFor={`it-exc-${i}`}>
                <textarea id={`it-exc-${i}`} rows={3} className={inputStyles}
                  value={toLines(day.excluded)}
                  onChange={(e) => updateDay(i, { excluded: fromLines(e.target.value) })}
                  placeholder={"Personal expenses\nTravel insurance"} />
              </FormField>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
