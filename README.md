
TredoList
=========

TredoList turns Trello into a convenient todolist tool, by introducing:
* new list layouts
* new dynamic color themes

Here is how the [Tredolist](https://trello.com/b/af1CpwBl/tredolist) Trello board looks like in bright colors:

![Tredolist board](https://raw.githubusercontent.com/gwened/tredolist/master/screenshots/tredolist-board.png)

Forked from List Layouts for Trello.

Installation
------------

Coming soon...
Download and install the extension from here: [Chrome Web Store - Tredolist](https://chrome.google.com/webstore/detail/tredolist/...)

Usage
-----

When a Trello board is open in the current Chrome tab, click the button of the extension to open the main Tredolist settings panel:

![Tredolist Settings](https://raw.githubusercontent.com/gwened/tredolist/master/screenshots/tredolist-settings.png)

From there you can set the layout and the color theme, for this particular board or as the default.

Tredolist introduces the following conventions:
- A card having all checklists completed is considered **Done** (completed)
- A card having a checked custom field named *Done* is also considered Done (completed)
- A card having partially completed checklists is considered **Started** (in-progress)
- A card having a checked custom field named *Started* is also considered Started (in-progress)
- A card having \<a name\> in the title is considered **Waiting For** (blocked)
- A card having a checked custom field named *Waiting For* is also considered Waiting For (blocked)
- A card having a checked custom field named $Canceled is considered **Canceled**
- A card having a past due date or a due date set to today or tomorrow is considered **Urgent**.
- A card having (a title inside parenthesis) is considered to be postponed **For Later**

Roadmap
-------

Check out the [Tredolist](https://trello.com/b/af1CpwBl/tredolist) Trello board to follow updates!

**Contributors**
* Natalie Chouinard [@sudonatalie], original author of List Layouts for Trello https://github.com/sudonatalie/layout-trello
* Thank you [@monovertex](https://github.com/natalieperna/layout-trello/pull/7) for the (much appreciated) grid layout!
* Thank you [@zaucy](https://github.com/natalieperna/layout-trello/pull/7) for local CSS!
* Thank you [@ck0z](https://github.com/natalieperna/layout-trello/pull/8) for reporting breakage!
* Thank you [@ehsankooheji](https://github.com/natalieperna/layout-trello/pull/11) for saved layout state!
* Thank you [@spellitwithaph](https://github.com/natalieperna/layout-trello/pull/27) for the handy usage GIF!
