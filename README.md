
TredoList
=========

TredoList turns Trello into a convenient todolist tool, by introducing:
* new optional list layouts
* new optional dynamic color themes

Get rid of Todo / In Progress / Done lists! Now your cards get colored according to their status.
Here is how the [Tredolist](https://trello.com/b/af1CpwBl/tredolist) Trello board looks like in bright colors:
![Tredolist board](https://raw.githubusercontent.com/gwened/tredolist/master/screenshots/tredolist-mainscreenshot.png)
Forked from List Layouts for Trello.
This extension is a companion for Trello.com boards, but the author is not affiliated to Trello or Atlassian Corp.

Installation
------------

Download and install the official extension from here:
- [Chrome Web Store: Tredolist](https://chrome.google.com/webstore/detail/tredolist/ccdkhfdflkpacnhjcefjlhlaopfgjkab)
- [Firefox Add-ons: TredoList](https://addons.mozilla.org/en-US/firefox/addon/tredolist/)

If you want to modify the source code, you can download it from GitHub and install from source as unpackaged extension in Google Chrome's or Firefox's Extension manager.

Usage
-----

When a Trello board is open in the current Chrome tab, click the button of the extension to open the main Tredolist settings panel:

![Tredolist Settings](https://raw.githubusercontent.com/gwened/tredolist/master/screenshots/tredolist-settings.png)

From there you can set the layout and the color theme, for this particular board or as the default.

Tredolist introduces the following conventions that will trigger the appropriate card colors:
- A card having all checklists completed is considered **Done** (completed)
- A card having a checked custom field named *Done* is also considered Done (completed)
- A card having partially completed checklists is considered **Started** (in-progress)
- A card having a checked custom field named *Started* is also considered Started (in-progress)
- A card having \<a name\> in the title is considered **Waiting For** (blocked)
- A card having a checked custom field named *Waiting For* is also considered Waiting For (blocked)
- A card having a checked custom field named *Canceled* is considered **Canceled**
- A card having a past due date in the next day or before (including past!) is considered **Urgent**
- A card having (a title inside parenthesis) is considered to be postponed **For Later**

![Tredolist board](https://raw.githubusercontent.com/gwened/tredolist/master/screenshots/tredolist-board.png)

Tip: you can add the character **|** in the title of a list and have your board divided in **multiple swimlanes**. Example: "Monday | Next Week". This is an experimental feature (see Known Bugs section below) inspired from Swimlanes for Trello, an extension by Jeff Yaus.

**How should I organize my Todo List?**

It's up to you, but here is my own recipe:
- Create a list for each working context. For example, Product Implementation and Accounting.
- Use the ***horizontal list* layout** to get rid of the scrollbars inside the lists, so that you can see all cards.
- Use **checklists** for fine grain subtasks. if you don't have subtacks but want to color the cards as Not Started / Started / Done, you can just add two checklist items: Start and Finish!
- Or if you don't want to use checklists, create these custom fields: *Started*, *Done* using Trello's **Custom Fields** Power-Up. You can always enable up to 1 Power-Up per board for free if you don't have a Trello Business Class account.
- Use **Due Dates** to mark tasks as urgent.
- Use the **Filter** from the board menu to see only the urgent cards using *Due in the next day*.
- You could also set up **Labels** to tag cards for a specific perspective, for example the ones selected for a demo release. Use the filter again to see only them!
- If you've got too many cards in a list, just archive the Done cards, or move them to a new list.

Known Bugs and Roadmap
----------------------

Currently, if you add Swimlanes to a board, moving cards after the first swimlane is buggy: the target position is often shifted by one or more cards. This is most probably due to the fact that a swmilane adds a 'div' which is taken into account by Trello to compute the target slot.

Check out the [Tredolist](https://trello.com/b/af1CpwBl/tredolist) Trello board to follow updates!

Another tool by Olivier Cado
----------------------------

Need a multi-swimlane calendar? A timeline that represents your time continuously when you travel across multiple timezones? Try out the [Calendoo Timeline](https://app.calendoo.net/Timeline). You can even search for the [cheapest flights](https://app.calendoo.net/flights) taking off in a large area, pin your favorite picks, and compare them easily on the timeline and on a map.

Contributors
------------

* Natalie Chouinard [@sudonatalie](https://github.com/sudonatalie), original author of List Layouts for Trello https://github.com/sudonatalie/layout-trello
* Thank you [@monovertex](https://github.com/sudonatalie/layout-trello/pull/7) for the (much appreciated) grid layout!
* Thank you [@zaucy](https://github.com/sudonatalie/layout-trello/pull/7) for local CSS!
* Thank you [@ck0z](https://github.com/sudonatalie/layout-trello/pull/8) for reporting breakage!
* Thank you [@ehsankooheji](https://github.com/sudonatalie/layout-trello/pull/11) for saved layout state!
* Thank you [@spellitwithaph](https://github.com/sudonatalie/layout-trello/pull/27) for the handy usage GIF!

