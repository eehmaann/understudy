'use client'

import { InfoIcon, SparklesIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DecoCorners, Eyebrow } from '@/components/debut/ornaments'
import { DemoBlock, ShowcaseSection, StateLabel } from '@/components/showcase/section'

const tones = [
  { label: 'Warm & witty', value: 'witty' },
  { label: 'Calm & sincere', value: 'sincere' },
  { label: 'Bold & theatrical', value: 'bold' },
]

const variants = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const
const variantNames: Record<(typeof variants)[number], string> = {
  default: 'Primary',
  outline: 'Gold outline',
  secondary: 'Champagne',
  ghost: 'Ghost',
  destructive: 'Destructive',
  link: 'Link',
}

function ButtonsDemo() {
  return (
    <DemoBlock title="Button" note="Hover for the gold sweep" className="lg:col-span-2">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-separate border-spacing-y-3 text-left">
          <thead>
            <tr>
              {['Variant', 'Default', 'Focus', 'Disabled', 'Loading'].map((h) => (
                <th key={h} scope="col" className="font-playbill font-semibold text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v}>
                <th scope="row" className="pr-4 text-body-sm font-medium">
                  {variantNames[v]}
                </th>
                <td>
                  <Button variant={v}>{v === 'destructive' ? 'Cut scene' : 'Rehearse'}</Button>
                </td>
                <td>
                  <Button variant={v} className="border-ring ring-3 ring-ring/50" tabIndex={-1}>
                    Focused
                  </Button>
                </td>
                <td>
                  <Button variant={v} disabled>
                    Disabled
                  </Button>
                </td>
                <td>
                  <Button variant={v} disabled aria-busy="true">
                    <Spinner data-icon="inline-start" />
                    Saving
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Separator />
      <div className="flex flex-wrap items-center gap-3">
        <StateLabel>Sizes</StateLabel>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">
          <SparklesIcon data-icon="inline-start" />
          Large
        </Button>
        <Button size="icon" variant="outline" aria-label="Delete">
          <Trash2Icon />
        </Button>
      </div>
    </DemoBlock>
  )
}

function FormsDemo() {
  return (
    <DemoBlock title="Inputs" note="Default · disabled · error">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="demo-name">Stage name</FieldLabel>
          <Input id="demo-name" placeholder="Mara Okafor" />
          <FieldDescription>How you want to be introduced.</FieldDescription>
        </Field>
        <Field data-disabled>
          <FieldLabel htmlFor="demo-venue">Venue</FieldLabel>
          <Input id="demo-venue" defaultValue="Main stage" disabled />
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="demo-email">Email</FieldLabel>
          <Input id="demo-email" defaultValue="mara@" aria-invalid aria-describedby="demo-email-error" />
          <FieldError id="demo-email-error">Add a domain so the audience can find you.</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="demo-bio">One-line bio</FieldLabel>
          <Textarea id="demo-bio" placeholder="Harbor kid, designer, amateur broth scientist." rows={3} />
        </Field>
      </FieldGroup>
    </DemoBlock>
  )
}

function ControlsDemo() {
  return (
    <DemoBlock title="Select · Checkbox · Switch">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="demo-tone">Tone of voice</FieldLabel>
          <Select items={tones} defaultValue="witty">
            <SelectTrigger id="demo-tone" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="demo-c1" defaultChecked />
          <FieldLabel htmlFor="demo-c1">Include understudies in review</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="demo-c2" />
          <FieldLabel htmlFor="demo-c2">Add captions to every scene</FieldLabel>
        </Field>
        <Field orientation="horizontal" data-disabled>
          <Checkbox id="demo-c3" disabled />
          <FieldLabel htmlFor="demo-c3">Publish to lobby (disabled)</FieldLabel>
        </Field>
        <Separator />
        <Field orientation="horizontal">
          <Switch id="demo-s1" defaultChecked />
          <FieldLabel htmlFor="demo-s1">Auto-advance every 20s</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Switch id="demo-s2" />
          <FieldLabel htmlFor="demo-s2">Rehearsal mode</FieldLabel>
        </Field>
        <Field orientation="horizontal" data-disabled>
          <Switch id="demo-s3" disabled />
          <FieldLabel htmlFor="demo-s3">Live audience (disabled)</FieldLabel>
        </Field>
      </FieldGroup>
    </DemoBlock>
  )
}

function DisplayDemo() {
  return (
    <DemoBlock title="Badge · Avatar · Progress · Skeleton">
      <div className="flex flex-wrap gap-2">
        <Badge>Now showing</Badge>
        <Badge variant="gold">Cast</Badge>
        <Badge variant="secondary">Champagne</Badge>
        <Badge variant="outline">Understudy</Badge>
        <Badge variant="destructive">Over time</Badge>
      </div>
      <Separator />
      <div className="flex items-center gap-4">
        <Avatar className="size-10 ring-1 ring-gold/60">
          <AvatarImage src="/photos/guitar.png" alt="Mara at open mic" />
          <AvatarFallback>MO</AvatarFallback>
        </Avatar>
        <Avatar className="size-10 ring-1 ring-gold/60">
          <AvatarFallback className="bg-velvet font-serif text-primary-foreground">SM</AvatarFallback>
        </Avatar>
        <Avatar className="size-10">
          <AvatarImage src="/missing.png" alt="" />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <span className="text-caption text-muted-foreground">Image · agent · fallback</span>
      </div>
      <Separator />
      <Progress value={65}>
        <ProgressLabel>Rehearsal</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={100}>
        <ProgressLabel>Scripts drafted</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Separator />
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </DemoBlock>
  )
}

function OverlaysDemo() {
  return (
    <DemoBlock title="Dialog · Sheet · Tooltip · Toast">
      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
          <DialogContent className="shadow-gilded">
            <DialogHeader>
              <Eyebrow>Final call</Eyebrow>
              <DialogTitle className="font-serif text-heading">Raise the curtain?</DialogTitle>
              <DialogDescription>
                {"Your 20 scenes will play back-to-back, 20 seconds each. You can't pause once the house lights dim."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="ghost" />}>Not yet</DialogClose>
              <DialogClose render={<Button />}>Curtain up</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <Eyebrow>Backstage</Eyebrow>
              <SheetTitle className="font-serif text-heading">Understudies</SheetTitle>
              <SheetDescription>Photos set aside by your stage manager. Promote any of them to the main cast.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="About the 20 × 20 format" />}>
            <InfoIcon />
          </TooltipTrigger>
          <TooltipContent>20 slides × 20 seconds = 6 min 40 s</TooltipContent>
        </Tooltip>
      </div>
      <Separator />
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" size="sm" onClick={() => toast.success('Scene 07 saved', { description: 'Fits the 20-second cue.' })}>
          Success toast
        </Button>
        <Button variant="secondary" size="sm" onClick={() => toast('Stage manager', { description: 'Two scenes share a photo — want a swap?' })}>
          Info toast
        </Button>
        <Button variant="secondary" size="sm" onClick={() => toast.error('Scene 11 runs over', { description: 'Trim 4.8 seconds to stay on cue.' })}>
          Error toast
        </Button>
      </div>
    </DemoBlock>
  )
}

function CardTabsDemo({ className }: { className?: string }) {
  return (
    <DemoBlock title="Card · Tabs · Separator" className={className}>
      <Tabs defaultValue="script">
        <TabsList>
          <TabsTrigger value="script">Script</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="cues" disabled>
            Cues
          </TabsTrigger>
        </TabsList>
        <TabsContent value="script">
          <Card className="relative shadow-gilded">
            <DecoCorners />
            <CardHeader className="px-8 pt-2">
              <Eyebrow>Featured · Scene 01</Eyebrow>
              <CardTitle className="text-heading">Curtain up</CardTitle>
              <CardDescription>Featured cards get gilded borders and deco corners.</CardDescription>
            </CardHeader>
            <CardContent className="px-8">
              <p className="text-body-sm leading-relaxed text-pretty">
                {"Hi, I'm Mara. I grew up in a harbor town of eight hundred people, where everyone knew your boat."}
              </p>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" size="sm">
                Skip
              </Button>
              <Button size="sm">Approve</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Director&apos;s notes</CardTitle>
              <CardDescription>Plain cards stay quiet — no ornament.</CardDescription>
            </CardHeader>
            <CardContent className="text-body-sm text-muted-foreground">Slow down on the second sentence.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DemoBlock>
  )
}

export function CoreComponentsSection() {
  return (
    <ShowcaseSection
      id="components"
      act="Act V · The company"
      title="Core components"
      description="Themed shadcn/ui primitives. Gold focus rings everywhere; tab through the page to see them."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ButtonsDemo />
        <FormsDemo />
        <ControlsDemo />
        <DisplayDemo />
        <OverlaysDemo />
        <CardTabsDemo className="lg:col-span-2" />
      </div>
    </ShowcaseSection>
  )
}
