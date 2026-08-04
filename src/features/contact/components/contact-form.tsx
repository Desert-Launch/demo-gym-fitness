"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { sleep } from "@/lib/store"

import {
  CONTACT_TOPIC_LABELS,
  CONTACT_TOPICS,
  contactFormSchema,
  type ContactFormValues,
} from "../schema"

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "membership",
      message: "",
    },
  })

  async function onSubmit(values: ContactFormValues) {
    // Nothing is sent anywhere — this is a demo, so the message stops here.
    await sleep(400)
    toast.success("Message sent", {
      description: `Thanks ${values.name.split(" ")[0]}, the team replies within one working day.`,
    })
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 sm:grid-cols-2"
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your name</FormLabel>
              <FormControl>
                <Input placeholder="Aisha Nasser" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.ae"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+971 50 123 4567"
                  autoComplete="tel"
                  {...field}
                />
              </FormControl>
              <FormDescription>Optional — only if you&apos;d rather we call.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What&apos;s it about?</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CONTACT_TOPICS.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {CONTACT_TOPIC_LABELS[topic]}
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
          name="message"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Tell us what you're training for and when you'd like to start."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="sm:col-span-2">
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            <Send />
            {form.formState.isSubmitting ? "Sending…" : "Send message"}
          </Button>
          <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-400">
            Demo form — nothing is emailed anywhere.
          </p>
        </div>
      </form>
    </Form>
  )
}
