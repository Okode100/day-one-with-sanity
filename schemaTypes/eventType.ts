import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {DoorsOpenInput} from './components/DoorsOpenInput'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  // Above the "fields" array
groups: [
    {name: 'details', title: 'Details'},
    {name: 'editorial', title: 'Editorial'},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'details',
    }),
   // Replace "slug" in the array of fields:
defineField({
    name: 'slug',
    type: 'slug',
    options: {source: 'name'},
    validation: (rule) => rule.required().error(`Required to generate a page on the website`),
    hidden: ({document}) => !document?.name,
    group: 'details',
  }),
    defineField({
        name: 'eventType',
        type: 'string',
        options: {
            list: ['in-person','virtula'],
            layout: 'radio',
        },
        group: 'details',

    }),
    defineField({
        name: 'date',
        type: 'datetime',
        group: 'details',

    }),
    defineField({
        name: 'doorsOpen',
        type:'number',
        description: 'Number of minutes before the start time for admission',
        initialValue:60,
        group: 'details',
        components: {
          input: DoorsOpenInput,
        }
        

    }),
   // Replace "venue" in the array of fields:
defineField({
    name: 'venue',
    type: 'reference',
    to: [{type: 'venue'}],
    readOnly: ({value, document}) => !value && document?.eventType === 'virtual',
    validation: (rule) =>
      rule.custom((value, context) => {
        if (value && context?.document?.eventType === 'virtual') {
          return 'Only in-person events can have a venue'
        }
  
        return true
      }),
      group: 'details',
  }),

    defineField({
        name: 'headLine',
        type: 'reference',
        to: [{type: 'artist'}],
        group: ['details','editorial'],

    }),
    defineField({
        name: 'image',
        type: 'image',
        group: ['details','editorial'],

    }),
    defineField({
        name: 'details',
        type: 'array',
        of: [{type: 'block'}],
        group: ['details','editorial']
        

    }),
    defineField({
        name: 'tickets',
        type: 'url',
        group:[ 'details','editorial'],

    }),

  ],
  // After the "fields" array
// Update the preview key in the schema
preview: {
    select: {
      name: 'name',
      venue: 'venue.name',
      artist: 'headline.name',
      date: 'date',
      image: 'image',
    },
    prepare({name, venue, artist, date, image}) {
      const nameFormatted = name || 'Untitled event'
      const dateFormatted = date
        ? new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        : 'No date'
  
      return {
        title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
        subtitle: venue ? `${dateFormatted} at ${venue}` : dateFormatted,
        media: image || CalendarIcon,
      }
    },
  },
})
