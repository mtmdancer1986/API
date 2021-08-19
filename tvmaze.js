const MISSING_IMAGE_URL = "https://tinyurl.com/tv-missing";

async function searchShows(query) {
    const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
    let shows = response.data.map(result => {
        let show = result.show;
        return {
            id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image ? show.image.medium : MISSING_IMAGE_URL,
        };
    });
    return shows;
}

// return [{
//     id: 1767,
//     name: "The Bletchley Circle",
//     summary: "<p><b>The Bletchley Circle</b> follows the journey of four ordinary women with extraordinary skills that helped to end World War II.</p><p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their normal lives, modestly setting aside the part they played in producing crucial intelligence, which helped the Allies to victory and shortened the war. When Susan discovers a hidden code behind an unsolved murder she is met by skepticism from the police. She quickly realises she can only begin to crack the murders and bring the culprit to justice with her former friends.</p>",
//     image: "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
// }]




/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
    const $showsList = $("#shows-list");
    $showsList.empty();

    for (let show of shows) {
        let $item = $(
            `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class = "card-img-top src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `);

        $showsList.append($item);
    }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
    evt.preventDefault();

    let query = $("#search-query").val();
    if (!query) return;

    $("#episodes-area").hide();

    let shows = await searchShows(query);

    populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
    let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

    let epi = response.data.map(episode => ({
        id: episode.id,
        name: episode.name,
        season: episode.season,
        number: episode.number,
    }));
    return epi;
}

function populateEpisodes(show) {
    const list = $('#episodes-list');
    list.empty();

    for (let shows of show) {
        let newLine = $(
            `<li>
            ${shows.name}
            (season ${shows.season}, episode ${shows.number})
            </li>`
        );
        list.append(newLine);
    }
    $('#episodes-area').show();
}
$("#shows-list").on("click", ".get-episodes", async function handleEpisodes(e) {
    let showID = $(e.target).closest(".Show").data("show-id");
    console.log(showID);
    let episodes = await getEpisodes(showID);
    populateEpisodes(episodes);
})