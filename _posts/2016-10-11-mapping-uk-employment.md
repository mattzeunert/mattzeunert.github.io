---
layout: post
title: Mapping UK Employment
date: 2016-10-11
---

I made a map showing [employment across industries in different parts of the UK](http://www.mattzeunert.com/uk-employment). This post describes how some of the problems involved in the programming and design and my solutions.

The aim was to get a more accurate idea of what industries are more prevalent in a particular region.

![Computer programming employment by region](/img/blog/uk-employment/programmer-employment.png)

## Finding employment data

I didn't have a preference to map either turnover or employment, but it was easy to find employment data, so I went with that.

To get started I used an Office for National Statistics dataset on ["Enterprise/local units by 2 Digit SIC, Employment size band and Region"](http://web.ons.gov.uk/ons/data/web/explorer/dataset-finder/-/q/dcDetails/Economic/UKBABa?p_p_lifecycle=1&_FOFlow1_WAR_FOFlow1portlet_dataset_navigation=datasetCollectionDetails). That allowed me to get some initial data and start analyzing it.

For statistical purposes UK businesses are grouped by SIC codes. SIC stands for Standard Industrial Classification of Economic Activities. For example, the 2 digit SIC code 86 comprises "Human health" and the 3 digit SIC code 861 represents "Hospital activities". Both codes are part of Section Q, "Human health and social work activities".

The dataset gave me a breakdown by 2 digit SIC and UK region (e.g. "South East").

Unfortunately, this dataset had one big downside: it showed the number of businesses, not how many people work in the industry. So initially I had to make a guess based on the employment size band information in the dataset,
so if the range for the number of employees was 20-49 I treated that as 35.

That meant I couldn't make any reliable claims, so I looked around
and eventually found this [Excel file](http://www.ons.gov.uk/ons/rel/bus-register/business-register-employment-survey/2010/rft-bres-2010-table-5--region-by-industry--3-digit-.xls) which contains employment numbers for each sector. (Employment includes part-time and full-time employees, as well as working business owners.)

Still, this data was from 2010. I emailed the ONS to ask if there's a newer version of that spreadsheet, but the link they replied with didn't include a regional breakdown.

Eventually I read an ONS article that contaiend a footnote saying that you can get detailed data from [Nomis](https://www.nomisweb.co.uk/), an ONS service for labor market statistics. It's not possible to link to the  dataset I used directly, but I started by selecting "Business Register and Employment Survey" [in their query form](Business Register and Employment Survey).

The new data didn't include Northern Ireland, so I kept using the 2010 data for it.

For each of the three datasets I had to write a Node script to convert one or more CSV files into a JSON file. In retrospect, I could have saved some time by picking a better dataset upfront.

## Finding a regional map of the UK

Martin Chorley has a Github repository that contains [UK map data](http://martinjc.github.io/UK-GeoJSON/). I found it difficult to find the correct file in the repo, since Github only displays GeoJSON data, but not the more compact TopoJSON that is contained in the reposity.

Because of that I used the [demo website](http://martinjc.github.io/UK-GeoJSON/) to select the map data I needed.

![](/img/blog/uk-employment/uk-geojson.png)

Instead of a single TopoJSON file for the UK I downloaded one file each for England, Wales, Scotland and Northern Ireland. To avoid downloading them individually when viewing the map I needed to join them together.

Also, the Northern Ireland map was split into different electoral wards which had to be merged into one region. It took me a while and I don't fully remember how I did it, but it involved using [`topojson.mesh`](https://github.com/mbostock/topojson/wiki/API-Reference#mesh) in the console and copy-pasting GeoJSON into an online TopoJSON converter.

To merge the different map files I manually renamed the object names to be unique (to avoid multiple ones called `eer`, which would overwrite each other.) Then I ran this [topojson](https://www.npmjs.com/package/topojson) command in a terminal window

{% highlight bash %}
topojson -p -o uk.json -- scotland.json wales.json england.json northern-ireland.json
{% endhighlight %}

Finally, I simplified the map data to reduce its file size.

{% highlight bash %}
topojson -p -o  uk2-simplified.json --simplify-proportion .10 -- uk2.json
{% endhighlight %}

One downside of stitching the map together from different source files was that I couldn't render interior boundaries on my map, since the regions didn't share the exact same map boundary points.

![Boundaries work within England, but are intermittent at border to Scotland](/img/blog/uk-employment/fuzzy-boundaries.png)

Maybe I could have saved myself that hassle by spending more time looking for files in the Github repo instead of downloading them from the demo site.

## UI Design

The design come about as a combination of paper sketches and a lot of trial and error.

![](/img/blog/uk-employment/progress.gif)

## Table Data

If I were to just show the largest sectors in the table the information would be incredibly boring. You'd always see education, retail, health and food/beverage service as the largest sectors.

To avoid that, I compared the regional employment value to the UK average and showed the industries with the starkest differences.

![Bar visualization instead of a longer table](/img/blog/uk-employment/bar.png)

Originally I also had a bar at the bottom of the page where the entire width would represent 100% of employment. The height of each column indicated the size of the industry relative to the whole of the UK.

This made it clear that the industries that were shown in the table weren't necessarily the most important ones. It also made it possible to select many more industries than were shown in the table.

However, the bar didn't quite fit into the design and small sectors were difficult to click on. For these reasons I ultimately removed the bar from the page.

To substitute for the information and interactions provided by the bar visualization I added a list of the largest industries in a given region to the table. To allow more serendipitous discoveries I also added a section with random sectors.

![Northern Ireland Employment Table](/img/blog/uk-employment/table.png)

### Designing with screenshots in mind

One design goal was to make it easy to create re-usable screenshots showing the distribution of different industries across the UK.

Primarily that meant showing the industry name below the map, so the screenshot doesn't need further explanation. Instead of showing industry details there I moved that information to hover states on the table and the industry name.

![](/img/blog/uk-employment/no-region-selected.png)

I also made it possible to deselect a region. That's not a useful feature when interacting with the map, but it made it hides the removes the map outline to allow for better-looking screenshots.

### Mobile

![](/img/blog/uk-employment/mobile-portrait.png)

Moving the table below the map makes it harder to explore the data. Every time you select a new industry the app scrolls back to the top to show the map, and then you have to scroll down again.

So, in portrait mode, I made the map as small as possible to reduce the amount of scrolling that's required.

On landscape I ended up using two-column desktop view because it doesn't have the same UX issues.

![](/img/blog/uk-employment/mobile-landscape.png)

Since it's hard to select small regions on the map, particularly London, I had to add a dropdown.

![](/img/blog/uk-employment/dropdown.png)

As a normal dropdown wouldn't have fit into the design I used [Select2](http://select2.github.io/) to be able to customize the CSS.

## Code

I spent around 40h on the project in total, so my I really prioritized speed of development over maintainability. Since it was a side project there was also a risk that I'd give up after 20h, so it was important to get some kind of result quickly, even if that added a few more hours in the end.

### Views

The code is very old-fashioned. For example, I'm building my dropdown by slowly concatenating strings:

{% highlight javascript %}
html += "<div style='overflow: hidden;' class='region-title'>"
    html += "<select class='region-dropdown needsclick'>"
        regions.sort().forEach(function(r){
            html += "<option " + (r==region ? "selected" :"") + ">" + r + "</option>"
        })
    html += "</select>"
html += "</div>"
{% endhighlight %}

(I would normally use an ES2015 template string for this, but I wanted to ensure decent browser support, and didn't want the extra work required to setup up Babel.)

One downside of doing it this way is that I can only replace the full table at once, which makes transitions difficult. It is also less performant, but I didn't find the impact to be meaningful.

### Application state

I used a Backbone model to manage the application state. I have an `appState` model like this:

{% highlight json %}
{
    "randomSectors": [
        "Repair and installation of machinery and equipment",
        "Security and investigation activities"
    ],
    "selectedRegion": "South East",
    "selectedSector": "Education",
    "previewRegion": null,
    "previewedSector": null
}
{% endhighlight %}

Then different parts of my app can listen to particular changes with `appState.on("change:selectedRegion")` for example.

I really enjoyed working with Backbone models again! Recently, I've been using either Redux or React component state, but for many projects a global state object with change listeners is so much easier!

## Try It

If you're interested in building something similar, take a look at the [code on Github](https://github.com/mattzeunert/uk-employment-map).

Otherwise, [you can try out the map yourself](http://www.mattzeunert.com/uk-employment).
