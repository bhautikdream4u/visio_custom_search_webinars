<?php
add_shortcode('custom_search_brochures_shortcode', 'custom_search_brochures_shortcode');
function custom_search_brochures_shortcode()
{

?>
	
    <div class="custom-search-wrapper">
        <div class="featured-wrapper">
			<div class="container">
				<div class="row">
					<h2>Featured Webinars</h2>
					<div class="results-container">
						<div class="lds-ring-webinars">
							<div></div>
							<div></div>
							<div></div>
							<div></div>
						</div>
						<div class="results-wrapper-webinars featured">

						</div>
					</div>
				</div>
			</div>
        </div>
        <div class="search-wrapper">
			<div class="container">
				<div class="row" style="display: flex; flex: 1; justify-content: space-around;">
					
					<div class="box-search field">
						<h2 class="search-title" style="text-indent: -9999px; overflow: hidden;">Search</h2>
						<input type="text" class='search-input-webinars' placeholder="Search Webinars...">
						<div class="line"></div>
					</div>
				</div>
			</div>
        </div>
    </div>
    <div class="results-container">
		<div class="container">
			<div class="row">
				<div class="lds-ring-webinars">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<div class="results-wrapper-webinars normal">

				</div>
			</div>
		</div>
    </div>
    <div class="load-more-wrapper-webinars">
		<div class="container">
			<div class="row">
				<p><a class="btn big pink">Load More</a></p>
			</div>
		</div>
    </div>


<?php
}
