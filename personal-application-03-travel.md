---
tags: [personal-application]
---

# Personal Application 03: Travel, One Trip in Three Parts

This is the third Personal Application post. No code, just what the app handles and how information moves. The first two were Todo, Chat, and Note, then Finance. This one is Travel.

When I get a quiet moment I open Travel to answer two questions: which trips I took this year, and what one of them was. The list answers the first. The detail page answers the second. The plan and the journal aren't on either page. They're notes, and the same tag leads back to them.

## The trip list

The list is every trip I've recorded, one row each. A name, the dates, how many days and nights, who came along, and at the end a net cost. Filter it to a year and I can see where I went and roughly what each trip cost.

The net cost isn't something I type in. It's the cost query, run once for each row. I don't have to open a trip to see its number.

Sorting goes by start date or by net cost, and there are filters for length, domestic or cross-border, companion, and purpose. Status sits above the list as a filter rather than as a column of its own.

## Base info

The detail page starts with the facts. Dates, days and nights, geography, companions, purpose, destinations, status. I enter all of them, and they answer what the trip was, not how it went.

There's also a notes field, and it has nothing to do with the journal. It records what I was unsure about when I entered the trip: which parts were guesses, what hadn't been booked yet. It isn't where the cost comes from, and it goes stale. Now and then it disagrees with the number below it.

The header holds the name, the status and the tag. The tag is plain text. It doesn't open the plan or the journal, and the detail page doesn't list the notes that carry it. To find them I open the Tag view and search the same tag. That's a small waste, since the tag is exactly what could join them.

## Planned and actual

Before a trip I write an itinerary note. The route, the flights and hotels already booked, a day-by-day plan, and a fallback for snow or a traffic jam. Why the route runs this way and not the other is in the same note, because that's the part I forget fastest.

After the trip, what actually happened goes into a journal note. The day that turned into a long drive, the stop that wasn't in the plan, the thing that went wrong at a checkpoint.

The app doesn't compare the two. It has no plan field and no actual field, and the trip record holds only the dates and the destinations. Plan stays in one note and journal in the other, and I read the difference myself.

The tag joins them when both exist. Plenty of trips have just the row and the cost, with no plan written beforehand and no journal after.

## Cost

The cost block reads the ledger through the tag. The gross is what the trip's expenses come to, and the offsets are the negative postings: someone paying part of it back, or a booking that was cancelled and refunded. Subtract one from the other and that's the net.

The block also marks whether I've checked the number. I've left that mark alone so far.

The table under it isn't every tagged expense. It's the ones that counted. A tagged expense that isn't travel stays out of the table, and the block doesn't mention it.

## One tag, three parts

The trip row is the anchor. The plan is written before and the journal after, both as notes. The cost is not part of the record at all; it's a query against the ledger each time I open the page. The one thing all of them share is the tag.

**The record holds the facts, the notes hold the plan and the journal, and the cost is read from the ledger.**

Keeping the record thin isn't laziness. A stored total, or a typed-in day-by-day account, would be one more copy to maintain, and it would drift away from the ledger. This way the trip only carries what it can state for certain. Everything else stays where I've already written it.
