<?php

function search_webinars_endpoint()
{
    register_rest_route('api/', 'search', array(
        'methods'  => WP_REST_Server::READABLE,
        'callback' => 'get_results_webinars',
    ));
}
add_action('rest_api_init', 'search_webinars_endpoint');




function get_results_webinars($request)
{
    $get_list = $request['get_list'];
    if (isset($get_list)) {
        $tissue_children =  get_terms(array(
            'taxonomy' => 'tissue_type',
            'hide_empty' => false
        ));
        $segment_children =  get_terms(array(
            'taxonomy' => 'segment_type',
            'hide_empty' => false
        ));

        $list = [
            "segment_list" => $segment_children,
            "tissue_list" => $tissue_children,
        ];
        return $list;
    }


    $type = $request['type'];
    $cat = $request['category'];

    $search = $request['search'];

    if (!isset($type)) {
        $type = 'webinars';
    }


    $args = array(
        'post_type' => 'knowledge_library',
		'order' => 'DESC',
			'orderby' => 'date',
        'posts_per_page' => 6,
        'paged' => $request["page"],
        'meta_query' => array(
            array(
                'key' => 'select_a_category',
                'value'   => $type,
                'compare' => '=',
            ),
        ),
    );
    $q_metas = [];
    if ($search) {
        $q_metas = new WP_Query(array(
            'post_type' => 'knowledge_library',
			'order' => 'DESC',
			'orderby' => 'date',
            'posts_per_page' => 6,
            'paged' => $request["page"],
           	'meta_query' => array(
                'relation' => 'AND',
                array(
                    'key' => 'select_a_category',
                    'value'   => $type,
                    'compare' => '=',
                ),
                array(
                    'key' => 'abstract',
                    'value'   => $search,
                    'compare' => 'LIKE',
                ),
            ),
        ));


        $args['s'] = $search;
        $args['wpse_search_or_tax_query'] =  true;
        $args['tax_query'] = array(
            'relation' => 'OR',
            array(
                'taxonomy' => 'products',
                'field'    => 'name',
                'terms'    => $search,
            ),
            array(
                'taxonomy' => 'technique',
                'field'    => 'name',
                'terms'    => $search,
            ),
        );
    }
    if ($cat) {
        $args['category_name'] = 'featured';
    }


    $new_data = [];

    $posts = new WP_Query($args);
    $result = new WP_Query();
    if (!empty($posts) && !empty($q_metas)) {
        $result->posts = array_unique(array_merge($posts->posts, $q_metas->posts), SORT_REGULAR);
        $result->post_count = count($result->posts);
    } else {
        $result = $posts;
    }
  
    if ($result->have_posts()) {

        $pattern = '/\s*/m';
        $replace = '';
        while ($result->have_posts()) :

            $result->the_post();
            $id = get_the_ID();
            $thumbnail = get_field('thumbnail');
            $title = get_the_title($id);
            $content = apply_filters('the_content', get_the_content());
            $link = get_field('link');
            $journal_name = get_field("journal_name");
            $post_date = get_the_date('F j, Y', $id);
            $my_segment_types = get_the_terms($id, 'segment_type');
            $my_tissue_types = get_the_terms($id, 'tissue_type');
            $my_product_types = get_the_terms($id, 'products');




            $new_item = [
                "id" => $id,
                "thumbnail" => $thumbnail,
                "title" => $title,
                "content" => $content,
                "link" => $link,
                "date" => $post_date,
                "journal" => $journal_name,

                "tissue_types" => $my_tissue_types,
                "segment_types" => $my_segment_types,
                "product_types" => $my_product_types,



            ];


            array_push($new_data, $new_item);

        endwhile;

        return $new_data;
    }

    return [];
}
