export type PhotoStatus = 'cast' | 'understudy'

export type Photo = {
  id: string
  src: string
  alt: string
  caption: string
  topic: string
  status: PhotoStatus
}

export type Slide = {
  id: string
  photoId: string
  title: string
  script: string
}

export type LogEntry = {
  id: string
  time: string
  act: string
  message: string
  state: 'done' | 'live'
}

export type CoverageItem = {
  id: string
  role: string
  detail: string
  slides: number[]
}

export type CriticNote = {
  id: string
  kind: 'blocking' | 'suggestion'
  slide?: number
  text: string
}

export const SLIDE_SECONDS = 20
export const WORDS_PER_SECOND = 2.5

export function estimateSeconds(script: string) {
  const words = script.trim().split(/\s+/).filter(Boolean).length
  return words / WORDS_PER_SECOND
}

export function padSlide(n: number) {
  return String(n).padStart(2, '0')
}

export const photos: Photo[] = [
  {
    id: 'hometown',
    src: '/photos/hometown.png',
    alt: 'Fishing boats moored in a small coastal harbor at golden hour',
    caption: 'Port Ellery, where it all began',
    topic: 'Origins',
    status: 'cast',
  },
  {
    id: 'childhood',
    src: '/photos/childhood.png',
    alt: 'A young child riding a red bicycle down a suburban driveway',
    caption: 'First solo ride, age six',
    topic: 'Childhood',
    status: 'cast',
  },
  {
    id: 'summit-a',
    src: '/photos/summit-a.png',
    alt: 'A hiker with arms raised on a mountain summit above a sea of clouds',
    caption: 'Sunrise on Mount Asahi',
    topic: 'Adventure',
    status: 'cast',
  },
  {
    id: 'summit-b',
    src: '/photos/summit-b.png',
    alt: 'A slightly blurry photo of a hiker looking sideways on a summit',
    caption: 'Sunrise on Mount Asahi (take 2)',
    topic: 'Adventure',
    status: 'understudy',
  },
  {
    id: 'ramen',
    src: '/photos/ramen.png',
    alt: 'Overhead view of a homemade bowl of ramen with chopsticks',
    caption: 'Sunday broth experiments',
    topic: 'Hobbies',
    status: 'cast',
  },
  {
    id: 'dog',
    src: '/photos/dog.png',
    alt: 'A scruffy terrier sitting on a couch under a knitted blanket',
    caption: 'Biscuit, head of security',
    topic: 'Family',
    status: 'cast',
  },
  {
    id: 'team',
    src: '/photos/team.png',
    alt: 'A product team laughing around a whiteboard covered in sticky notes',
    caption: 'The team that shipped Atlas',
    topic: 'Work',
    status: 'cast',
  },
  {
    id: 'guitar',
    src: '/photos/guitar.png',
    alt: 'A person playing acoustic guitar under a warm spotlight at an open mic',
    caption: 'Open mic, Thursday nights',
    topic: 'Passions',
    status: 'cast',
  },
  {
    id: 'kyoto',
    src: '/photos/kyoto.png',
    alt: 'A quiet Kyoto street of wooden houses and lanterns at dusk',
    caption: 'Getting lost in Kyoto',
    topic: 'Travel',
    status: 'cast',
  },
]

export const photoById = Object.fromEntries(photos.map((p) => [p.id, p])) as Record<string, Photo>

const slideSeeds: Array<[string, string, string]> = [
  ['hometown', 'Curtain up', "Hi, I'm Mara. I grew up in a harbor town of eight hundred people, where everyone knew your boat."],
  ['childhood', 'First wheels', 'At six I rode this red bike straight into a hedge. I got back on, which turned out to be my whole personality.'],
  ['hometown', 'Salt and tides', 'My dad fixed nets for a living. He taught me that anything tangled can be undone, one knot at a time.'],
  ['team', 'Day job', "Today I'm a product designer. I help teams untangle messy problems, which is basically nets with more meetings."],
  ['team', 'Shipping Atlas', 'Last year this crew shipped Atlas, a tool used by forty thousand nurses. I still keep the launch sticky notes.'],
  ['summit-a', 'Early alarms', 'I love a 3am alarm if it ends somewhere like this. Mount Asahi, minus eight degrees, zero regrets.'],
  ['summit-a', 'What summits teach', 'Mountains taught me pacing. You do not sprint up; you keep a rhythm you could hold all day.'],
  ['ramen', 'Broth science', 'On Sundays I run broth experiments. Eighteen hours, three failures, one bowl worth writing home about.'],
  ['ramen', 'Feeding people', 'Cooking is how I say I care. If you join this team, expect a ramen night in your first month.'],
  ['dog', 'Head of security', 'This is Biscuit. He guards the couch, rejects most of my ideas, and is right about half of them.'],
  ['dog', 'Rescue story', 'We adopted him from a shelter the week I moved here. We were both new in town and a little nervous.'],
  ['guitar', 'Open mic', 'Thursdays I play open mic. Mostly covers, one original about a lighthouse that nobody requests.'],
  ['guitar', 'Stage fright', 'I used to shake so much the strings buzzed. Now I just shake a little, and that feels like progress.'],
  ['kyoto', 'Getting lost', 'In Kyoto I put my phone away and got wonderfully lost. I found a tea shop older than my country.'],
  ['kyoto', 'Slow travel', 'I travel slowly now. One city, two weeks, the same café every morning until they know my order.'],
  ['team', 'How I work', 'At work I sketch fast, test early, and say "I was wrong" out loud. It saves everyone a lot of time.'],
  ['summit-a', 'Next peak', 'Next year I want to hike the Kumano Kodo trail, and finally learn to read a topographic map properly.'],
  ['hometown', 'Still a harbor kid', 'I still check the tide tables out of habit, even living four hundred kilometers from the sea.'],
  ['ramen', 'Ask me about', 'Ask me about broth, design critiques, or terrible lighthouse songs. I have opinions on all three.'],
  ['guitar', 'Curtain call', "That's me, Mara: harbor kid, designer, amateur broth scientist. Thanks for having me. I can't wait to start."],
]

export const slides: Slide[] = slideSeeds.map(([photoId, title, script], i) => ({
  id: `slide-${i + 1}`,
  photoId,
  title,
  script,
}))

export const overRunningScript =
  "This is Biscuit. He guards the couch, rejects most of my ideas, and is right about half of them. He came from a shelter on the east side and was terrified of the vacuum, the doorbell, and for some reason every single umbrella we owned, so we spent most of that first winter slowly earning his trust with cheese."

export const logEntries: LogEntry[] = [
  { id: 'l1', time: '19:02', act: 'Load-in', message: 'Received 9 photos from the green room.', state: 'done' },
  { id: 'l2', time: '19:02', act: 'Casting', message: 'Tagged topics: Origins, Childhood, Work, Hobbies, Family, Travel.', state: 'done' },
  { id: 'l3', time: '19:03', act: 'Casting', message: 'Moved "Sunrise on Mount Asahi (take 2)" to understudy — near-duplicate.', state: 'done' },
  { id: 'l4', time: '19:04', act: 'Blocking', message: 'Drafted running order for 20 scenes.', state: 'done' },
  { id: 'l5', time: '19:05', act: 'Rehearsal', message: 'Timing scripts against the 20-second cue…', state: 'live' },
]

export const coverage: CoverageItem[] = [
  { id: 'c1', role: 'Name & opening', detail: 'Who you are in one breath', slides: [1] },
  { id: 'c2', role: 'Origin story', detail: 'Where you come from', slides: [1, 3, 18] },
  { id: 'c3', role: 'Work & craft', detail: 'What you do and how', slides: [4, 5, 16] },
  { id: 'c4', role: 'Passions', detail: 'What lights you up', slides: [8, 12, 13] },
  { id: 'c5', role: 'Values', detail: 'What you believe', slides: [7] },
  { id: 'c6', role: 'Fun fact', detail: 'Something unexpected', slides: [] },
  { id: 'c7', role: 'Future goals', detail: 'Where you are headed', slides: [17] },
  { id: 'c8', role: 'Call to connect', detail: 'How people can reach you', slides: [] },
]

export const criticNotes: CriticNote[] = [
  { id: 'n1', kind: 'blocking', slide: 11, text: 'Scene 11 runs 4.8s over the cue — trim the shelter backstory.' },
  { id: 'n2', kind: 'blocking', text: 'No closing invitation — tell the audience how to find you after the show.' },
  { id: 'n3', kind: 'suggestion', slide: 6, text: 'Scenes 06, 07 and 17 all use the summit photo. Consider one fresh image.' },
  { id: 'n4', kind: 'suggestion', slide: 12, text: 'The lighthouse song is a great callback — echo it in the curtain call.' },
]

export const agentQuestion = {
  question: 'Two of your photos could open the show. Which feels more like you on first impression?',
  context: 'The harbor sets up your origin story; the summit leads with energy.',
  photoIds: ['hometown', 'summit-a'],
  replies: ['Open with the harbor', 'Open with the summit', 'You decide'],
}
