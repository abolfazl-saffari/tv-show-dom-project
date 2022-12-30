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

function optionGenerator(data) {
  data.forEach((card) => {
    console.log(card);
    const optionElem = `<option value="${card.name}">S${
      card.season < 10 ? `0${card.season}` : card.season
    }E${card.number < 10 ? `0${card.number}` : card.number} - ${
      card.name
    }</option>`;
    episodeMatchSelect.innerHTML += optionElem;
  });
}

function cardGenerator(data) {
  cardsContainerElem.innerHTML = "";
  data.forEach((card) => {
    const cardElem = `
    <div class="card" style="width: 18rem">
      <img
      src="${card.image.medium}"
      class="card-img-top"
      />
      <div class="card-body">
          <h5 class="card-title title m-0">${card.name}</h5>
          <h6 class='mt-1'>
          S${card.season < 10 ? `0${card.season}` : card.season}E${
      card.number < 10 ? `0${card.number}` : card.number
    }
          </h6>
          <div class='summary'>
            ${card.summary}
          </div>
          <a href=${
            card.url
          } target=”_blank” class="btn btn-primary mt-4">More about this episode</a>
      </div>
    </div>
  `;
    cardsContainerElem.innerHTML += cardElem;
  });
}

searchInput.addEventListener("input", (e) =>
  episodeSearch(e.target.value.trim().toLocaleLowerCase())
);
episodeMatchSelect.addEventListener("input", (e) => {
  episodeSelect(e.target.value);
});

function episodeSearch(input) {
  const filteredCards = [...seriesData].filter(
    (card) =>
      card.name.toLocaleLowerCase().includes(input) ||
      pTagRemover(card.summary).toLocaleLowerCase().includes(input)
  );
  cardGenerator(filteredCards);
  filteredCards.length === seriesData.length
    ? (episodeMatch.innerHTML = "Episodes that matches 0")
    : (episodeMatch.innerHTML = `Episodes that matches ${filteredCards.length}.`);
}

function episodeSelect(select) {
  let filteredEpisode = [...seriesData].filter(
    (episode) => episode.name === select
  );
  window.open(filteredEpisode[0].url, "_blank");
}

function pTagRemover(pTag) {
  return pTag.replace("<p>", "").replace("</p>", "");
}
