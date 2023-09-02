// handle tabs
const handleData = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/videos/categories"
  );
  const data = await res.json();

  const tabContainer = document.getElementById("tab-container");

  data.data.forEach((tab) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <button
        onclick="handleCard('${tab.category_id}')"
        class="btn normal-case md:text-lg font-medium font-color-1 hover:text-white focus:text-white btn-color-2 hover:bg-[#ff1f3d] focus:bg-[#ff1f3d] rounded-md"
      >
        ${tab.category}
      </button>
    `;

    tabContainer.appendChild(div);
  });

  handleCard("1000", true);
};

// handle cards
let sortByViewDescending = true;
let currentCategoryId = "1000";

const handleCard = async (categoryId, sortByView = false) => {
  if (currentCategoryId !== categoryId || sortByView) {
    currentCategoryId = categoryId;

    const res = await fetch(
      `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
    );
    const data = await res.json();

    // handle no content
    const noContent = document.getElementById("no-content");
    const dataLength = data.data.length;

    if (!dataLength) {
      noContent.removeAttribute("hidden");
    } else {
      noContent.setAttribute("hidden", "");
    }

    // sort cards by view count
    const sortCardsByView = () => {
      data.data.sort(
        (a, b) => parseFloat(b.others.views) - parseFloat(a.others.views)
      );
    };

    // Sort the cards by view count
    if (sortByView) {
      sortByViewDescending = !sortByViewDescending;
      sortCardsByView();
    }

    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";

    data.data.forEach((card) => {
      const dateString = card.others.posted_date;
      const date = parseFloat(dateString);
      const hrs = Math.floor(date / 3600);
      const min = Math.floor((date % 3600) / 60);

      const div = document.createElement("div");

      div.innerHTML = `
        <div>
          <div class="relative">
            <img class="rounded-lg w-full h-44" src="${
              card.thumbnail
            }" alt="" />
            <p class="absolute bottom-3 right-3 text-[10px] text-white rounded-md px-2 py-1 ${
              card.others.posted_date ? "" : "hidden"
            } ${card.others.posted_date ? "bg-[#171717]" : "bg-transparent"}">
              ${card.others.posted_date ? `${hrs}hrs ${min}min ago` : ""}
            </p>
          </div>
          <div class="flex justify-start items-start gap-3 pt-4 md:pt-5">
            <img class="w-10 h-10 rounded-full" src="${
              card.authors[0].profile_picture
            }" alt="" />
            <div>
              <h3 class="font-bold font-color-3">${card?.title}</h3>
              <div class="flex gap-2 py-2">
                <p class="text-sm font-color-4">${
                  card.authors[0].profile_name
                }</p>
                <img src="${
                  card.authors[0].verified ? "./image/badge.png" : "-"
                }" alt="" />
              </div>
              <p class="text-sm font-color-4">${
                card.others.views ? card.others.views : arraySort
              } views</p>
            </div>
          </div>
        </div>
      `;

      cardContainer.appendChild(div);
    });
  }
};

// handle sorting by view count
const sortCardsByView = () => {
  handleCard(currentCategoryId, true);
};

handleData();
