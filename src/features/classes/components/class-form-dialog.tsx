"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTrainers } from "@/features/trainers"
import { DAYS } from "@/lib/week"
import type { GymClassDetail } from "@/types"

import { useCreateClass, useUpdateClass, useClassTypes } from "../hooks/use-classes"
import {
  CLASS_LEVEL_LABELS,
  CLASS_LEVELS,
  STUDIOS,
  classFormSchema,
  toDayOfWeek,
  type ClassFormValues,
} from "../schema"

const BLANK: ClassFormValues = {
  typeId: "strength",
  trainerId: "",
  dayOfWeek: 1,
  startTime: "18:30",
  durationMinutes: 60,
  capacity: 12,
  studio: "The Floor",
  level: "all",
}

export function ClassFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: GymClassDetail | null
}) {
  const typesQuery = useClassTypes()
  const trainersQuery = useTrainers()
  const createClass = useCreateClass()
  const updateClass = useUpdateClass()

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: BLANK,
  })

  // Reload the form whenever the dialog opens on a different session.
  useEffect(() => {
    if (!open) return
    form.reset(
      editing
        ? {
            typeId: editing.typeId,
            trainerId: editing.trainerId,
            dayOfWeek: editing.dayOfWeek,
            startTime: editing.startTime,
            durationMinutes: editing.durationMinutes,
            capacity: editing.capacity,
            studio: editing.studio as ClassFormValues["studio"],
            level: editing.level,
          }
        : BLANK
    )
  }, [open, editing, form])

  const isSaving = createClass.isPending || updateClass.isPending

  async function onSubmit(values: ClassFormValues) {
    const payload = { ...values, dayOfWeek: toDayOfWeek(values.dayOfWeek) }
    try {
      if (editing) {
        await updateClass.mutateAsync({ classId: editing.id, patch: payload })
        toast.success("Class updated", {
          description: "The public timetable already shows the change.",
        })
      } else {
        await createClass.mutateAsync(payload)
        toast.success("Class added", {
          description: "It's live on the timetable and open for bookings.",
        })
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(editing ? "That change didn't save" : "That class wasn't added", {
        description:
          error instanceof Error ? error.message : "Try again in a moment.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="display text-display-sm">
            {editing ? "Edit class" : "Add a class"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Changes show on the public timetable straight away."
              : "New sessions open for booking as soon as you save."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="class-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-5 sm:grid-cols-2"
            noValidate
          >
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(typesQuery.data ?? []).map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trainerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coach</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pick a coach" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(trainersQuery.data ?? []).map((trainer) => (
                        <SelectItem key={trainer.id} value={trainer.id}>
                          {trainer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day.value} value={String(day.value)}>
                          {day.long}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start time</FormLabel>
                  <FormControl>
                    <Input type="time" step={300} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={20}
                      max={120}
                      step={5}
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={Number.isNaN(field.value) ? "" : field.value}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormDescription>Minutes on the floor.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={40}
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={Number.isNaN(field.value) ? "" : field.value}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    {editing
                      ? `${editing.bookedCount} already booked in.`
                      : "Spots on the floor."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Studio</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STUDIOS.map((studio) => (
                        <SelectItem key={studio} value={studio}>
                          {studio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CLASS_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {CLASS_LEVEL_LABELS[level]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" form="class-form" disabled={isSaving}>
            {isSaving ? "Saving…" : editing ? "Save changes" : "Add class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
