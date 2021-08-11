function truncate(input) {
  if (input.length > 5) {
    return input.substring(0, 5) + "...";
  }
  return input;
}

function termsArrayToHtml_webinars(data, type = "types") {
  if (data){
  return (
    `<option value="all">All ${type}</option>` +
    data
      .map(
        (item) =>
          `<option class='kw-option-${item.term_id}' value='${item.name}' >${item.name} </option>`
      )
      .join("")
  );
      }
}
async function setLists_webinars(segmentSelect_webinars,tissueSelect_webinars){
  const item_webinars = await getKnowledgeResults_webinars(null,null,'all','all',true)
  if (item_webinars){
    
  segmentSelect_webinars.innerHTML = termsArrayToHtml_webinars(item_webinars.segment_list);
  tissueSelect_webinars.innerHTML = termsArrayToHtml_webinars(item_webinars.tissue_list);
  }
}
async function getKnowledgeFeatured_webinars(type, page) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "X-WP-Nonce": ajax_var.nonce,
  });

  const response = await fetch(
    `${ajax_var.url}?type=${type}&page=${page}&category=featured`,
    {
      headers,
      credentials: "same-origin",
    }
  );
  const data = await response.json();
  return data;
}
async function getKnowledgeResultsSearch_webinars(type, page, searchText) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "X-WP-Nonce": ajax_var.nonce,
  });
  console.log(`${ajax_var.url}?type=${type}&page=${page}&search=${searchText}`);
  const response = await fetch(
    `${ajax_var.url}?type=${type}&page=${page}&search=${searchText}`,
    {
      headers,
      credentials: "same-origin",
    }
  );
  const data = await response.json();
  return data;
}
async function getKnowledgeResults_webinars(
  type,
  page,
  segmentType = "all",
  tissueType = "all",
  list = false
) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "X-WP-Nonce": ajax_var.nonce,
  });
  const url = list ? `${ajax_var.url}?get_list=true` : `${ajax_var.url}?type=${type}&page=${page}`

  const response = await fetch(url, {
    headers,
    credentials: "same-origin",
  });
  const data = await response.json();

  if (segmentType != "all")
    return data.filter((item) => {
      console.log(item.segment_types && item.segment_types.map((e) => e.name));
      if (
        item.segment_types &&
        item.segment_types.map((e) => e.name).includes(segmentType)
      )
        return true;
      return false;
    });
  if (tissueType != "all")
    return data.filter((item) => {
      if (
        item.tissue_types &&
        item.tissue_types.map((e) => e.name).includes(tissueType)
      )
        return true;
      return false;
    });
  return data;
}
function comp(a, b) {
    return new Date(a.result.date).getTime() - new Date(b.result.date).getTime();
}


async function addResults_webinars(
  array,
  wrapper,
  replace = false,
  thenloadMore = false,
   featured = false
) {
  let loadMore = true;
  if (replace) wrapper.innerHTML = "";
  let featuredCount = 0;
  if (array.length) {
    for (let item of array) {
		
		//console.log(item);
	 
	  if(featuredCount==3) break;
	  if(featured)
	  featuredCount++;
      let cardWrapper = document.createElement("div");
	  cardWrapper.className = "webinarsdiv webinars_"+item.id;
     // cardWrapper.href = item.link;
	 // cardWrapper.setAttribute("onClick", "openpopup('"+item.id+"')");
	  
	  
	  
      let card = document.createElement("div");
      card.className = `kw-card-container ${item.id}`;
      let cardThumb = document.createElement("img");
      cardThumb.src = item.thumbnail;
      let cardTitle = document.createElement("h3");
      cardTitle.innerHTML = item.title;
      let cardContent = document.createElement("div");
      cardContent.className = "kw-content-wrapper";
      cardContent.innerHTML = `${item.content.substring(0,254)}${item.content.length > 255 ? '...' : ''}`
      let cardBelowImg = document.createElement("p");
      cardBelowImg.className = "kw-below-img";
    
      if (item.product_types){
		  const productsChildren = item.product_types
          .filter((e) => e.parent);
		
		  if(productsChildren.length > 0)
		  cardBelowImg.innerHTML =  productsChildren[0].name 
	  }
       
		
       card.append(cardBelowImg, cardTitle, cardContent);
      cardWrapper.append(cardThumb, card);
      wrapper.appendChild(cardWrapper);
      
     
      loadMore = item.loadmore;
    }
  } else {
    if (thenloadMore == false)
      wrapper.innerHTML = "<h3 class='no-results'>No results found</h3>";
  }
 
}
jQuery(document).ready(async function ($) {
  const resultsWrapper_webinars = document.querySelector(".results-wrapper-webinars.normal");
  const resultsWrapperF_webinars = document.querySelector(".results-wrapper-webinars.featured");
  currentPage_webinars = 1;
  current_webinars = null;
  
  const searchInput_webinars = document.querySelector("input.search-input-webinars");
  const loader_webinars = document.querySelector(".lds-ring-webinars");
  //setLists_webinars(segmentSelect_webinars,tissueSelect_webinars)
  if (resultsWrapper_webinars) {
    await getKnowledgeFeatured_webinars("webinars", currentPage_webinars).then((data) =>
      addResults_webinars(data, resultsWrapperF_webinars,false,false,true)
    );
    await getKnowledgeResults_webinars("webinars", currentPage_webinars).then((data) =>
      addResults_webinars(data, resultsWrapper_webinars)
    );

    const loadMore_webinars = document.querySelector(".load-more-wrapper-webinars a");
    loadMore_webinars.addEventListener("click", async function () {
		
      if (current_webinars == "search") {
        await getKnowledgeResultsSearch_webinars(
          "webinars",
          ++currentPage_webinars,
          searchInput_webinars.value
        ).then((data) => {
          addResults_webinars(
            data,
            resultsWrapper_webinars,
            false,
            true
          );
          if (!data.length){ loadMore_webinars.style.display = "none";
	const noMore_webinars = document.createElement('h3')
	noMore_webinars.innerHTML = "No more results found"
	noMore_webinars.className = 'nomore'
 	resultsWrapper_webinars.appendChild(noMore_webinars)
						   }
        });
      } else {
        const data = await getKnowledgeResults_webinars(
          "webinars",
          ++currentPage_webinars
        ).then((data) => {
			
          if (!data.length){ 
				loadMore_webinars.style.display = "none";
				const noMore_webinars = document.createElement('h3')
				noMore_webinars.innerHTML = "No more results found"
				noMore_webinars.className = 'nomore'
				resultsWrapper_webinars.appendChild(noMore_webinars)
			}
			else{
         addResults_webinars(data, resultsWrapper_webinars);
        }
		});
      }
    });

    
    // Init a timeout variable to be used below
    let timeout_webinars = null;
	
    searchInput_webinars.onkeyup = async function () {
      clearTimeout(timeout_webinars);

      // Make a new timeout set to go off in 1000ms (1 second)
      timeout_webinars = setTimeout(async function () {
		 
        loader_webinars.style.display = "flex";
        resultsWrapper_webinars.style.opacity = 0.5;
        loadMore_webinars.style.display = "block";
        current_webinars = "search";
        await getKnowledgeResultsSearch_webinars(
          "webinars",
          1,
          searchInput_webinars.value
        ).then((data) => {
          //console.log(data.length)
          addResults_webinars(data, resultsWrapper_webinars, true);
          if (!data.length){ loadMore_webinars.style.display = "none";
	const noMore_webinars = document.createElement('h3')
	noMore_webinars.innerHTML = "No more results found"
	noMore_webinars.className = 'nomore'
 	resultsWrapper_webinars.appendChild(noMore_webinars)
						   }
        });
        loader_webinars.style.display = "none";
        resultsWrapper_webinars.style.opacity = 1;
      }, 1000);
    };
  }
});


