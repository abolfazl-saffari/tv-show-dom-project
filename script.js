const $ = document;
const cardsContainerElem = $.querySelector("main");
const searchInput = $.querySelector("input");
const episodeMatch = $.querySelector(".episodeMatch");
const episodeMatchSelect = $.querySelector("select");
let seriesData = [];

fetch("https://api.tvmaze.com/shows/82/episodes")
  .then((res) => res.json())
  .then((data) => {
    seriesData = [...data];
    cardGenerator(seriesData);
    optionGenerator(seriesData);
  });

function cardGenerator(data) {
  let allCards = "";
  // rating: {average: 7.7}
  cardsContainerElem.innerHTML = "";
  data.forEach((card) => {
    const cardElem = `
    <div class="card" >
      <img
      src="${card.image.medium}"
      class="card-img-top"
      />
      <div class="card-body">
          <h5 class="card-title title m-0">${card.name}</h5>
          <h6 class='mt-1'>
          S${seasonAndEpisode(card.season)}E${seasonAndEpisode(card.number)}
          </h6>
          <div class='summaryWrapper'>
            <div class='summary'>
              ${card.summary}
            </div>
          </div>
          <a href=${
            card.url
          } target=”_blank” class="btn btn-primary mt-4">More about this episode</a>
      </div>
    </div>
  `;
    allCards += cardElem;
  });
  cardsContainerElem.innerHTML += allCards;
}

function optionGenerator(data) {
  let allOptions = "";

  data.forEach((card) => {
    const optionElem = `
    <option value="${card.name}">S${seasonAndEpisode(
      card.season
    )}E${seasonAndEpisode(card.number)} - ${card.name}</option>`;
    allOptions += optionElem;
  });
  episodeMatchSelect.innerHTML += allOptions;
}

function seasonAndEpisode(n) {
  return n < 10 ? `0${n}` : n;
}

function episodeSearch(input) {
  const filteredCards = [...seriesData].filter(
    (card) =>
      card.name.toLocaleLowerCase().includes(input) ||
      pTagRemover(card.summary).toLocaleLowerCase().includes(input)
  );
  if (filteredCards.length == 0) {
    cardsContainerElem.innerHTML = "<h5>There is nothing to show.</h5>";
  } else {
    cardGenerator(filteredCards);
  }
  episodeMatch.innerHTML = `Episodes that matches ${filteredCards.length}.`;
}

function episodeSelect(select) {
  if (select === "All episodes") {
    cardGenerator([...seriesData]);
  } else {
    const filteredEpisode = [...seriesData].filter(
      (episode) => episode.name === select
    );
    cardGenerator(filteredEpisode);
  }
}

function pTagRemover(pTag) {
  return pTag.replace("<p>", "").replace("</p>", "");
}

searchInput.addEventListener("input", (e) =>
  episodeSearch(e.target.value.trim().toLocaleLowerCase())
);
episodeMatchSelect.addEventListener("input", (e) => {
  episodeSelect(e.target.value);
});
