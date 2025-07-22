<?php
function blindmatrix_v4_get_api_url(){
    return !empty(get_option('Api_Url')) ? rtrim(get_option('Api_Url'), '/'):'';
}
function blindmatrix_v4_get_api_name(){
    return !empty(get_option('Api_Name')) ? get_option('Api_Name'):'';
}
function blindmatrix_v4_get_appointment_api_url(){
    return !empty(get_option('option_blindmatrix_appointment_api_url')) ? rtrim(get_option('option_blindmatrix_appointment_api_url'), '/'):'';
}
function blindmatrix_v4_get_appointment_api_name(){
    return !empty(get_option('option_blindmatrix_appointment_api_name')) ? rtrim(get_option('option_blindmatrix_appointment_api_name'), '/'):'';
}
function blindmatrix_v4_get_appointment_api_key(){
    return !empty(get_option('option_blindmatrix_appointment_api_key')) ? rtrim(get_option('option_blindmatrix_appointment_api_key'), '/'):'';
}
/**
 *
 * all globel veriable list 
 *
 */ 
function global_blinds_variables_v4() {
    global $v4_product_page;
    global $v4_color_list_page;
    global $v4_brands_page;
    global $v4_product_grouping_page;
    global $v4_all_product_listing_page;
    global $v4_product_visualizer_page;
    global $v4_shutter_visualizer_page;
    global $v4_shutter_page;
    global $fabric_image_file_path;
    global $shuttermaterial_image_file_path;
    global $image_file_path;
    global $img_file_path_url;
    global $category_img_file_path;
    global $sample_img_frame_url;
    global $base_site_url;
    global $width_id_arr;
    global $drop_id_arr;
    $width_id_arr               = [7,8,11,31];   // 7 - Numeric - x Footage, 8 - X Square Meterage, 11 - blinds width, 31 - X Square Yard;
    $drop_id_arr                = [9,10,12,32];  // 9 - Numeric - Y Footage, 10 - Y Square Meterage, 12 - blinds drop, 32 - Y Square Yard;
    $base_site_url              = get_site_url();
    $v4_product_page            = blindmatrix_v4_get_page_slug('products');
    $v4_color_list_page         = blindmatrix_v4_get_page_slug('shop-by-colors');
    $v4_brands_page             = blindmatrix_v4_get_page_slug('suppliers');
    $v4_product_grouping_page   = blindmatrix_v4_get_page_slug('product-grouping');
    $v4_product_visualizer_page = blindmatrix_v4_get_page_slug('product_view');
    $v4_shutter_page            = blindmatrix_v4_get_page_slug('shutters');
    $v4_shutter_visualizer_page = blindmatrix_v4_get_page_slug('shutter_view');
    $v4_all_product_listing_page = blindmatrix_v4_get_page_slug('all-products');
    $image_file_path            = blindmatrix_v4_get_api_url().'/api/public';
    $category_img_file_path     = blindmatrix_v4_get_api_url().'/api/storage/app/public/';
    $sample_img_frame_url       = plugin_dir_url( __FILE__ ).'Shortcode-Source/images/fabric.png';  
    $img_file_path_url          = blindmatrix_v4_get_api_url().'/api/public/storage/';
    $fabric_image_file_path     = blindmatrix_v4_get_api_url().'/api/public/storage/attachments/'.blindmatrix_v4_get_api_name().'/material/colour/';
    $shuttermaterial_image_file_path     = blindmatrix_v4_get_api_url().'/api/public/storage/attachments/'.blindmatrix_v4_get_api_name().'/material/shuttermaterial/';
}
add_action( 'after_setup_theme', 'global_blinds_variables_v4' );
/**
 *
 * default seceted image file path return 
 *
 */ 
function getdefaultselectedimageurl($foldername,$productid,$imagename){
global $img_file_path_url ;
    if('productimages' == $foldername){
        $image_file_path = $img_file_path_url.'attachments/'.blindmatrix_v4_get_api_name().'/'.$foldername.'/'.$productid.'/'.$imagename;
    }else{
        $image_file_path = $image_file_path.'/storage/attachments/'.blindmatrix_v4_get_api_name().'/'.$foldername.'/'.$productid.'/'.$imagename;
    }
    $product_img_url  = blindmatrix_v4_validate_upload_image_curl_request(esc_url_raw($image_file_path));
        if ( !$product_img_url ) {
             $deafault_image_url = plugin_dir_url( __FILE__ ).'Shortcode-Source/images/no-image.jpg';
         }
        else{
            $deafault_image_url = $image_file_path;
        }
    return $deafault_image_url;
}
/**
 *
 * all custom value list 
 *
 */ 
function custom_rewrite_tag_v4() {
    add_rewrite_tag('%fieldscategoryname%', '([^&]+)');
    add_rewrite_tag('%productname%', '([^&]+)');
    add_rewrite_tag('%fabricname%', '([^&]+)');
    add_rewrite_tag('%fabricid%', '([^&]+)');
    add_rewrite_tag('%colorid%', '([^&]+)');
    add_rewrite_tag('%typeid%', '([^&]+)');
    add_rewrite_tag('%pricegroupid%', '([^&]+)');
    add_rewrite_tag('%mapid%', '([^&]+)');
    add_rewrite_tag('%supplierid%', '([^&]+)');
    add_rewrite_tag('%colorname%', '([^&]+)');
    add_rewrite_tag('%brands%', '([^&]+)');
    add_rewrite_tag('%groupname%', '([^&]+)');
    add_rewrite_tag('%categoryname%', '([^&]+)');
    add_rewrite_tag('%categoryvalue%', '([^&]+)');
    add_rewrite_tag('%pageno%', '([^&]+)');
    add_rewrite_tag('%productid%', '([^&]+)');
  }
  add_action('init', 'custom_rewrite_tag_v4', 10, 0);
 /**
 *
 * all custom value page list 
 *
 */ 
function custom_rewrite_rule_v4() {
    global $v4_product_page;
    global $v4_shutter_page;
    global $v4_color_list_page;
    global $v4_product_visualizer_page;
    global $v4_shutter_visualizer_page;
    global $v4_brands_page;
    global $v4_product_grouping_page;
    global $v4_all_product_listing_page;
    $products_page_id       = blindmatrix_v4_products_page_id();
    $color_list_id          = blindmatrix_v4_color_list_page_id();
    $product_view_page_id   = blindmatrix_v4_product_view_page_id();
    $shutter_view_page_id   = blindmatrix_v4_shutter_view_page_id();
    $shutter_list_page_id   = blindmatrix_v4_shutter_list_page_id();
    $brands_page_id         = blindmatrix_v4_brands_page_id();
    $v4_product_grouping_page_id = blindmatrix_v4_product_grouping_page_id();
    $v4_all_product_listing_page_id = blindmatrix_v4_all_product_listing_page_id();
	add_rewrite_rule('^'.$v4_product_page.'/([^/]*)/([^/]*)/?','index.php?page_id='.$products_page_id.'&fieldscategoryname=$matches[1]&productname=$matches[2]','top');
	add_rewrite_rule('^'.$v4_brands_page.'/([^/]*)?','index.php?page_id='.$brands_page_id.'&brands=$matches[1]','top');
	add_rewrite_rule('^'.$v4_shutter_page.'/([^/]*)/([^/]*)/?','index.php?page_id='.$shutter_list_page_id.'&productid=$matches[1]&typeid=$matches[2]','top');
	add_rewrite_rule('^'.$v4_product_grouping_page.'/([^/]*)?','index.php?page_id='.$v4_product_grouping_page_id.'&groupname=$matches[1]','top');
	add_rewrite_rule('^'.$v4_color_list_page.'/([^/]*)/?','index.php?page_id='.$color_list_id.'&colorname=$matches[1]','top');
	add_rewrite_rule('^'.$v4_all_product_listing_page.'/([^/]*)/([^/]*)/([^/]*)/?','index.php?page_id='.$v4_all_product_listing_page_id.'&categoryname=$matches[1]&categoryvalue=$matches[2]&pageno=$matches[3]','top');
	add_rewrite_rule('^'.$v4_shutter_visualizer_page.'/([^/]*)/([^/]*)/([^/]*)/?','index.php?page_id='.$shutter_view_page_id.'&productid=$matches[1]&fabricid=$matches[2]&colorid=$matches[3]','top');
    add_rewrite_rule('^'.$v4_product_visualizer_page.'/([^/]*)/([^/]*)/([^/]*)/([^/]*)/([^/]*)/([^/]*)/([^/]*)/([^/]*)/?','index.php?page_id='.$product_view_page_id.'&fieldscategoryname=$matches[1]&productname=$matches[2]&fabricname=$matches[3]&fabricid=$matches[4]&colorid=$matches[5]&mapid=$matches[6]&pricegroupid=$matches[7]&supplierid=$matches[8]','top');
}
add_action('init', 'custom_rewrite_rule_v4', 10, 0);
/**
 *
 * custom style and script file enque
 *
 *
 */
add_action('wp_enqueue_scripts', 'v4_frontend_styles');
function v4_frontend_styles() {
    // all css file enque
    $primary_color = get_option('blindmatrix_pri_color', "#00c2ff");
    $secondary_color = get_option('blindmatrix_secondary_color', "#002746");
	$url = plugins_url('assets/image/Right-2.png',plugin_basename(__FILE__));
    $css = '';
    $css .= "
    :root {
        --color-primary: $primary_color;
        --color-secondary: $secondary_color;
    }
	.blindmatrix-v4-parameter-wrapper .blindmatrix-v4-color-data-wrapper div.selected:before{
		background-image: url($url);
	}"; 
    $css = $css.get_option('blindmatrix_v4_custom_css','');
    wp_enqueue_style( 'dashicons' ); 
    wp_enqueue_style( 'blindmatrix-v4-select2-css', plugins_url( 'assets/css/select2.min.css', plugin_basename(__FILE__) ) );
    wp_enqueue_style( 'blindmatrix-v4-bootstrap-css',plugins_url('assets/css/bootstrap.min.css', plugin_basename(__FILE__) ));
    wp_enqueue_style( 'blindmatrix-v4-fontawesome-css',plugins_url('assets/css/all.min.css', plugin_basename(__FILE__) ));
    wp_enqueue_style( 'blindmatrix-v4-slider-css',plugins_url('assets/css/slick.min.css', plugin_basename(__FILE__) ));
    wp_enqueue_style( 'blindmatrix-v4-confirm-css',plugins_url('assets/css/jquery-confirm.min.css', plugin_basename(__FILE__) ));
    wp_enqueue_style( 'blindmatrix_v4-configurator-css', plugins_url('assets/css/configurator.css', plugin_basename(__FILE__) ));
    wp_register_style( 'blindmatrix_apiv4', plugins_url('assets/css/frontend.css', plugin_basename(__FILE__) ));
    wp_enqueue_style( 'blindmatrix_apiv4' );
    wp_register_style( 'bmf-inline-style', false, array(), '1.0' ); 
	wp_enqueue_style( 'bmf-inline-style' );
	wp_add_inline_style('bmf-inline-style', $css);
    // all js file enque
	wp_enqueue_script( 'blindmatrix-v4-select2-js', plugins_url( 'assets/js/select2.min.js', plugin_basename(__FILE__) ), array( 'jquery'));
    wp_enqueue_script( 'blindmatrix-v4-bootstrap-js', plugins_url( 'assets/js/bootstrap.bundle.min.js', plugin_basename(__FILE__) ), array( 'jquery'));
    wp_enqueue_script( 'blindmatrix-v4-slider-js', plugins_url( 'assets/js/slick.min.js', plugin_basename(__FILE__) ), array( 'jquery'));
    wp_enqueue_script( 'blindmatrix-v4-confirm-js', plugins_url( 'assets/js/jquery-confirm.min.js', plugin_basename(__FILE__) ), array( 'jquery'));
    wp_register_script('frontend_custom_js', plugins_url( 'assets/js/frontend.js', plugin_basename(__FILE__) ), array('jquery','jquery-blockui', 'blindmatrix-v4-select2-js','blindmatrix-v4-slider-js','blindmatrix-v4-confirm-js','blindmatrix-v4-bootstrap-js'));
    wp_enqueue_script('frontend_custom_js');
    wp_localize_script( 'frontend_custom_js', 'v4_ajax_object', array( 'ajax_url' => admin_url( 'admin-ajax.php' ),'cart_url'=>get_permalink( wc_get_page_id( 'cart' )),'checkout_url'=>get_permalink( wc_get_page_id( 'checkout' )),
    'quote_form' => generateQuoteForm()));
}

function generateQuoteForm() {
    ob_start();
    ?>
    <form method="post"  class="blindmatrix-v4-get-quote-form">
        <div class="form-group">
            <label>Email</label>
            <input type="email" name="quote_email"  placeholder="Enter your email"  />
            <label>Phone</label>
            <input type="tel" name="quote_phone"  placeholder="Enter your phone number"  />
            <label>Notes</label>
            <textarea name="quote_notes" rows="4" cols="50"></textarea>
        </div>
    </form>
    <?php
    $formHtml = ob_get_clean();
    return $formHtml;
}
/**
 *
 * store get product details
 *
 */
add_action('init','get_product_list_data');
function get_product_list_data(){
    // $get_product_list_data = CallAPI_v4("POST","getproductsdetails",array());
    // update_option( 'v4_productlistdata', $get_product_list_data);
}
/**
 *
 * v4 api call function
 *
 */
function CallAPI_v4($method,$pass_data ,$data = false,$node = false, $appointment_api_credentials = [])
{

    $api_url  = blindmatrix_v4_get_api_url();
    $api_name = blindmatrix_v4_get_api_name();
    $api_key  = !empty(get_option('Api_Key')) ? get_option('Api_Key'):''; 
	if (is_array($appointment_api_credentials) &&
		isset($appointment_api_credentials['api_url'], $appointment_api_credentials['api_key'], $appointment_api_credentials['api_name'])) {
		$api_url  = $appointment_api_credentials['api_url'];
		$api_key  = $appointment_api_credentials['api_key'];
		$api_name = $appointment_api_credentials['api_name'];
	}
	
	try{
		$myobheader  = array(
		'Accept: application/json',
		'Content-Type: application/json',
		"companyname:$api_name",
		'platform: Ecommerce',
		"Ecommercekey:$api_key",
		'activity: {"ipaddress":"","location":"","devicenameversion":"","browsernameversion":""}'
        );
        if($node == true){
            $url = $api_url.'/'.'nodeapi/';
        }else{
            $url = $api_url.'/api/public/api/';
        }
        $url = $url.$pass_data;
        $curl = curl_init();
        switch ($method)
        {
            case "POST":
                curl_setopt($curl, CURLOPT_POST, 1);
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
            case "PUT":
                curl_setopt($curl, CURLOPT_PUT, 1);
            break;
            default:
                if ($data)
                    $url = sprintf("%s&%s", $url, http_build_query($data));
        }
        curl_setopt($curl, CURLOPT_HTTPHEADER, $myobheader);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_FRESH_CONNECT, 1); // don't use a cached version of the url
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4 );
        $result = curl_exec($curl);
        if (curl_errno($curl)) {
            $error_msg = curl_error($curl);
            blindmatrix_v4_custom_logs($error_msg);
            return "";
        }
        curl_close($curl);
        return json_decode($result);
    }
    catch(Exception $e){
        $error_message = $e->getMessage();
        blindmatrix_v4_custom_logs($error_message);
    }
}

function blindmatrix_v4_custom_logs($message){ 
    if(is_array($message)) { 
        $message = json_encode($message); 
    } 
    $file = fopen("custom_logs.log","a"); 
    fwrite($file, "\n" . date('Y-m-d h:i:s') . " :: " . $message); 
    fclose($file); 
}

/**
 *
 * custom shortcode create
 *
 *
 */
function BlindMatrix_Hub_v4($attrs, $content = null) {
	$buffer='';
    if (isset($attrs['source'])) {
        $file = strip_tags($attrs['source']);
        if ($file[0] != '/'){
            $theme_file_path = get_stylesheet_directory().'/'.basename( plugin_dir_url(__FILE__) ).'/'.$file.'.php';
			$file = untrailingslashit( plugin_dir_path( __FILE__) ).'/Shortcode-Source/'. $file .'.php';
			if(file_exists($theme_file_path )){
				$file = $theme_file_path;
			}
        }
            
        ob_start();
        include($file);
        $buffer = ob_get_clean();
        $buffer = do_shortcode($buffer);
    }
    return $buffer;
}
add_shortcode('BlindMatrixv4', 'BlindMatrix_Hub_v4');
/**
 *
 * free sample add to cart
 *
 *
 */
add_action( 'wp_ajax_nopriv_add_freesample', 'add_freesample' );
add_action( 'wp_ajax_add_freesample', 'add_freesample' );
function add_freesample(){
	global $woocommerce;
    $html                                     = [];
	$quantity                                 = 1;
	$product_id                               = blindmatrix_v4_product_id();
	$cart_item_data['color_id']               = $_POST['color_id'];
	$cart_item_data['fabric_id']              = $_POST['fabric_id'];
	$cart_item_data['grossprice']             = 0;
	$cart_item_data['api_url']                = blindmatrix_v4_get_api_url();
	$cart_item_data['product_type']           = 'Free Sample';
	$cart_item_data['pricing_grp_id']         = $_POST['pricing_grp_id'];
	$cart_item_data['overallproductname']     = $_POST['fabricname'];
	$cart_item_data['free_sample_data']       = $_POST['free_sample_data'];
	$cart_item_data['image_id'] 			  = blindmatrix_v4_set_uploaded_image_as_attachment($_POST['fabric_img_url']);
    $html['link_source'] = get_permalink( wc_get_page_id( 'checkout' ));
    $is_sample_exist = false;
    $html['button_text'] ='View Checkout';
    if ( ! WC()->cart->is_empty() ) { 
      foreach( WC()->cart->get_cart() as $cart_item){
        $pro_ty = $cart_item['blindmatrix_v4_parameters_data']['product_type'];
        $pro_color_id = $cart_item['blindmatrix_v4_parameters_data']['color_id'];
        if($pro_ty != 'Free Sample'){
            $html['link_source'] = get_permalink( wc_get_page_id( 'cart' ));
            $html['button_text'] ='View Cart';
        }
        if($pro_ty == 'Free Sample' && $pro_color_id == $_POST['color_id'] ){
            $is_sample_exist = true;
        }
      }
    }
    if(!$is_sample_exist){
        $cart = WC()->cart->add_to_cart( $product_id, $quantity,0,array(),array('blindmatrix_v4_parameters_data'=> $cart_item_data));
    }
    $html['success'] ='false';
    if(!empty($cart)){
        $html['success'] ='true';
        $html['value'] ='sample added';
    }
    else{
        $html['value'] ='sample already added';
    }
	$count = 0;
	if(!empty(WC()->cart->get_cart())){
		foreach(WC()->cart->get_cart() as $cart_item){
			$blindmatrix_v4_parameters_data = isset($cart_item['blindmatrix_v4_parameters_data']) ? $cart_item['blindmatrix_v4_parameters_data']:array();
			if(isset($blindmatrix_v4_parameters_data['product_type']) && 'Free Sample'  == $blindmatrix_v4_parameters_data['product_type']){
				$count++;
			}
		}
	}
	$html['free_sample_count'] = $count;
    echo wp_json_encode($html);
    exit;
}
/**
 *
 * Product fabric and color list page call
 *
 */
add_action( 'wp_ajax_nopriv_fabriclist', 'fabriclist' );
add_action( 'wp_ajax_fabriclist', 'fabriclist' );
function fabriclist(){
    global $v4_product_visualizer_page;
    global $fabric_image_file_path;
    global $sample_img_frame_url;
    global $img_file_path_url;
    $fieldscategoryid     = $_POST['fieldscategoryid'];
    $pei_productid        = $_POST['pei_productid'];
    $productslug          = $_POST['productslug'];
    $listframe_url        = $_POST['listframe_url'];
    $fieldscategoryname   = $_POST['fieldscategoryname'];
    $ecomFreeSample       = $_POST['ecomFreeSample'];
    $fabric_view          = $_POST['fabric_view'];
    $recipeid             = $_POST['recipeid'];
    $selectedcategorylist_arr = isset($_POST['selectedcategorylist']) ? $_POST['selectedcategorylist'] : array();
    $filterdata_arr = array();
    foreach ($selectedcategorylist_arr as $selectedcategorylist) {
        $temp_arr = explode( '~', $selectedcategorylist );
        $filterdata_arr_key = str_replace(" ","",trim(strtolower($temp_arr[0])));
        $filterdata_arr_value = $temp_arr[1];
        $filterdata_arr[$filterdata_arr_key][] = $filterdata_arr_value;
    }
    $filterdata_arr = array_map(function($filterdata_val){
        return implode(',',$filterdata_val);
    },$filterdata_arr);
    $product_sorting      = isset($_POST['product_sorting']) ? $_POST['product_sorting'] : '';
    $data                 = "true" == $fabric_view ? array("view"=>'fabric',"page"=> (isset($_POST['page']) ? $_POST['page'] : '1'),"sorting_data"=> $product_sorting ) : array("page"=> (isset($_POST['page']) ? $_POST['page'] : '1'),'filter_data'=> $filterdata_arr,"sorting_data"=> $product_sorting);
    // $filtered_fabric_and_color_products_obj = blindmatrix_v4_get_filtered_fabric_and_color_products($pei_productid,$data);
    // $filtered_fabric_and_color_products_arr = json_decode($filtered_fabric_and_color_products_obj,true);
    // $filtered_fabric_and_color_products = isset($filtered_fabric_and_color_products_arr['result']) ? $filtered_fabric_and_color_products_arr['result']:array();
    $mode       = 'fabriclistview/'.$fieldscategoryid.'/'.$pei_productid;
    $arr        = array(
         "page"          => isset($_POST['page']) ? $_POST['page'] : '1',
         "filter_data"   => $filterdata_arr,
		 "sort"          => $product_sorting,
    );
    $filtered_fabric_and_color_products_obj  = CallAPI_v4("POST",$mode,json_encode($arr));
    $filtered_fabric_and_color_products      = json_decode(json_encode($filtered_fabric_and_color_products_obj), true);
    $total_fabric_color                      = !empty($filtered_fabric_and_color_products['total']) ? $filtered_fabric_and_color_products['total']:0;
    $total_pages                             = !empty($filtered_fabric_and_color_products['total_pages']) ? $filtered_fabric_and_color_products['total_pages']:0;
    $current_page                            = !empty($filtered_fabric_and_color_products['current_page']) ?  $filtered_fabric_and_color_products['current_page']: 1;
    $per_page                                = !empty($filtered_fabric_and_color_products['per_page']) ? $filtered_fabric_and_color_products['per_page']:0;
    // $ecom_fabric_list     = !empty($filtered_fabric_and_color_products['Ecomfabiclist']) ? $filtered_fabric_and_color_products['Ecomfabiclist']:array();
    // $products_list_data   = json_decode(json_encode($ecom_fabric_list), true);
    $products_list_data                      = !empty($filtered_fabric_and_color_products['result']) ? $filtered_fabric_and_color_products['result']:array();
    // Code to get free sample data.
	$v4_productlist_option_arr   = blindmatrix_v4_get_product_list_data();
	$product_default_name        = $v4_productlist_option_arr[$pei_productid]['label'];
	$productname        		 = str_replace("-"," ",strtolower($productslug));
	$option_index 				 = array_search(strtolower($productname), array_map('strtolower', array_column($v4_productlist_option_arr, 'pei_ecomProductName')));
	$chosen_product_data 		 = isset($v4_productlist_option_arr[$option_index]) ? $v4_productlist_option_arr[$option_index]:array();
    $_product_default_name       = isset($v4_productlist_option_arr[$option_index]['label']) ? $v4_productlist_option_arr[$option_index]['label']:'';
    $parameters_arr              = blindmatrix_v4_stored_parameters_data($pei_productid);
	$free_sample_data            = array();
    $html = [];
    ob_start();
    
    if('accessories' == $_POST['fieldscategoryname']){
        $post_Data = $array = array(
            "changedfieldtypeid" => "",
            "colorid" => "",
            "coloriddual" => "",
            "customertype" => "4",
            "drop" => null,
            "fabricid" => "",
            "fabriciddual" => "",
            "fieldtypeid" => "3",
            "lineitemselectedvalues" => array(),
            "numFraction" => null,
            "orderItemId" => "",
            "orderitemselectedvalues" => "",
            "pricegroup" => "",
            "pricegroupdual" => "",
            "productid" => $pei_productid,
            "selectedfieldids" => "",
            "selectedvalues" => "",
            "subcolorid" => "",
            "subfabricid" => "",
            "supplier" => "",
            "unittype" => 2,
            "width" => null,
        );
        $filterids_result_data_arr = CallAPI_v4("POST",'products/fields/filterbasedongeneraldata',json_encode($post_Data),true);
        $filterids_data_arr        = json_decode(json_encode($filterids_result_data_arr['0']->data), true);
        $parameters_arr_response   = CallAPI_v4("GET",'products/fields/withdefault/list/'.$recipeid.'/1/0',false,true);
        $parameters_arr            = $parameters_arr_response['0']->data;
        
        if(!empty($parameters_arr)){
          $accessories_data   = array();
          $products_list_data = array();
          foreach($parameters_arr as $_parameter){
            $parameter               = (array) $_parameter;  
            $showFieldOnEcommerce    = isset($parameter['showfieldecomonjob'])? $parameter['showfieldecomonjob'] :'';
            $field_type_id    = isset($parameter['fieldtypeid'])? $parameter['fieldtypeid'] :'';
            $field_name       = isset($parameter['fieldname'])? $parameter['fieldname'] :'';
            $field_id         = isset($parameter['fieldid'])? $parameter['fieldid'] :'';
            if(!$field_type_id || !$field_name || !$field_id || 0 === $showFieldOnEcommerce || 3 != $field_type_id){
              continue;
            }
            
            $post_Data = array(
                "filterids" => 3== $field_type_id && isset($filterids_data_arr['optionarray'][$field_id]) && is_array($filterids_data_arr['optionarray'][$field_id]) ? $filterids_data_arr['optionarray'][$field_id]:array(), 
                "productionformulalist" => array(),
                "productid" => $product_id,
            );
                        
            $parameters_sub_result_data_arr = CallAPI_v4("POST",'products/get/fabric/options/list/'.$recipeid.'/1/0/'.$field_type_id.'/0/'.$field_id.'/?perpage=50',json_encode($post_Data),true);
            $result_data_arr = $parameters_sub_result_data_arr[0]->data[0]->optionsvalue;
            if(empty($result_data_arr) || !is_array($result_data_arr)){
               continue;
            }
                        
            $result_count = !empty($result_data_arr) && is_array($result_data_arr) ? count($result_data_arr):0;
            $display_field   = false;
            foreach($result_data_arr as $sub_comp_value){
                $sub_comp_value = (array) $sub_comp_value;
                $show_ecommerce = !empty($sub_comp_value['availableForEcommerce']) ? $sub_comp_value['availableForEcommerce']:0;
                if(21 != $field_type_id){
                    if($show_ecommerce){
                        $display_field = true;
                    }
                }
            }
                        
            if(!$display_field){
                continue;
            }
            
            if(empty($result_data_arr) || !is_array($result_data_arr)){
                continue;
            }
            
            foreach($result_data_arr as $_list_value){
                 $list_value = (array) $_list_value;
                 $id                = isset($list_value['fieldoptionlinkid']) ? $list_value['fieldoptionlinkid']:'';
                 $option_name       = isset($list_value['optionname']) ? $list_value['optionname']:'';
                 $option_id         = isset($list_value['optionid']) ? $list_value['optionid']:'';
                 $show_ecommerce   = !empty($list_value['availableForEcommerce']) ? $list_value['availableForEcommerce']:0;
                 if(!$option_id || !$option_name || !$show_ecommerce){
                     continue;
                 }         
                 
                 $accessories_data[] = array('options_value' => $list_value,'all_data' => $parameters_sub_result_data_arr[0]->data[0]);
            }
        }
      }
    }

    $product_listing_arr = [];
    if('true' == $fabric_view){
      if(!empty($products_list_data) && is_array($products_list_data)){    
       foreach($products_list_data as $key_id => $matmap_and_color_data){
        $matched_color_arr = array();    
        $fabric_grouped_data = array();
        if(!empty($matmap_and_color_data) && is_array($matmap_and_color_data)){
            foreach($matmap_and_color_data as $matmap_and_color_id => $product_data){
                $matmap_and_color_ids = !is_array($matmap_and_color_id) ? explode('-',$matmap_and_color_id):array();
                $matmap_id = isset($matmap_and_color_ids[0]) ? $matmap_and_color_ids[0]:'';
                $color_id = isset($matmap_and_color_ids[1]) ? $matmap_and_color_ids[1]:'';
                if(!$color_id){
                    continue;
                }
                $color_data = isset($product_data['colours']['original']['result']['dataset']) ? $product_data['colours']['original']['result']['dataset']:array();
                if(is_array($color_data) && !empty($color_data)){
                    $color_data_index = array_search($color_id, array_column($color_data, 'id'));
                        if(!empty($color_data[$color_data_index])){
                            $matched_fabric_and_color_arr = $color_data[$color_data_index];
                                $matched_color_arr[$matmap_id] = $matched_fabric_and_color_arr;
                        } 
                    }
                }
                $fabric_id  = isset($product_data['fd_id']) ? $product_data['fd_id']:0;
                $fabric_grouped_data = array(
                    'groupid'    => isset($product_data['groupid']) ? $product_data['groupid']:0 ,
                    'fabricname' => isset($product_data['fabricname']) ? $product_data['fabricname']:'' ,
                    'cd_id'      => isset($product_data['cd_id']) ? $product_data['cd_id']:0 ,
                    'matmapid'   => isset($product_data['matmapid']) ? $product_data['matmapid']:0 ,
                    'supplierid' => isset($product_data['supplierid']) ? $product_data['supplierid']:0 ,
                    'minprice'   => isset($product_data['minprice']) ? $product_data['minprice']:0 ,
                );
            }
            $product_listing_arr[] = array(
                'fabric_and_color_arr' => array(),
                'matched_color_arr'    => $matched_color_arr,
                'fd_id'            => $fabric_id,  
                'fabric_grouped_data'  => $fabric_grouped_data,  
            );
        }
      }
    }else{
        if(!empty($products_list_data) && is_array($products_list_data)){ 
            foreach($products_list_data as $fabric_and_color_arr){
                $product_listing_arr[] = array(
                    'fabric_and_color_arr'  => $fabric_and_color_arr,  
                    'matched_color_arr'     => array(), 
                    'matmap_id'             => isset($fabric_and_color_arr['matmapid']) ? $fabric_and_color_arr['matmapid']:'',
                    'fabric_grouped_data'  => array(),  
                );
            }
        }
    }
    
    if(!empty($product_listing_arr) && is_array($product_listing_arr) && 'accessories' != $_POST['fieldscategoryname']){
	$parameter_field_data = array();
	$blindmatrix_v4_option_data =  get_option('blindmatrix_v4_option_data');
	$hide_frame = false;
    foreach($product_listing_arr as $product_listing_value):
		$_category_name = '';
		if('5' == $fieldscategoryid){
			$_category_name = 'blinds_with_fabrics';
		}
		if('20' == $fieldscategoryid){
			$_category_name = 'blinds_with_slates';
		}
        else{
            $_category_name = 'shutters';
        }
		if(isset($blindmatrix_v4_option_data['product_spec'][$_category_name][$pei_productid]["hide_frame_listing"]) && 'on' == $blindmatrix_v4_option_data['product_spec'][$_category_name][$pei_productid]["hide_frame_listing"]){
			$hide_frame = true;
		}
        $fabric_and_color_arr   = isset($product_listing_value['fabric_and_color_arr']) ? $product_listing_value['fabric_and_color_arr']:'';
        $fabric_grouped_data    = isset($product_listing_value['fabric_grouped_data']) ? $product_listing_value['fabric_grouped_data']:'';
        $matmapid               = !empty($fabric_and_color_arr['matmapid']) ? $fabric_and_color_arr['matmapid'] : 0;
        $pricing_grp_id         = !empty($fabric_and_color_arr['groupid']) ? $fabric_and_color_arr['groupid'] : $fabric_grouped_data['groupid'];
        $minprice               = !empty($fabric_and_color_arr['minprice']) ? $fabric_and_color_arr['minprice'] : $fabric_grouped_data['minprice'];
        $supplier_id            = !empty($fabric_and_color_arr['supplierid']) ? $fabric_and_color_arr['supplierid'] : $fabric_grouped_data['supplierid'];
        $color_list_arr         = !empty($product_listing_value['matched_color_arr']) ? $product_listing_value['matched_color_arr'] : '';
        $first_color_list_index = !empty($color_list_arr) && is_array($color_list_arr) ? array_key_first($color_list_arr):array();
        $first_color_list_arr   = isset($color_list_arr[$first_color_list_index]) ? $color_list_arr[$first_color_list_index]:array();
        $color_img_url          = !empty($fabric_and_color_arr['colorimage']) ? $fabric_and_color_arr['colorimage'] : $fabric_grouped_data['colorimage'];
        $fabric_id              = !empty($fabric_and_color_arr['fd_id']) ? $fabric_and_color_arr['fd_id'] : $product_listing_value['fd_id'];
        $color_id               = !empty($fabric_and_color_arr['cd_id']) ? $fabric_and_color_arr['cd_id'] : 0;
        $fabricname             = !empty($fabric_and_color_arr['fabricname']) ? trim($fabric_and_color_arr['fabricname']) : trim($fabric_grouped_data['fabricname']);
        $colorname              = !empty($fabric_and_color_arr['colorname']) ? trim($fabric_and_color_arr['colorname']) : trim($fabric_grouped_data['colorname']);
        // $fabric_img_url         = !empty($fabric_and_color_arr['fabric_and_color_image_url']) ? $fabric_and_color_arr['fabric_and_color_image_url'] : '';
        $fabric_img_url         = !empty($color_img_url) ? $fabric_image_file_path.$color_img_url:plugin_dir_url( __FILE__ ).'Shortcode-Source/images/no-image.jpg';
        $fabricname             = $fabricname." ".$colorname;
        $fabricname_slug        = str_replace(" ","-",strtolower($fabricname));
        if($fieldscategoryname == 'blinds-with-fabric'){
            $visulizer_page_link = '/'.$v4_product_visualizer_page.'/'.$fieldscategoryname.'/'.$productslug.'/'.$fabricname_slug.'/'.$fabric_id.'/'.$color_id.'/'.$matmapid.'/'.$pricing_grp_id.'/'.$supplier_id;
        }else{
			$fabric_id           = 0;
            $fabricname          = $colorname;
            $fabricname_slug     = str_replace(" ","-",strtolower($fabricname));
            $visulizer_page_link = '/'.$v4_product_visualizer_page.'/'.$fieldscategoryname.'/'.$productslug.'/'.$fabricname_slug.'/'.$fabric_id.'/'.$color_id.'/'.$matmapid.'/'.$pricing_grp_id.'/'.$supplier_id;
        }
        if('true' == $fabric_view && !empty($color_list_arr) && !empty($first_color_list_arr) ){
            $fabric_img_url      = $fabric_image_file_path.$first_color_list_arr['Color Image'];
            $fabricname_slug      = str_replace(" ","-",strtolower($fabricname.$first_color_list_arr['Color Name']));
            $visulizer_page_link = '/'.$v4_product_visualizer_page.'/'.$fieldscategoryname.'/'.$productslug.'/'.$fabricname_slug.'/'.$fabric_id.'/'.$first_color_list_arr['id'].'/'.$first_color_list_index.'/'.$pricing_grp_id.'/'.$supplier_id;
            $fabric_img_url_check  = blindmatrix_v4_validate_upload_image_curl_request(esc_url_raw($fabric_img_url));
            if ( !$fabric_img_url_check ) {
                $fabric_img_url = plugin_dir_url( __FILE__ ).'Shortcode-Source/images/no-image.jpg';
            }
        }
 ?>    
        <div class="col-md-3 col-6 px-3 pb-4 product row-box-shadow-2" >
            <div class="col-inner" >
                <div class="product-small box " >
                    <div class="box-image" >
                        <div class="image-fade_in_back" >
                            <a href="<?php echo($visulizer_page_link);?>">
								<?php 
								if(!$hide_frame):
									?>
									<img src="<?php echo($listframe_url);?>" class="product-frame frame_backgound" style="background-image:url(<?php echo($fabric_img_url);?>);">
									<?php
								else:
									?>
									<img src="<?php echo($fabric_img_url);?>" class="product-frame frame_backgound" style="">
									<?php
								endif;
								?>
                             </a>
                        </div>
                    </div>    
                        <div class=" d-flex align-items-center justify-content-between m-2" >
                            <div class="d-flex flex-column col-7 product-item-details" >
                                <h6 class="fw-bold mb-3 text-capitalize"><a class="product-item-link text-dark" href="<?php echo($visulizer_page_link);?>"><?php echo($fabricname);?></a></h6>
                                <?php if(isset($minprice) && $minprice !== ''):?>
                                    <span class="price-container">
                                        <span id="product-price" class="price-wrapper">From: <?php echo(wc_price($minprice));?>
                                        </span>
                                    </span>
                                 <?php endif?>
                            </div>
                            <?php  if('true' != $fabric_view):  ?>
                            <div class="d-flex justify-content-center" >
                                <a href="<?php echo($visulizer_page_link);?>" title="<?php echo($fabricname);?>" class="">
                                    <div class="product-image-container position-relative">
                                        <img style="  -webkit-mask-image: url(<?php echo($sample_img_frame_url); ?>); mask-image: url(<?php echo($sample_img_frame_url);?>); -webkit-mask-size: 100%; mask-size: 100%;" alt="<?php echo($fabricname);?>" src="<?php echo($fabric_img_url);?>" width="75" height="75" style="" class=" swatch-img">
                                    </div>									   
                                </a>
                            </div>
                            <?php endif; ?>	
                        </div>
                        <?php  if('true' == $fabric_view && !empty($color_list_arr)):
                            $color_list_arr = array_slice($color_list_arr, 0, 7,true);  ?>
                            <div class="card-product__colours" >
                                <div class="colorcont" >
                                    <strong>Available in colours </strong>
                                </div>
                                <div class="colour-options" >
                                    <div class='d-flex flex-wrap'>
                                        <?php   foreach ($color_list_arr as $matmapid => $color_data) :
                                                $color_img_url             = $fabric_image_file_path.$color_data['Color Image'];
                                                $color_id                  = $color_data['id'];
                                                $color_matmapid            = $matmapid;
                                                $color_name                = $color_data['Color Name'];
                                                $color_visulizer_page_link = '/'.$v4_product_visualizer_page.'/'.$fieldscategoryname.'/'.$productslug.'/'.$fabricname_slug.'/'.$fabric_id.'/'.$color_id.'/'.$color_matmapid.'/'.$pricing_grp_id.'/'.$supplier_id;
                                                // $color_img_url_check  = blindmatrix_v4_validate_upload_image_curl_request(esc_url_raw($color_img_url));
                                                // if ( !$color_img_url_check ) {
                                                //     $color_img_url = plugin_dir_url( __FILE__ ).'Shortcode-Source/images/no-image.jpg';
                                                // }
                                            ?>
                                            <a class="pe-1" href="<?php echo($color_visulizer_page_link);?>">
                                                <img class="shadow rounded-circle" alt="<?php echo($color_name);?>" src="<?php echo($color_img_url);?>" />
                                            </a>
                                        <?php endforeach; ?>
                                    </div>										
                                </div>
                            </div>
                        <?php endif; ?>	
                            <a href="<?php echo($visulizer_page_link);?>" class="button d-block w-100 bm-v4-buynow text-white m-0 rounded-0 box-shadow-2 text-center">
                            <i class="fa-solid fa-cart-shopping"></i> <span class="ms-1 my-1"> Buy Now</span>
                            </a>
                        <?php if($ecomFreeSample == 1 && 'true' != $fabric_view): 
								$free_sample_price = isset($_POST['free_sample_price']) ?$_POST['free_sample_price']:'' ;
								$free_sample_args = array(
									'pei_productid' 	   => $pei_productid,
									'free_sample_price'    => $free_sample_price,
									'chosen_product_data'  => $chosen_product_data,
									'parameters_arr' 	   => $parameters_arr,
									'fabric_and_color_arr' => $fabric_and_color_arr,
									'parameter_field_data' => $parameter_field_data,
								);
								$free_sample_data = blindmatrix_v4_get_free_sample_data($free_sample_args);		
							?>    
                            <a class="sample_addtocart_container d-block" style="margin:5px 0 !important" href="javascript:;" data-color_id='<?php echo($color_id);?>' data-fabric_id='<?php echo($fabric_id);?>' data-price_group_id='<?php echo($pricing_grp_id);?>' data-fabricname='<?php echo($fabricname);?>' data-fabric_image_url='<?php echo($fabric_img_url);?>' data-free_sample_data='<?php echo !empty($free_sample_data) && is_array($free_sample_data) ? json_encode($free_sample_data):''; ?>' onclick="freesample(this)">
                                <span class="free-sample-price">Free Sample<?php echo $free_sample_price >= 1 ? ' - '.wc_price($free_sample_price):''; ?></span>
                            </a>
                        <?php endif; ?>
                </div>
            </div>
        </div>
    <?php  
    endforeach;
}else if(!empty($accessories_data) && is_array($accessories_data)){
    $total_fabric_color       = count($accessories_data);
    $chunked_accessories_data = array_chunk($accessories_data,24);
    $offset                   = $current_page - 1;
    $accessories_data         = isset($chunked_accessories_data[$offset]) ? $chunked_accessories_data[$offset]:array();
    foreach($accessories_data as $_accessories_data):
        $accessories_val      = isset($_accessories_data['options_value']) ? $_accessories_data['options_value']:array();
        $per_accessories_data = isset($_accessories_data['all_data']) ? (array)$_accessories_data['all_data']:array();
        $optionparentid       = isset($per_accessories_data['fieldid']) ? $per_accessories_data['fieldid']:0;
        $id                   = isset($accessories_val['fieldoptionlinkid']) ? $accessories_val['fieldoptionlinkid']:'';
        $option_name          = isset($accessories_val['optionname']) ? $accessories_val['optionname']:'';
        $option_id            = isset($accessories_val['optionid']) ? $accessories_val['optionid']:'';
        $optionimage          = isset($accessories_val['optionimage']) ? $accessories_val['optionimage']:'';
        $option_image_url     = str_replace('/storage','',$optionimage);
        $option_image_url     = ltrim($option_image_url,'/');
        $optionimage          = $img_file_path_url.$option_image_url;
        $option_name_slug     = str_replace(' ','-',$option_name);
        $visulizer_page_link = '/'.$v4_product_visualizer_page.'/'.$fieldscategoryname.'/'.$productslug.'/'.$option_name_slug.'/'.$pei_productid.'/'.$optionparentid.'/'.$id.'/'.$option_id.'/'.$fieldscategoryid;
         ?>    
        <div class="col-md-3 col-6 px-3 pb-4 product row-box-shadow-2" >
            <div class="col-inner" >
                <div class="product-small box " >
                    <div class="box-image" >
                        <div class="image-fade_in_back" >
                            <a href="<?php echo($visulizer_page_link);?>">
							    <img src="<?php echo($optionimage);?>" class="product-frame frame_backgound" style="">
                             </a>
                        </div>
                    </div>    
                    <div class=" d-flex align-items-center justify-content-between m-2" style="min-height: 60px;">
                            <div class="d-flex flex-column col-7 product-item-details" >
                                <h6 class="fw-bold mb-3 text-capitalize"><a class="product-item-link text-dark" href="<?php echo($visulizer_page_link);?>"><?php echo($option_name);?></a></h6>
                                <?php if(false):?>
                                    <span class="price-container">
                                        <span id="product-price" class="price-wrapper">From: <?php echo(wc_price($minprice));?>
                                        </span>
                                    </span>
                                 <?php endif?>
                            </div>
                            
                            <div class="d-flex justify-content-center" >
                                <a href="<?php echo($visulizer_page_link);?>" title="<?php echo($option_name);?>" class="">
                                    <div class="product-image-container position-relative d-none">
                                        <img style="  -webkit-mask-image: url(<?php echo($sample_img_frame_url); ?>); mask-image: url(<?php echo($sample_img_frame_url);?>); -webkit-mask-size: 100%; mask-size: 100%;" alt="<?php echo($fabricname);?>" src="<?php echo($optionimage);?>" width="75" height="75" style="" class=" swatch-img">
                                    </div>									   
                                </a>
                            </div>
                    </div>
                            <a href="<?php echo($visulizer_page_link);?>" class="button d-block w-100 bm-v4-buynow text-white m-0 rounded-0 box-shadow-2 text-center">
                                <i class="fa-solid fa-cart-shopping d-none"></i> <span class="ms-1 my-1"> Start Customizing</span>
                            </a>
                </div>
            </div>
        </div>
        <?php
    endforeach;
}else{
    echo('<p class="text-center fw-bold"> No Products Found.</p>');
}
$result = ob_get_contents();
ob_end_clean();
$html['html'] =$result;
ob_start();
bmpagenation($current_page,$per_page,$total_fabric_color);
$nav_html = ob_get_contents();
ob_end_clean();
$html['nav'] =$nav_html;
$html['total_fabric_color'] = $total_fabric_color.' Items';
$html['success'] ='true';
echo wp_json_encode($html);
exit;
}
 function bmpagenation($page,$per_page,$count) {
	 ob_start();
	 ?>
	<ul class="page-numbers nav-pagination mx-0 px-0 text-center">
	<?php
    if(!isset($page)) $page = 1;
    if($per_page != 0) $pages = ceil($count/$per_page);
    //if pages exists after loop's lower limit
    if($pages>1) {
		if(($page-3)>0) {
			 ?>
			<li><a href="javascript:;" class="prev page-number" onclick="pagination( 1);"><i class="fa-solid fa-chevron-left"></i></a></li>
			<?php
		}
		if(($page-3)>1) {
			echo('...');
		}
		//Loop for provides links for 2 pages before and after current page
		for($i=($page-3); $i<=($page+4); $i++)	{
			if($i<1) continue;
			if($i>$pages) break;
			if($page == $i){
			   ?>
				<li><a href="javascript:;" aria-current="page" onclick="pagination('<?php echo($i); ?>');" class="page-number current"><?php echo($i); ?></a></li>
				<?php
			}else{				
			   ?>
				<li><a href="javascript:;" aria-current="page" onclick="pagination('<?php echo($i); ?>');" class="page-number"><?php echo($i); ?></a></li>
				<?php
			}
		}
		//if pages exists after loop's upper limit
		if(($pages-($page+2))>1) {
			echo('...');
		}
		if(($pages-($page+2))>0) {
			if($page == $pages){
				?>
					<li><a href="javascript:;" aria-current="page" onclick="pagination('<?php echo($pages); ?>');" class="page-number current"><i class="fa-solid fa-chevron-right"></i></a></li>
				<?php
			}else{
				?>
					<li><a href="javascript:;" aria-current="page" onclick="pagination('<?php echo($pages); ?>');" class="page-number"><i class="fa-solid fa-chevron-right"></i></a></li>
				<?php
			}
		}
    }
	?>
    </ul>
	<?php
	$result = ob_get_contents();
	ob_end_clean();
     echo($result);
}
/**
 *
 * Get blindmatrix v4 parameters in HTML
 * 
 * @return HTML
 */
function get_blindmatrix_v4_parameters_HTML($chosen_field_type_id,$custom_html_args = array(),$echo = true){
    $default_html_args = array(
        'input_class'       => '',
        'wrapper_class'     => '',
        'bootstrap_class'   => '',
        'label'             => '',
        'label_information' => '',
        'mandatory'         => 'off',
		'placeholder'       => '',
        'name'              => '',
        'custom_attributes' => array(),
        'options'           => array(),
		'options_data'      => array(),
        'default'           => '',
        'description'       => '',
        'value'             => '',
        'stored_value'      => '',  
        'multiple'          => false,
        'data'              => array(),
        'css'               => '',
        'hidden_items'      => array(),
		'extra_data'        => array(),
		'fraction_array'    => array(),
		'wd_img_array'      => array(),
		'error_message'     => '',
    );
    $html_args  = array_merge($default_html_args,$custom_html_args);
    $custom_attributes = array();
    if ( ! empty( $html_args['custom_attributes'] ) && is_array( $html_args['custom_attributes'] ) ){
		foreach ( $html_args['custom_attributes'] as $attribute => $attribute_value ) {
			if(!$attribute_value){
		       continue;
		    }
			$custom_attributes[] = $attribute . '=' . $attribute_value ;
		}
    }
	$data = array();
	if ( ! empty( $html_args['data'] ) && is_array( $html_args['data'] ) ) {
		foreach ( $html_args['data'] as $key => $value ) {
			$data[] = "data-".$key.'='.$value;
		}
	}
    $options_data = array();
	if ( ! empty( $html_args['options_data'] ) && is_array( $html_args['options_data'] ) ) {
		foreach ( $html_args['options_data'] as $key => $value ) {
		    foreach ($value as $option_key => $option_val ) {
		        if(!$option_val){
		            continue;
		        }
	            $options_data[$key][$option_key] = 'data-'. $option_key . '=' . $option_val ;
            }
		}
	}
    $html_args['custom_attributes'] = $custom_attributes;
    $html_args['data']              = $data;
    $html_args['options_data']      = $options_data;
    $field_types = array(
        '3'  => 'list',
        '5'  => 'fabric_and_color',
        '6'  => 'number',
        '7'  => 'x_footage',
        '8'  => 'width',
        '9'  => 'y_footage',
        '10' => 'height',
        '11' => 'width',
        '12' => 'drop',
        '13' => 'pricegroup',
        '14' => 'qty',
        '17' => 'supplier',
        '18' => 'text',
        '31' => 'x_square_yard',
        '32' => 'y_square_yard',
		'34' => 'unit_type',
		'21' => 'shutter_materials', //shutter_materials
		'25' => 'accessories_list',
		'20' => 'color'  
    );
    if(!$chosen_field_type_id){
        return;
    }
    $field_type_name= isset($field_types[$chosen_field_type_id]) ? $field_types[$chosen_field_type_id]:'';
    if(!$field_type_name){
        return;
    }

   // 7 - Numeric - x Footage, 8 - X Square Meterage, 11 - blinds width, 31 - X Square Yard;  // 9 - Numeric - Y Footage, 10 - Y Square Meterage, 12 - blinds drop, 32 - Y Square Yard;
    switch($chosen_field_type_id){
        case '6':
        case '7':
        case '8':
        case '9':
        case '10':
        case '11':
        case '12':
        case '31':
        case '32':
            $field_type_name = 'number';
            break;
        case  '13':
        case  '14':
        case  '17':
		case  '34':	
		case  '20':	
            $field_type_name = 'hidden';
            break;
        case '21':
            $field_type_name = 'list';
        break;   
    }
    $function = 'blindmatrix_render_'.$field_type_name.'_field';
    if($echo){
        $function($html_args);
    }else{
        ob_start();
        $function($html_args);
        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    }
}
/**
 *
 * Render hidden group field HTML
 * 
 * @return HTML
 */
function blindmatrix_render_hidden_field($html_args){
    ?>
    <div class="<?php echo esc_attr($html_args['wrapper_class']); ?>">
        <?php 
        if(!empty($html_args['hidden_items']) && is_array($html_args['hidden_items'])):
            foreach($html_args['hidden_items'] as $hidden_item):
            ?>
                <input type="hidden" class="<?php echo esc_html($hidden_item['class']); ?>" name="<?php echo esc_attr($hidden_item['name']); ?>" value="<?php echo esc_html($hidden_item['value']); ?>"/>
            <?php
            endforeach;
        endif;
        ?>
    </div>
    <?php
}
/**
 *
 * Render number field HTML
 * 
 * @return HTML
 */
function blindmatrix_render_number_field($html_args){
    $stored_value = !empty($html_args['stored_value']) ? $html_args['stored_value']:'';
    ?>
    <div class="<?php echo esc_attr($html_args['wrapper_class']); ?><?php echo esc_attr($html_args['bootstrap_class']); ?>">
    <label class="fw-bolder w-34"><?php echo esc_html($html_args['label']);?> 
        <?php if(!empty($html_args['mandatory'])  && 'on' == $html_args['mandatory']){ ?><span class="required blindmatrix-v4-required-field">*</span><?php } ?>
        <?php if(!empty($html_args['label_information'])){ ?><i class="fa-solid fa-circle-info label_info" data-value="<?php echo esc_html($html_args['label_information']);?>"></i><?php } ?>
    </label>   
    <?php    if(!empty($html_args['wd_img_array']) && is_array($html_args['wd_img_array'])): ?>
    <img src="<?php echo ($html_args['wd_img_array']['src']); ?>" alt="<?php echo esc_attr($html_args['wd_img_array']['name']); ?>" title="<?php echo esc_attr($html_args['wd_img_array']['name']); ?>" class="<?php echo esc_attr($html_args['wd_img_array']['class']); ?>">    
    <?php  endif; ?>
    <input type="number" 
        name="<?php echo esc_attr($html_args['name']); ?>"
        style="<?php echo wp_kses_post($html_args['css']); ?>"
        class="<?php echo esc_html($html_args['input_class']); ?>" 
        <?php echo !empty($html_args['custom_attributes']) && is_array($html_args['custom_attributes']) ? implode(' ',$html_args['custom_attributes']):''; ?>
		placeholder="<?php echo esc_attr($html_args['placeholder']); ?>"	  
		title="<?php echo esc_attr($html_args['placeholder']); ?>"   
        value="<?php echo wp_kses_post($stored_value); ?>"
        <?php echo !empty($html_args['data']) && is_array($html_args['data']) ? implode(' ',$html_args['data']):''; ?>>
        <?php 
        if(!empty($html_args['fraction_array']['data']) && is_array($html_args['fraction_array']['data'])): ?>
        <div class="fraction_array" style="width:80px;display:none"> 
           <select class="m-0 rounded-end" name="<?php echo esc_attr($html_args['fraction_array']['name']); ?>" id="<?php echo esc_attr($html_args['fraction_array']['id']); ?>">
               <option id='0'>0</option>
                <?php foreach ($html_args['fraction_array']['data'] as $key => $value) { ?>
                    <option id='<?php echo $value['id']; ?>' data-decimal="<?php echo $value['decimalvalue']; ?>" value="<?php echo $value['name']; ?>"><?php echo $value['name']; ?> </option>
                <?php } ?>
            </select>
        </div>
        <?php 
        endif;
        if(!empty($html_args['hidden_items']) && is_array($html_args['hidden_items'])):
            foreach($html_args['hidden_items'] as $hidden_item):
                ?>
                <input type="hidden" class="<?php echo esc_html($hidden_item['class']); ?>" name="<?php echo esc_attr($hidden_item['name']); ?>" value="<?php echo esc_html($hidden_item['value']); ?>"/>
                <?php
            endforeach;
        endif;
        
        if(!empty($html_args['error_message'])):
          ?>
            <span class="blindmatrix-v4-field-error-msg" style="visibility:hidden;color:red"><?php echo $html_args['error_message']; ?></span>
          <?php
        endif;
        ?>
    </div>
    <?php
}
function blindmatrix_render_fabric_and_color_field($html_args){
    ?>
    <div class="<?php echo esc_attr($html_args['wrapper_class']); ?>">
        <?php 
        if(!empty($html_args['hidden_items']) && is_array($html_args['hidden_items'])):
            foreach($html_args['hidden_items'] as $hidden_item):
            ?>
                <input type="hidden" class="<?php echo esc_html($hidden_item['class']); ?>" style="<?php echo wp_kses_post($html_args['css']); ?>" name="<?php echo esc_attr($hidden_item['name']); ?>" value="<?php echo esc_html($hidden_item['value']); ?>"/>
            <?php
            endforeach;
        endif;
        ?>
    </div>
    <?php
}
/**
 *
 * Render list field - dropdown/component HTML
 * 
 * @return HTML
 */
function blindmatrix_render_list_field($html_args){
    $stored_value = !empty($html_args['stored_value']) ? $html_args['stored_value']:'';
    ?>
    <div class="<?php echo esc_attr($html_args['wrapper_class']); ?><?php echo esc_attr($html_args['bootstrap_class']); ?>">
    <label class="fw-bolder w-34"><?php echo esc_html($html_args['label']);?> <?php if(!empty($html_args['mandatory'])  && 'on' == $html_args['mandatory']){ ?><span class="required blindmatrix-v4-required-field">*</span><?php } ?>
        <?php if(!empty($html_args['label_information'])){ ?><i class="fa-solid fa-circle-info label_info" data-value="<?php echo esc_html($html_args['label_information']);?>"></i><?php } ?> 
    </label>     
        <select <?php echo esc_html($html_args['multiple'])?"multiple":"";?> class="<?php echo esc_html($html_args['input_class']);?>" 
				<?php echo !empty($html_args['custom_attributes']) && is_array($html_args['custom_attributes']) ? implode(' ',$html_args['custom_attributes']):''; ?>
				
					data-placeholder="Choose the options"
					style="<?php echo wp_kses_post($html_args['css']); ?>"
				name="<?php echo esc_attr($html_args['name']); ?>" 
				<?php echo esc_attr(!empty($html_args['data']) && is_array($html_args['data']) ? implode(' ',$html_args['data']):''); ?>>
                <option value="" > <?php echo esc_html($html_args['multiple'])?" ":"";?></option>
            <?php 
            if(!empty($html_args['options']) && is_array($html_args['options'])):
                foreach($html_args['options'] as $key => $option_name):
					$_option_id      = isset($html_args['extra_data']) ? $html_args['extra_data'][$key]['option_id']:0;
                    $default_values  = !empty($html_args['default']) && !is_array($html_args['default']) ? explode(',',$html_args['default']):array();
                    if('' != $stored_value){
                        $default_values = is_array($stored_value) ? $stored_value:array();
                    }
                    ?>
                    <option value="<?php echo esc_html($_option_id);?>" 
					<?php echo esc_attr(!empty($default_values) && is_array($default_values) && in_array($_option_id,$default_values) ? 'selected="selected"':''); ?>		
                    <?php echo esc_attr(!empty($html_args['options_data'][$key]) && is_array($html_args['options_data'][$key]) ? implode(' ',$html_args['options_data'][$key]):''); ?>><?php echo esc_html($option_name);?></option>
                <?php 
                endforeach;
            endif;    
            ?>
        </select>
        <?php 
        if(!empty($html_args['hidden_items']) && is_array($html_args['hidden_items'])):
            foreach($html_args['hidden_items'] as $hidden_item):
                ?>
                <input type="hidden" class="<?php echo esc_html($hidden_item['class']); ?>" name="<?php echo esc_attr($hidden_item['name']); ?>" value="<?php echo esc_html($hidden_item['value']); ?>"/>
                <?php
            endforeach;
        endif;
        ?>
    </div>
    <?php
}
/**
 *
 * Render text field HTML
 * 
 * @return HTML
 */
function blindmatrix_render_text_field($html_args){
    $stored_value = !empty($html_args['stored_value']) ? $html_args['stored_value']:'';
    ?>
    <div class="<?php echo esc_attr($html_args['wrapper_class']); ?><?php echo esc_attr($html_args['bootstrap_class']); ?>">
        <label class="fw-bolder w-34"><?php echo esc_html($html_args['label']);?> <?php if(!empty($html_args['mandatory'] && 'on' == $html_args['mandatory'])){ ?><span class="required blindmatrix-v4-required-field">*</span><?php } ?>
<?php if(!empty($html_args['label_information'])){ ?><i class="fa-solid fa-circle-info label_info" data-value="<?php echo esc_html($html_args['label_information']);?>"></i><?php } ?>
    </label>        
    <input type="text" 
		placeholder="<?php echo esc_attr($html_args['placeholder']); ?>"	   
        name="<?php echo esc_attr($html_args['name']); ?>"
        style="<?php echo wp_kses_post($html_args['css']); ?>"
        class="<?php echo esc_html($html_args['input_class']); ?>" 
        <?php echo !empty($html_args['custom_attributes']) && is_array($html_args['custom_attributes']) ? implode(' ',$html_args['custom_attributes']):''; ?>
        value="<?php echo wp_kses_post($stored_value); ?>"
        <?php echo !empty($html_args['data']) && is_array($html_args['data']) ? implode(' ',$html_args['data']):''; ?>>
        <?php 
        if(!empty($html_args['hidden_items']) && is_array($html_args['hidden_items'])):
            foreach($html_args['hidden_items'] as $hidden_item):
                ?>
                <input type="hidden" class="<?php echo esc_html($hidden_item['class']); ?>" name="<?php echo esc_attr($hidden_item['name']); ?>" value="<?php echo esc_html($hidden_item['value']); ?>"/>
                <?php
            endforeach;
        endif;
        ?>
    </div>
    <?php
}
/**
 *
 * Render colors field HTML
 * 
 * @return void
 */
function blindmatrix_v4_render_colors_HTML($html_args){
    if(empty($html_args['value'])){
        return '';    
    }
    global $v4_product_visualizer_page;
    global $fabric_image_file_path;
    $fieldscategoryname = get_query_var("fieldscategoryname");
    $productslug        = get_query_var("productname");
    $fabricid           = get_query_var("fabricid");
    $fabricname         = get_query_var("fabricname");
    $pricegroup_id      = get_query_var("pricegroupid");
    $supplier_id        = get_query_var("supplierid");
    $matmapid           = get_query_var("mapid");
    $chosen_color_id  = !empty($html_args['chosen_color_id']) ? $html_args['chosen_color_id']:'';
    $color_name       = !empty($html_args['colorname']) ? $html_args['colorname']:'';
    $free_sample_args = !empty($html_args['free_sample_args']) ? $html_args['free_sample_args']:array();
    $ecomsampleprice  = !empty($free_sample_args['free_sample_price']) ? $free_sample_args['free_sample_price']:'';
    ?>
    <div class="blindmatrix-v4-parameter-wrapper d-flex align-items-center my-2 py-2 ">
        <label class="fw-bolder w-34" ><?php echo esc_html($html_args['label']);?>
            <span class="blindmatrix-v4-view-color-selection-name-span">
                <span class="blindmatrix-v4-view-color-selection-name">
                    <i class="icon-checkmark"></i>
                    <span class="blindmatrix-v4-chosen-color-section-name"><?php echo $color_name; ?></span>
                </span>
            </span>
        </label>    
        <div class="<?php echo esc_attr($html_args['color_wrapper_class']); ?> w-75">
        <?php 
        if(!empty($html_args['value']) && is_array($html_args['value'])):
            foreach($html_args['value'] as $fabric_id => $color_data):
                foreach($color_data as $color_val):
                    $_fabric_name               = !empty($color_val['fabricname']) ? $color_val['fabricname']:'';
                    $_color_name                = !empty($color_val['colorname']) ? $color_val['colorname']:'';
                    $_product_name              = !empty($color_val['productname']) ? $color_val['productname']:'';
                    $fabric_and_color_image_url = !empty($color_val['colorimage']) ? $fabric_image_file_path.$color_val['colorimage']:plugin_dir_url( __FILE__ ).'Shortcode-Source/images/no-image.jpg';
                    $matmapid                   = !empty($color_val['matmapid']) ? $color_val['matmapid']:'';
                    $min_width                  = !empty($color_val['minwidth']) ? $color_val['minwidth']:'';
                    $max_width                  = !empty($color_val['maxwidth']) ? $color_val['maxwidth']:'';
                    $min_drop                   = !empty($color_val['mindrop']) ? $color_val['mindrop']:'';
                    $max_drop                   = !empty($color_val['maxdrop']) ? $color_val['maxdrop']:'';
					$pricetable_maxwidth = !empty($color_val['pricetable_maxwidth']) ? floatval($color_val['pricetable_maxwidth']):0;
					if(empty($max_width) && !empty($pricetable_maxwidth)){
						$max_width = $pricetable_maxwidth;
					}
					$pricetable_maxdrop  = !empty($color_val['pricetable_maxdrop']) ? floatval($color_val['pricetable_maxdrop']):0;
					if(empty($max_drop) && !empty($pricetable_maxdrop)){
						$max_drop = $pricetable_maxdrop;
					}
					$ecomdescription            = !empty($color_val['ecomdescription']) ? $color_val['ecomdescription']:'';
                    $altered_product_name       = $_product_name.' - '.$_fabric_name.' '.$_color_name;
                    $_colorid                   = !empty($color_val['cd_id']) ? $color_val['cd_id']:'';
                    $min_price                  = !empty($color_val['minprice']) ? $color_val['minprice']:0;
                    $page_url                   = site_url().'/'.$v4_product_visualizer_page.'/'.$fieldscategoryname.'/'.$productslug.'/'.strtolower($_fabric_name).'-'.strtolower($_color_name).'/'.$fabricid.'/'.$color_val['cd_id'].'/'.$matmapid.'/'.$pricegroup_id.'/'.$supplier_id;
                    $extra_class = '';
                    if(empty($_fabric_name)){
						$altered_product_name    = $_product_name.' - '.$_color_name;
                        $page_url                = site_url().'/'.$v4_product_visualizer_page.'/'.$fieldscategoryname.'/'.$productslug.'/'.strtolower($_color_name).'/'.$fabricid.'/'.$color_val['cd_id'].'/'.$matmapid.'/'.$pricegroup_id.'/'.$supplier_id;
					}
                    if($chosen_color_id == $_colorid):
                        $extra_class = 'selected';
                    endif;
                    $free_sample_args['fabric_and_color_arr'] = $color_val;
	                $free_sample_data = blindmatrix_v4_get_free_sample_data($free_sample_args);
                    ?>
                    <div class="<?php echo esc_attr($html_args['color_children_class']); ?> <?php echo esc_attr($extra_class); ?>" 
                    data-color_name="<?php echo wp_kses_post($_color_name); ?>" 
                    data-url="<?php echo esc_url($fabric_and_color_image_url); ?>" 
                    data-product_name="<?php echo wp_kses_post($altered_product_name); ?>"
                    data-color_id  ="<?php echo esc_attr($_colorid); ?>"
                    data-matmapid  ='<?php echo wp_kses_post($matmapid); ?>'
                    data-color_arr ='<?php echo wp_kses_post(json_encode($color_val)); ?>'
                    data-min_width ='<?php echo wp_kses_post($min_width); ?>'
                    data-max_width ='<?php echo wp_kses_post($max_width); ?>'
                    data-min_drop  ='<?php echo wp_kses_post($min_drop); ?>'
                    data-max_drop  ='<?php echo wp_kses_post($max_drop); ?>'
                    data-fabric_and_color_name="<?php echo wp_kses_post(ucwords($_fabric_name.' '.$_color_name)); ?>"
                    data-overallproductname    ="<?php echo wp_kses_post($altered_product_name); ?>" 
                    data-order_free_sample_HTML="<?php echo (blindmatrix_v4_get_order_free_sample_based_on_color_HTML($color_val,$free_sample_args)); ?>"
                    data-free_sample_data      ='<?php echo json_encode($free_sample_data); ?>'
                    data-page_url 		       = '<?php echo esc_url($page_url); ?>'
					data-ecomdescription       = '<?php echo ($ecomdescription); ?>'
					data-free_sample_price     = '<?php echo $ecomsampleprice >= 1 ? ' - '.wc_price($ecomsampleprice):''; ?>'	
					data-min_price             = '<?php echo wc_price($min_price); ?>'
					title="<?php echo wp_kses_post($_color_name); ?>">
                        <img src="<?php echo esc_url($fabric_and_color_image_url); ?>" width="40" height="40" >
                    </div>
                    <?php
                endforeach;
            endforeach;
        endif;
        ?>
        </div>
    </div>
    <?php
}
/**
 *
 * Render shutter colors field HTML
 * 
 * @return void
 */
function blindmatrix_v4_render_shuter_colors_HTML($html_args){
    $stored_value = !empty($html_args['stored_value']) ? $html_args['stored_value']:'';
      ?>
    <div class="product_atributes <?php echo esc_attr($html_args['wrapper_class']); ?>" >
	<label class="fw-bolder"><?php echo esc_attr($html_args['label']); ?>
    <?php if(!empty($html_args['mandatory'] && 'on' == $html_args['mandatory'])){ ?><span class="required blindmatrix-v4-required-field">*</span><?php } ?>
<?php if(!empty($html_args['label_information'])){ ?><i class="fa-solid fa-circle-info label_info" data-value="<?php echo esc_html($html_args['label_information']);?>"></i><?php } ?>
    
</label>
		<div class="product_atributes_value colors" >
        <?php 
            if(!empty($html_args['options']) && is_array($html_args['options'])):
                foreach($html_args['options'] as $key => $option_name):
					$_option_id      = isset($html_args['options_data']) ? $html_args['options_data'][$key]['option_id']:0;
					$_option_img_url = isset($html_args['options_data']) ? $html_args['options_data'][$key]['img_url']:'';
					$_option_field_id = isset($html_args['options_data']) ? $html_args['options_data'][$key]['field_id']:0;
                    $default_values  = !empty($html_args['default']) && !is_array($html_args['default']) ? explode(',',$html_args['default']):array();
                    if('' != $stored_value){
                        $default_values = is_array($stored_value) ? $stored_value:array();
                    }
                    ?>
                        <input type="radio" name="shuttercolorvalue" id="<?php echo esc_html($_option_id);?>"  value="<?php echo esc_html($option_name);?>"  class="d-none input_hidden">
                    <label class="shutter_color_cl <?php echo !empty($default_values) && in_array($_option_id,$default_values) ?'selected':''; ?>" data-id="<?php echo esc_html($_option_id);?>" data-field_id="<?php echo esc_html($_option_field_id);?>" >
                        <div class="sample_image_shutter d-flex justify-content-center align-items-center">
                            <img decoding="async" crossorigin="anonymous" id="<?php echo esc_html($_option_id);?>" src="<?php echo esc_html($_option_img_url);?>" width="100" height="100">
                        </div>
                        <h6 class="customiser-card-title fw-bolder d-flex justify-content-center align-items-center"><?php echo esc_html($option_name);?></h6>
                    </label>
                <?php 
                endforeach;
            endif;    
            ?>
	</div>
</div>
    <?php
}

/**
 *
 * Render accessories list field HTML
 * 
 * @return void
 */
function blindmatrix_render_accessories_list_field($html_args){
     $stored_value = !empty($html_args['stored_value']) ? $html_args['stored_value']:'';
    ?>
        <div class="blindmatrix_v4_accessories_list_wrapper <?php echo esc_attr($html_args['wrapper_class']); ?> <?php echo $html_args['multiple'] ? 'blindmatrix_v4_multiple_fields':''; ?> d-flex justify-content-between align-items-center" style="padding:0;margin-top: 2.5rem !important; margin-bottom: 2.5rem !important;">
        <label class="fw-bolder w-34" style="    display: inline-block; text-align: left;">
            <?php echo esc_attr(trim($html_args['label'])); ?>
            <?php if (!empty($html_args['mandatory']) && 'on' == $html_args['mandatory']) { ?>
                <span class="required blindmatrix-v4-required-field">*</span>
            <?php } ?>
            <?php if (!empty($html_args['label_information'])) { ?>
                <i class="fa-solid fa-circle-info label_info" data-value="<?php echo esc_html($html_args['label_information']); ?>"></i>
            <?php } ?>
        </label>
    
        <div class="product_atributes_value colors" style="width: 75% !important; display: flex ; flex-direction: row; flex-wrap: wrap; gap: 10px;">
            <?php 
            if (!empty($html_args['options']) && is_array($html_args['options'])):
                foreach ($html_args['options'] as $key => $option_name):
                    $_option_id       = isset($html_args['options_data']) ? str_replace('data-option_id=','',$html_args['options_data'][$key]['option_id']) : 0;
                    $_option_img_url  = isset($html_args['options_data']) ? str_replace('data-img_url=','',$html_args['options_data'][$key]['img_url'] ): '';
                    $_option_field_id = isset($html_args['options_data']) ? str_replace('data-field_id=','',$html_args['options_data'][$key]['field_id']) : 0;
                    $default_values   = !empty($html_args['default']) && !is_array($html_args['default']) ? explode(',', $html_args['default']) : array();
                    
                    if ('' != $stored_value) {
                        $default_values = is_array($stored_value) ? $stored_value : array();
                    }
                    ?>
                    <div class="accessories_list_view <?php echo !empty($default_values) && in_array($_option_id, $default_values) ? 'selected' : ''; ?>" 
                        data-id="<?php echo esc_html($_option_id); ?>" 
                        data-field_id="<?php echo esc_html($_option_field_id); ?>"
                        style="width: 30%;display: flex !important ; flex-direction: column; gap:10px; flex-wrap: wrap; align-content: center; justify-content: flex-start; align-items: center;">
                        <div class="accessories_image d-flex justify-content-center align-items-center">
                            <img decoding="async" crossorigin="anonymous" id="<?php echo esc_html($_option_id); ?>" src="<?php echo esc_html($_option_img_url); ?>" width="100" height="100" style="border-radius:unset;">
                        </div>
                        <div class="customiser-card-title fw-bolder d-flex justify-content-center align-items-center" style="font-size: 14px;word-break: break-word;">
                            <?php echo esc_html($option_name); ?>
                        </div>
                    </div>
                <?php 
                endforeach;
            endif; 
            ?>
        </div>
    
        <div class="d-none accessories_list_selection">
            <select <?php echo esc_html($html_args['multiple'])?"multiple":"";?> class="<?php echo esc_html($html_args['input_class']);?>" 
				<?php echo !empty($html_args['custom_attributes']) && is_array($html_args['custom_attributes']) ? implode(' ',$html_args['custom_attributes']):''; ?>
				
					data-placeholder="Choose the options"
					
				name="<?php echo esc_attr($html_args['name']); ?>" 
				<?php echo esc_attr(!empty($html_args['data']) && is_array($html_args['data']) ? implode(' ',$html_args['data']):''); ?>>
                <option value="" > <?php echo esc_html($html_args['multiple'])?" ":"";?></option>
                <?php 
                if(!empty($html_args['options']) && is_array($html_args['options'])):
                    foreach($html_args['options'] as $key => $option_name):
					    $_option_id      = isset($html_args['extra_data']) ? $html_args['extra_data'][$key]['option_id']:0;
                        $default_values  = !empty($html_args['default']) && !is_array($html_args['default']) ? explode(',',$html_args['default']):array();
                        if('' != $stored_value){
                            $default_values = is_array($stored_value) ? $stored_value:array();
                        }
                        ?>
                        <option value="<?php echo esc_html($_option_id);?>" 
					    <?php echo esc_attr(!empty($default_values) && is_array($default_values) && in_array($_option_id,$default_values) ? 'selected="selected"':''); ?>		
                        <?php echo esc_attr(!empty($html_args['options_data'][$key]) && is_array($html_args['options_data'][$key]) ? implode(' ',$html_args['options_data'][$key]):''); ?>><?php echo esc_html($option_name);?></option>
                    <?php 
                endforeach;
                endif;    
            ?>
            </select>
            <?php 
            if(!empty($html_args['hidden_items']) && is_array($html_args['hidden_items'])):
                foreach($html_args['hidden_items'] as $hidden_item):
                    ?>
                    <input type="hidden" class="<?php echo esc_html($hidden_item['class']); ?>" name="<?php echo esc_attr($hidden_item['name']); ?>" value="<?php echo esc_html($hidden_item['value']); ?>"/>
                    <?php
                endforeach;
            endif;
        ?>
        </div>
    </div>
    <?php
}

function blindmatrix_v4_get_order_free_sample_based_on_color_HTML($color_val,$free_sample_args){
    ob_start();
    global $sample_img_frame_url;  
    $background_color_image_url = !empty($color_val['fabric_and_color_image_url']) ? $color_val['fabric_and_color_image_url']:'';
    $ecomsampleprice            = !empty($free_sample_args['free_sample_price']) ? $free_sample_args['free_sample_price']:'';
    $fabricid                   = !empty($color_val['fd_id']) ? $color_val['fd_id']:'';
    $colorid                    = !empty($color_val['cd_id']) ? $color_val['cd_id']:'';
    $fabricname                 = !empty($color_val['fabricname']) ? $color_val['fabricname']:'';
    $pricegroup_id              = !empty($color_val['groupid']) ? $color_val['groupid']:'';
    ?>
    <span class='ordersampleimg' >
		<img id='myimage'  
		src='<?php echo($background_color_image_url); ?>' width='80'
		alt='' class='attachment-woocommerce_thumbnail' 
		style='  -webkit-mask-image: url(<?php echo($sample_img_frame_url); ?>); mask-image: url(<?php echo($sample_img_frame_url);?>); -webkit-mask-size: 100%; mask-size: 100%;'>
    </span>
	<button type='button' onclick='freesample(this)'
            class='single_add_to_cart_button rounded-pill m-0 button font-1' style='background-color:#00B67A;'
            data-color_id='<?php echo($colorid);?>' data-fabric_id='<?php echo($fabricid);?>' 
            data-price_group_id='<?php echo($pricegroup_id);?>' 
            data-fabricname='<?php echo($fabricname);?>' 
            data-fabric_image_url='<?php echo($background_color_image_url);?>' 
            data-free_sample_data='' >
            <span class='freesample-button p-0' >Order Free Sample<span class='free-sample-btn-price-span'></span></span>
    </button>
    <?php
    $content = ob_get_contents();
    ob_end_clean();
    return $content;
}
/**
 *
 * Get blindmatrix v4 sub component in HTML
 * 
 * 
 */
add_action( 'wp_ajax_nopriv_subcomponent', 'subcomponent' );
add_action( 'wp_ajax_subcomponent', 'subcomponent' );
function subcomponent(){
    $product_id = $_POST['product_id'];
    $selected_values = $_POST['selected_value'];
	$selected_values = !empty($selected_values) && !is_array($selected_values) ? array($selected_values):$selected_values; 
	$selected_values = is_array($selected_values) && !empty($selected_values) ? $selected_values:array();
    $selected_fields_data = isset($_POST['selected_fields_data']) ? $_POST['selected_fields_data'] : '';
    $field_id = $_POST['field_id'];
    $recipeid = $_POST['recipeid'];
    $fieldlevel = $_POST['fieldlevel']+1 ;
    $field_type_id = $_POST['field_type_id'] ;
    $level_id = 2 ;
	$content = '';
	$parameters_arr = array();
	$result = array();
	$form_data = isset($_POST["form_data"]) ? wp_parse_args($_POST["form_data"]):array();
	$product_cat = isset($form_data["blindmatrix_v4_parameters_data"]["category"]) ? $form_data["blindmatrix_v4_parameters_data"]["category"]:'';
	$rules_cost_price_comes_from = isset($form_data['blindmatrix_v4_parameters_data']['rules_cost_price_comes_from']) ? $form_data['blindmatrix_v4_parameters_data']['rules_cost_price_comes_from']:'';
	
	if( $product_cat == 3){
        $fieldtypeid = 5;
    }
    else if($product_cat == 4){
        $fieldtypeid = 20;
    }

	$post_Data = $array = array(
        "changedfieldtypeid" => "",
        "colorid" => "",
        "coloriddual" => "",
        "customertype" => "4",
        "drop" => null,
        "fabricid" => "",
        "fabriciddual" => "",
        "fieldtypeid" => $fieldtypeid,
        "lineitemselectedvalues" => array(),
        "numFraction" => null,
        "orderItemId" => "",
        "orderitemselectedvalues" => "",
        "pricegroup" => "",
        "pricegroupdual" => "",
        "productid" => $product_id,
        "selectedfieldids" => "",
        "selectedvalues" => "",
        "subcolorid" => "",
        "subfabricid" => "",
        "supplier" => "",
        "unittype" => 2,
        "width" => null,
    );
    
    $filterids_result_data_arr = CallAPI_v4("POST",'products/fields/filterbasedongeneraldata',json_encode($post_Data),true);
    $filterids_data_arr        = json_decode(json_encode($filterids_result_data_arr['0']->data), true);

	if(!empty($selected_values)){
	 foreach($selected_values as $selected_value){	
      $optionId  =  $selected_value;
	  $chosen_field = isset($selected_fields_data[$selected_value]) ? $selected_fields_data[$selected_value]:'';
	  if(!$field_id){
		  continue;
	  }	 
	  
	  $post_Data = array(
            'supplierid' => 1,
            'productid' => $product_id,
            'optionid' => [$selected_value],
            'subfieldoptionlinkid' => [$chosen_field],
            'productionformulalist' => [],
            'orderitemselectedvalues' => [
                $field_id => [$selected_value]
            ],
        );
        
       $parameters_arr_response = CallAPI_v4("POST",'products/fields/list/0/'.$recipeid.'/'.$fieldlevel.'/'.$field_type_id.'/'.$field_id.'/',json_encode($post_Data),true);
	   $productionformuladata   = $parameters_arr_response['0']->productionformuladata;
       $parameters_args         = $parameters_arr_response['0']->data; 
       if(empty($parameters_args)){
            continue;
      }
	  
//       $mode ='products/fields/list/'.$product_id.'/'.$level_id.'/'.$optionId.'/'.$field_id.'/'.$chosen_field;
// 	  $resultcontact = CallAPI_v4("GET",$mode);
    //   $parameters_args = json_decode(json_encode($resultcontact->result), true);
	  foreach($parameters_args as $parameters_val){
		  $parameters_arr[] = $parameters_val;
	  }
	 }
	}
    
    global $img_file_path_url ;
	if(!empty($parameters_arr)){
	  ob_start();
	  $stored_cart_item_key = isset($_POST['stored_cart_item_key']) ? $_POST['stored_cart_item_key'] : '';
	  $_cart_item                          = WC()->cart->get_cart_item($stored_cart_item_key);
    $cart_blindmatrix_v4_parameters_data = !empty($_cart_item['blindmatrix_v4_parameters_data']) ? $_cart_item['blindmatrix_v4_parameters_data']:array();  
    $admin_options                       = get_option('option_blindmatrix_v4_group_icon_submit');
    $list_display                        = isset($admin_options['list']["view"]) ? $admin_options['list']["view"]:'dropdown_view';
     foreach($parameters_arr as $_parameter){
        $parameter        = json_decode(json_encode($_parameter), true);
        $field_type_id    = isset($parameter['fieldtypeid'])? $parameter['fieldtypeid'] :'';
        $field_name       = isset($parameter['fieldname'])? $parameter['fieldname'] :'';
        $field_id         = isset($parameter['fieldid'])? $parameter['fieldid'] :'';
        $field_level      = isset($parameter['fieldlevel'])? $parameter['fieldlevel'] :'';
        $mandatory        = isset($parameter['mandatory'])? $parameter['mandatory'] :'';
		$default_option   = isset($parameter['defaultOption'])?$parameter['defaultOption']:'';
        $field_type_name  = isset($parameter['field_type_name'])? $parameter['field_type_name'] :'';
        $field_information= isset($parameter['fieldInformation'])? $parameter['fieldInformation'] :'';
        $masterParentFieldId  = isset($parameter['masterparentfieldid'])? $parameter['masterparentfieldid'] :'';
        $multiple             = isset($parameter['selection']) ? ($parameter['selection']) : ''; 
        $showFieldOnEcommerce = isset($parameter['showfieldecomonjob'])? $parameter['showfieldecomonjob'] :'';
        if(!$field_type_id || !$field_name || !$field_id || !$showFieldOnEcommerce){
            continue;
        }
        $input_class = 'blindmatrix-v4-input w-75 m-0 rounded-3';
        $options = array();
        $options_data = array();
         $hidden_items = array(
             array(
                'class' => 'label',
                'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][label]",
                'value' => $field_name,
            ),
            array(
                'class' => 'field_data',
                'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][field_data]",
                'value' => json_encode($parameter),
            )
         );
         $input_name =  "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][value]";
		 $extra_data = array();
         $default_option_value = array();
         
        if(3 == $field_type_id){
            $input_class            = 'w-75 m-0 rounded-3 blindmatrix-v4-select2 blindmatrix-v4-subcomp-lvl2';
// 			$mode                   ='products/options/listforfieldspage/byfield/'.$product_id.'/'.$field_id.'/3';
// 			$sub_component_response = CallAPI_v4("GET",$mode);
// 			$sub_comp_arr           = json_decode(json_encode($sub_component_response->result), true);

            $post_Data = array(
                "filterids" => 3 == $field_type_id && isset($filterids_data_arr['optionarray'][$field_id]) && is_array($filterids_data_arr['optionarray'][$field_id]) ? $filterids_data_arr['optionarray'][$field_id]:array(),
                "productionformulalist" => array(),
                "productid" => $product_id,
             );
            $parameters_sub_result_data_arr = CallAPI_v4("POST",'products/get/fabric/options/list/'.$recipeid.'/'.$field_level.'/0/'.$field_type_id.'/0/'.$field_id.'/?perpage=50',json_encode($post_Data),true);
			$sub_comp_arr                   = $parameters_sub_result_data_arr[0]->data[0]->optionsvalue;
			if(!empty($sub_comp_arr) && is_array($sub_comp_arr)){
				foreach($sub_comp_arr as $_sub_comp_value){
				        $sub_comp_value       = json_decode(json_encode($_sub_comp_value), true);
						$id = isset($sub_comp_value['fieldoptionlinkid']) ? $sub_comp_value['fieldoptionlinkid']:'';
                        $option_name = isset($sub_comp_value['optionname']) ? $sub_comp_value['optionname']:'';
                        $option_image_url = isset($sub_comp_value['optionimage']) ? $sub_comp_value['optionimage']:'';
                        $option_id = isset($sub_comp_value['optionid']) ? $sub_comp_value['optionid']:'';
                        $option_qty = isset($sub_comp_value['optionqty']) ? $sub_comp_value['optionqty']:'';
				// 		$customerType_data = !empty($sub_comp_value['customerType']) ? json_decode($sub_comp_value['customerType'],true):array();
				// 		$show_ecommerce = isset($customerType_data[4]) ? $customerType_data[4]:false;
				        $show_ecommerce = isset($sub_comp_value['availableForEcommerce']) ? $sub_comp_value['availableForEcommerce']:'';
                        if(!$option_id || !$option_name || !$show_ecommerce){
                            continue;
                        }
                        $options[$id] = $option_name;
                        $option_image_url = str_replace('/storage','',$option_image_url);
						$option_image_url = ltrim($option_image_url,'/');
                        $options_data[$id]['img_url'] = '';
                        if($option_image_url){
                            $options_data[$id]['img_url'] = $img_file_path_url.$option_image_url;
                        }
						// if(!@getimagesize($img_file_path_url.$option_image_url)){
						// 	$options_data[$id]['img_url'] = '';
						// }
                        if(!empty($default_option) && is_array($default_option) && in_array($option_id,$default_option)){
                            $default_option_value[] = $option_name;
                        }
                        elseif (!empty($default_option) && intval($default_option) == $option_id ) {
                            $default_option_value[] = $option_name;
                        }
						$options_data[$id]['field_id'] = $id;
                        $options_data[$id]['option_id'] = $option_id;
						$extra_data[$id]['option_id'] = $option_id;
                        $default_option_value = is_array($default_option_value) ? implode(',',$default_option_value):$default_option_value;
				}
			}
			if(empty($options)){
			    continue;
			}
			$hidden_items = array(
                array(
                    'class' => 'label',
                    'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][label]",
                    'value' => $field_name,
                ),
                array(
                    'class' => 'value',
                    'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][value]",
                    'value' => "$default_option_value",
                ),
                array(
                    'class' => 'field_data',
                    'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][field_data]",
                    'value' => json_encode($parameter),
                ),
                array(
                    'class' => 'option_data',
                    'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][option_data]",
                    'value' => json_encode($sub_comp_arr),
                )
            );
            $input_name = "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][chosen_options][]";
        }
        $subcomponent_name_class ="blindmatrix-v4-sub-component-section-$masterParentFieldId-$optionId";
        $wrapper_class = "blindmatrix-v4-parameter-wrapper $subcomponent_name_class";       
        $bootstrap_class = ' d-flex justify-content-between align-items-center my-2 py-2 ';
        $field_args = array(
            'input_class'       => $input_class,
            'wrapper_class'     => $wrapper_class,
            'bootstrap_class'   => $bootstrap_class,
            'label'             => $field_name,
            'label_information' => $field_information,
            'name'              => $input_name,
            'custom_attributes' => array(),
            'mandatory'         => $mandatory,
            'options'           => $options,
            'options_data'      => $options_data,
            'default'           => $default_option,
            'description'       => '',
            'value'             => '',
            'multiple'          => $multiple,
            'data'              => array(
                'field_type_id'   => $field_type_id,
                'field_id'        => $field_id,
                'field_type_name' => $field_type_name 
            ),
            'css'               => '',
            'hidden_items'      => $hidden_items,
			'extra_data'        => $extra_data, 
            'fraction_array'    =>array(), 
        );
        if('2' == $product_cat && 'image_view' == $list_display ){
            get_blindmatrix_v4_parameters_HTML(25,$field_args);
        }else{
            get_blindmatrix_v4_parameters_HTML($field_type_id,$field_args);
        }
     }
	  $content = ob_get_contents();
      ob_end_clean();
	}

    $result['html'] = $content;
    $result['success'] ='true';
    wp_send_json_success($result);
}

add_action( 'wp_ajax_nopriv_accessories_subcomponent', 'accessories_subcomponent' );
add_action( 'wp_ajax_accessories_subcomponent', 'accessories_subcomponent' );
function accessories_subcomponent(){
    $product_id = $_POST['product_id'];
    $selected_values = $_POST['selected_value'];
	$selected_values = !empty($selected_values) && !is_array($selected_values) ? array($selected_values):$selected_values; 
	$selected_values = is_array($selected_values) && !empty($selected_values) ? $selected_values:array();
    $selected_fields_data = isset($_POST['selected_fields_data']) ? $_POST['selected_fields_data'] : '';
    $field_id = $_POST['field_id'];
    $fieldlevel = $_POST['fieldlevel']+1 ;
    $field_type_id = $_POST['field_type_id'] ;
    $level_id = 2 ;
	$content = '';
	$parameters_arr = array();
	$result = array();
	$form_data = isset($_POST["form_data"]) ? wp_parse_args($_POST["form_data"]):array();
	$product_cat = isset($form_data["blindmatrix_v4_parameters_data"]["category"]) ? $form_data["blindmatrix_v4_parameters_data"]["category"]:'';
	$recipeid    = !empty($form_data["blindmatrix_v4_parameters_data"]['recipeid']) ? $form_data["blindmatrix_v4_parameters_data"]['recipeid']:'';
	$filterids_data_arr = array();
	$post_Data = array(
            "changedfieldtypeid" => "",
            "colorid" => "",
            "coloriddual" => "",
            "customertype" => "4",
            "drop" => null,
            "fabricid" => "",
            "fabriciddual" => "",
            "fieldtypeid" => "3",
            "lineitemselectedvalues" => array(),
            "numFraction" => null,
            "orderItemId" => "",
            "orderitemselectedvalues" => "",
            "pricegroup" => "",
            "pricegroupdual" => "",
            "productid" => $product_id,
            "selectedfieldids" => "",
            "selectedvalues" => "",
            "subcolorid" => "",
            "subfabricid" => "",
            "supplier" => "",
            "unittype" => 2,
            "width" => null,
        );
          
    $filterids_result_data_arr = CallAPI_v4("POST",'products/fields/filterbasedongeneraldata',json_encode($post_Data),true);
    $filterids_data_arr = json_decode(json_encode($filterids_result_data_arr['0']->data), true);
	
	if(!empty($selected_values)){
	 foreach($selected_values as $selected_value){	
      $optionId  =  $selected_value;
	  $chosen_field = isset($selected_fields_data[$selected_value]) ? $selected_fields_data[$selected_value]:'';
	  if(!$field_id){
		  continue;
	  }	 
	  
      $post_Data = array(
            'supplierid' => 1,
            'productid' => $product_id,
            'optionid' => [$selected_value],
            'subfieldoptionlinkid' => [$chosen_field],
            'productionformulalist' => [],
            'orderitemselectedvalues' => [
                $field_id => [$selected_value]
            ],
        );
        
       $parameters_arr_response = CallAPI_v4("POST",'products/fields/list/0/'.$recipeid.'/'.$fieldlevel.'/'.$field_type_id.'/'.$field_id.'/',json_encode($post_Data),true);
	   $productionformuladata   = $parameters_arr_response['0']->productionformuladata;
       $parameters_args         = $parameters_arr_response['0']->data; 
	  
	  if(empty($parameters_args)){
        continue;
      }
      
	  foreach($parameters_args as $parameters_val){
		  $parameters_arr[] = $parameters_val;
	  }
	 }
	}
	
    global $img_file_path_url;
	if(!empty($parameters_arr)){
	  ob_start();
	  $stored_cart_item_key = isset($_POST['stored_cart_item_key']) ? $_POST['stored_cart_item_key'] : '';
	  $_cart_item                          = WC()->cart->get_cart_item($stored_cart_item_key);
    $cart_blindmatrix_v4_parameters_data = !empty($_cart_item['blindmatrix_v4_parameters_data']) ? $_cart_item['blindmatrix_v4_parameters_data']:array();  
    $admin_options                       = get_option('option_blindmatrix_v4_group_icon_submit');
    $list_display                        = isset($admin_options['list']["view"]) ? $admin_options['list']["view"]:'dropdown_view';
     foreach($parameters_arr as $_parameter){
        $parameter       = json_decode(json_encode($_parameter), true);
        $field_type_id    = isset($parameter['fieldtypeid'])? $parameter['fieldtypeid'] :'';
        $field_name       = isset($parameter['fieldname'])? $parameter['fieldname'] :'';
        $field_id         = isset($parameter['fieldid'])? $parameter['fieldid'] :'';
        $field_level      = isset($parameter['fieldlevel'])? $parameter['fieldlevel'] :'';
        $mandatory        = isset($parameter['mandatory'])? $parameter['mandatory'] :'';
		$default_option   = isset($parameter['defaultOption'])?$parameter['defaultOption']:'';
        $field_type_name  = isset($parameter['field_type_name'])? $parameter['field_type_name'] :'';
        $field_information= isset($parameter['fieldInformation'])? $parameter['fieldInformation'] :'';
        $masterParentFieldId  = isset($parameter['masterparentfieldid'])? $parameter['masterparentfieldid'] :'';
        $multiple             = isset($parameter['selection']) ? ($parameter['selection']) : ''; 
        $showFieldOnEcommerce    = isset($parameter['showfieldecomonjob'])? $parameter['showfieldecomonjob'] :'';
        if(!$field_type_id || !$field_name || !$field_id || !$showFieldOnEcommerce){
            continue;
        }

        $input_class = 'blindmatrix-v4-input w-75 m-0 rounded-3';
        $options = array();
        $options_data = array();
         $hidden_items = array(
             array(
                'class' => 'label',
                'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][label]",
                'value' => $field_name,
            ),
            array(
                'class' => 'field_data',
                'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][field_data]",
                'value' => json_encode($parameter),
            )
         );
         $input_name =  "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][value]";
		 $extra_data = array();
         $default_option_value = array();
        if(3 == $field_type_id){
            $input_class            = 'w-75 m-0 rounded-3 blindmatrix-v4-select2 blindmatrix-v4-subcomp-lvl2';
// 			$mode                   ='products/options/listforfieldspage/byfield/'.$product_id.'/'.$field_id.'/3';
// 			$sub_component_response = CallAPI_v4("GET",$mode);
// 			$sub_comp_arr           = json_decode(json_encode($sub_component_response->result), true);
            $post_Data = array(
                "filterids" => 3 == $field_type_id && isset($filterids_data_arr['optionarray'][$field_id]) && is_array($filterids_data_arr['optionarray'][$field_id]) ? $filterids_data_arr['optionarray'][$field_id]:array(),
                "productionformulalist" => array(),
                "productid" => $product_id,
             );
            $parameters_sub_result_data_arr = CallAPI_v4("POST",'products/get/fabric/options/list/'.$recipeid.'/'.$field_level.'/0/'.$field_type_id.'/0/'.$field_id.'/?perpage=50',json_encode($post_Data),true);
			$sub_comp_arr                   = $parameters_sub_result_data_arr[0]->data[0]->optionsvalue;
			if(!empty($sub_comp_arr) && is_array($sub_comp_arr)){
				foreach($sub_comp_arr as $_sub_comp_value){
				        $sub_comp_value       = json_decode(json_encode($_sub_comp_value), true);
						$id = isset($sub_comp_value['fieldoptionlinkid']) ? $sub_comp_value['fieldoptionlinkid']:'';
                        $option_name = isset($sub_comp_value['optionname']) ? $sub_comp_value['optionname']:'';
                        $option_image_url = isset($sub_comp_value['optionimage']) ? $sub_comp_value['optionimage']:'';
                        $option_id = isset($sub_comp_value['optionid']) ? $sub_comp_value['optionid']:'';
                        $option_qty = isset($sub_comp_value['optionqty']) ? $sub_comp_value['optionqty']:'';
				// 		$customerType_data = !empty($sub_comp_value['customerType']) ? json_decode($sub_comp_value['customerType'],true):array();
				// 		$show_ecommerce = isset($customerType_data[4]) ? $customerType_data[4]:false;
				        $show_ecommerce = isset($sub_comp_value['availableForEcommerce']) ? $sub_comp_value['availableForEcommerce']:'';
                        if(!$option_id || !$option_name || !$show_ecommerce){
                            continue;
                        }
                        $options[$id] = $option_name;
                        $option_image_url = str_replace('/storage','',$option_image_url);
						$option_image_url = ltrim($option_image_url,'/');
                        $options_data[$id]['img_url'] = '';
                        if($option_image_url){
                            $options_data[$id]['img_url'] = $img_file_path_url.$option_image_url;
                        }
						// if(!@getimagesize($img_file_path_url.$option_image_url)){
						// 	$options_data[$id]['img_url'] = '';
						// }
                        if(!empty($default_option) && is_array($default_option) && in_array($option_id,$default_option)){
                            $default_option_value[] = $option_name;
                        }
                        elseif (!empty($default_option) && intval($default_option) == $option_id ) {
                            $default_option_value[] = $option_name;
                        }
						$options_data[$id]['field_id'] = $id;
                        $options_data[$id]['option_id'] = $option_id;
						$extra_data[$id]['option_id'] = $option_id;
                        $default_option_value = is_array($default_option_value) ? implode(',',$default_option_value):$default_option_value;
				}
			}
			
			if(empty($options)){
			    continue;
			}
			$hidden_items = array(
                array(
                    'class' => 'label',
                    'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][label]",
                    'value' => $field_name,
                ),
                array(
                    'class' => 'value',
                    'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][value]",
                    'value' => "$default_option_value",
                ),
                array(
                    'class' => 'field_data',
                    'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][field_data]",
                    'value' => json_encode($parameter),
                ),
                array(
                    'class' => 'option_data',
                    'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][option_data]",
                    'value' => json_encode($sub_comp_arr),
                )
            );
            $input_name = "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][level2sub][$field_id][chosen_options][]";
        }
        $subcomponent_name_class ="blindmatrix-v4-sub-component-section-$masterParentFieldId-$optionId";
        $wrapper_class = "blindmatrix-v4-parameter-wrapper $subcomponent_name_class";       
        $bootstrap_class = ' d-flex justify-content-between align-items-center my-2 py-2 ';
        $field_args = array(
            'input_class'       => $input_class,
            'wrapper_class'     => $wrapper_class,
            'bootstrap_class'   => $bootstrap_class,
            'label'             => $field_name,
            'label_information' => $field_information,
            'name'              => $input_name,
            'custom_attributes' => array(),
            'mandatory'         => $mandatory,
            'options'           => $options,
            'options_data'      => $options_data,
            'default'           => $default_option,
            'description'       => '',
            'value'             => '',
            'multiple'          => $multiple,
            'data'              => array(
                'field_type_id'   => $field_type_id,
                'field_id'        => $field_id,
                'field_type_name' => $field_type_name 
            ),
            'css'               => '',
            'hidden_items'      => $hidden_items,
			'extra_data'        => $extra_data, 
            'fraction_array'    =>array(), 
        );
        if('2' == $product_cat && 'image_view' == $list_display ){
            get_blindmatrix_v4_parameters_HTML(25,$field_args);
        }else{
            get_blindmatrix_v4_parameters_HTML($field_type_id,$field_args);
        }
     }
	  $content = ob_get_contents();
      ob_end_clean();
	}

    $result['html'] = $content;
    $result['success'] ='true';
    wp_send_json_success($result);
}
/**
 *
 * Get blindmatrix v4 sub component in HTML
 * 
 * 
 */
add_action( 'wp_ajax_nopriv_shutter_subcomponent', 'shutter_subcomponent' );
add_action( 'wp_ajax_shutter_subcomponent', 'shutter_subcomponent' );
function shutter_subcomponent(){
    $product_id = $_POST['product_id'];
    $selected_values = $_POST['selected_value'];
	$selected_values = !empty($selected_values) && !is_array($selected_values) ? array($selected_values):$selected_values; 
	$selected_values = is_array($selected_values) && !empty($selected_values) ? $selected_values:array();
    $selected_fields_data = $_POST['selected_fields_data'];
    $selected_fields_data = !empty($selected_fields_data) && !is_array($selected_fields_data) ? array($selected_fields_data):$selected_fields_data;
    $selected_fields_data = is_array($selected_fields_data) && !empty($selected_fields_data) ? $selected_fields_data:array();
    $field_id = $_POST['field_id'];
    $recipeid = $_POST['recipeid'];
    $category_id = $_POST['category_id'];
    $fieldlevel = $_POST['fieldlevel']+1 ;
    $field_type_id = $_POST['field_type_id'] ;
    $chosen_range = $_POST['range'] ;
    $chosen_shutter = $_POST['shutter'] ;
    $shuttertypes = $_POST['shuttertype_id'] ;
	$content = '';
	$parameters_arr = array();
	$result = array();
	
    $get_v4_shutterlists = blindmatrix_v4_get_product_list_data('shutters');

    // $filtered = array_filter($get_v4_shutterlists, function($item) use ($shuttertypeid, $product_id) {
    //     return $item['shuttertypeid'] == $chosen_shutter && $item['pei_productid'] == $product_id;
    // });
    
    // $id = key($filtered);

    //$id = array_search($product_id, array_column($get_v4_shutterlists, 'pei_productid'));
    // $_product_list_data = isset($get_v4_shutterlists[$id]) ? $get_v4_shutterlists[$id]:array();
    // $shuttertypes = $_product_list_data['shuttertypes'];
    $args = array();
    //$color_result_data_arr = CallAPI_v4("GET",'getshutthermaterialsdetailssub/'.$product_id.'/'.$chosen_range,json_encode($args));
    
$blindmatrix_v4_option_data =  get_option('shutter_option_data');
    $colour_text  = trim(strtolower($blindmatrix_v4_option_data['shutter']['colour']['text']));
    $colour_on    = isset($blindmatrix_v4_option_data['shutter']['colour'][$shuttertypes])? $blindmatrix_v4_option_data['shutter']['colour'][$shuttertypes]:'';

	if(!empty($selected_values)){

        if( $category_id == 3){
            $fieldtypeid = 5;
        }
        else if($category_id == 4){
            $fieldtypeid = 20;
        }
        else if($category_id == 5){
            $fieldtypeid = 21;
        }
          $post_Data = $array = array(
            "changedfieldtypeid" => "",
            "colorid" => "",
            "coloriddual" => "",
            "customertype" => "4",
            "drop" => null,
            "fabricid" => "",
            "fabriciddual" => "",
            "fieldtypeid" => $fieldtypeid,
            "lineitemselectedvalues" => array(),
            "numFraction" => null,
            "orderItemId" => "",
            "orderitemselectedvalues" => "",
            "pricegroup" => "",
            "pricegroupdual" => "",
            "productid" => $product_id,
            "selectedfieldids" => "",
            "selectedvalues" => "",
            "subcolorid" => "",
            "subfabricid" => "",
            "supplier" => "",
            "unittype" => 2,
            "width" => null,
        );
          
          $filterids_result_data_arr = CallAPI_v4("POST",'products/fields/filterbasedongeneraldata',json_encode($post_Data),true);
          $filterids_data_arr = json_decode(json_encode($filterids_result_data_arr['0']->data), true);
	 foreach($selected_values as $selected_value){	
      $optionId  =  $selected_value;
	  $chosen_field = isset($selected_fields_data[$selected_value]) ? $selected_fields_data[$selected_value]:'';
	  if(!$field_id){
		  continue;
	  }	 
       $post_Data = array(
                          "optionid" => $selected_values,
                          "subfieldoptionlinkid" => $selected_fields_data,
                          "filterids" => "",
                          "productionformulalist" => array(),
                          "productid" => $product_id,
                        );
      $parameters_arr_response = CallAPI_v4("POST",'products/fields/list/0/'.$recipeid.'/'.$fieldlevel.'/'.$field_type_id.'/'.$field_id.'/',json_encode($post_Data),true);

        $productionformuladata = $parameters_arr_response['0']->productionformuladata;
       $parameters_args = $parameters_arr_response['0']->data; 
 
      //$parameters_args = json_decode(json_encode($resultcontact->result), true);
      if(empty($parameters_args)){
        continue;
    }
	  foreach($parameters_args as $parameters_val){
		  $parameters_arr[] = $parameters_val;
	  }
	 }
	}
	$stored_cart_item_key = isset($_POST['stored_cart_item_key']) ? $_POST['stored_cart_item_key'] : '';
	$_cart_item                          = WC()->cart->get_cart_item($stored_cart_item_key);
$cart_blindmatrix_v4_parameters_data = !empty($_cart_item['blindmatrix_v4_parameters_data']) ? $_cart_item['blindmatrix_v4_parameters_data']:array();
	$shutter_sub_comp_exists = 'no';
    global $img_file_path_url ;
	if(!empty($parameters_arr)){
	  ob_start();
     foreach($parameters_arr as $parameter){
        $parameter = (array) $parameter;
        $showFieldOnEcommerce    = isset($parameter['showfieldecomonjob'])? $parameter['showfieldecomonjob'] :'';
        $field_type_id    = isset($parameter['fieldtypeid'])? $parameter['fieldtypeid'] :'';

        $field_name       = isset($parameter['fieldname'])? $parameter['fieldname'] :'';
        $field_id         = isset($parameter['fieldid'])? $parameter['fieldid'] :'';
        $field_level      = isset($parameter['fieldlevel'])? $parameter['fieldlevel'] :'';
        if(21 == $field_type_id ){
            $default_option   = $chosen_range;
        }else{
            $default_option   = isset($parameter['optiondefault'])?$parameter['optiondefault']:'';
        }
        $multiple         = isset($parameter['selection']) ? ($parameter['selection'] == 1 ? true : false) : '';
        $mandatory        = isset($parameter['mandatory'])? ($parameter['mandatory'] == 1 ? 'on' : '') :'';
        $field_information= isset($parameter['fieldInformation'])? $parameter['fieldInformation'] :'';
        $fabricorcolor    = isset($parameter['fabricorcolor'])? $parameter['fabricorcolor'] :'';
        $masterParentFieldId    = isset($parameter['masterparentfieldid'])? $parameter['masterparentfieldid'] :'';
        $field_has_sub_option       = isset($parameter['field_has_sub_option'])? $parameter['field_has_sub_option'] : 0 ;
        $shutter_visualizer_class ='';
        if(!$field_type_id || !$field_name || !$field_id || !$showFieldOnEcommerce){
            continue;
        }
        
        $input_class = 'blindmatrix-v4-input w-75 m-0 rounded-3';
        if(strtolower($field_name) == $colour_text){
            $shutter_visualizer_class = 'color_img d-none';
        }
        $options = array();
        $leveltext = 'level'.$field_level.'sub';
        $options_data = array();
         $hidden_items = array(
             array(
                'class' => 'label',
                'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][$leveltext][$field_id][label]",
                'value' => $field_name,
            ),
            array(
                'class' => 'field_data',
                'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][$leveltext][$field_id][field_data]",
                'value' => json_encode($parameter),
            )
         );
         $input_name =  "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][$leveltext][$field_id][value]";
		 $extra_data = array();
		 $default_option_value_arr = array();
         $default_option_value = array();
        if(3 == $field_type_id || 21 == $field_type_id){
            $input_class_sublevel_name = 'blindmatrix-v4-subcomp-level'.$field_level;
            $input_class            = "w-75 m-0 rounded-3 blindmatrix-v4-select2 $shutter_visualizer_class $input_class_sublevel_name";
			//$mode                   ='products/options/listforfieldspage/byfield/'.$product_id.'/'.$field_id.'/3';
			//$sub_component_response = CallAPI_v4("GET",$mode);
			//$sub_comp_arr           = json_decode(json_encode($sub_component_response->result), true);
           
            $post_Data = array(
                "filterids" => 3== $field_type_id && isset($filterids_data_arr['optionarray'][$field_id]) && is_array($filterids_data_arr['optionarray'][$field_id]) ? $filterids_data_arr['optionarray'][$field_id]:array(),
                "productionformulalist" => array(),
                "productid" => $product_id,
              );
              $parameters_sub_result_data_arr = CallAPI_v4("POST",'products/get/fabric/options/list/'.$recipeid.'/'.$field_level.'/0/'.$field_type_id.'/'.$fabricorcolor.'/'.$field_id.'/?perpage=50',json_encode($post_Data),true);
             // $sub_comp_arr =  isset($parameter['optionsvalue'])? $parameter['optionsvalue'] :'';

            $sub_comp_arr = $parameters_sub_result_data_arr[0]->data[0]->optionsvalue;
   
			if(!empty($sub_comp_arr) && is_array($sub_comp_arr)){
				foreach($sub_comp_arr as $sub_comp_value){
                    $sub_comp_value = (array) $sub_comp_value;
                    $id = isset($sub_comp_value['fieldoptionlinkid']) ? $sub_comp_value['fieldoptionlinkid']:'';
                    $option_name = isset($sub_comp_value['optionname']) ? $sub_comp_value['optionname']:'';
                    $option_image_url = isset($sub_comp_value['optionimage']) ? $sub_comp_value['optionimage']:'';
                    $option_id = isset($sub_comp_value['optionid']) ? $sub_comp_value['optionid']:'';
                    $option_qty = isset($sub_comp_value['optionqty']) ? $sub_comp_value['optionqty']:'';	
                    $show_ecommerce = isset($sub_comp_value['availableForEcommerce']) ? $sub_comp_value['availableForEcommerce']:'';	
                   // $show_ecommerce = isset($customerType_data[4]) ? $customerType_data[4]:true;
                   if(21 == $field_type_id){
                        $show_ecommerce = 1;
                    }
                        if(!$option_id || !$option_name || !$show_ecommerce){
                            continue;
                        }
                        
                        $options[$id] = $option_name;
                        $option_image_url = str_replace('/storage','',$option_image_url);
						$option_image_url = ltrim($option_image_url,'/');
                        $options_data[$id]['img_url'] = '';
                        if($option_image_url){
                            $options_data[$id]['img_url'] = $img_file_path_url.$option_image_url;
                        }
						// if(!@getimagesize($img_file_path_url.$option_image_url)){
						// 	$options_data[$id]['img_url'] = '';
						// }
                        
                        if(!empty($default_option) && is_array($default_option) && in_array($option_id,$default_option)){
                            $default_option_value_arr[] = $option_name;
                        }
                        elseif (!empty($default_option) && intval($default_option) == $option_id ) {
                            $default_option_value_arr[] = $option_name;
                        }
                        if(21 == $field_type_id){
                            $options_data[$id]['max_drop']  = $sub_comp_value['color_max_drop'];
                            $options_data[$id]['max_width'] = $sub_comp_value['color_max_width'];
                            $options_data[$id]['min_drop']  = $sub_comp_value['color_min_drop'];
                            $options_data[$id]['min_width'] = $sub_comp_value['color_min_width'];
                        }
						$options_data[$id]['field_id'] = $id;
                        $options_data[$id]['option_id'] = $option_id;
						$extra_data[$id]['option_id'] = $option_id;
                        $default_option_value = is_array($default_option_value_arr) ? implode(',',$default_option_value_arr):$default_option_value_arr;
				}
			}
// 			$saved_cart_options_arr = isset($cart_blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][$leveltext][$field_id]["chosen_options"]) ? $cart_blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][$leveltext][$field_id]["chosen_options"]:array();
// 			if(!empty($saved_cart_options_arr) && is_array($saved_cart_options_arr)){
// 				$default_option = implode(',',$saved_cart_options_arr);
// 				var_dump($default_option);
// 			}
						
			if(empty($options)){
			    continue;
			}
			
			if(3 == $field_type_id){
				$shutter_sub_comp_exists = 'yes';
			}
			
			$hidden_items = array(
                array(
                    'class' => 'label',
                    'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][$leveltext][$field_id][label]",
                    'value' => $field_name,
                ),
                array(
                    'class' => 'value',
                    'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][$leveltext][$field_id][value]",
                    'value' => "$default_option_value",
                ),
                array(
                    'class' => 'field_data',
                    'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][$leveltext][$field_id][field_data]",
                    'value' => json_encode($parameter),
                ),
                array(
                    'class' => 'option_data',
                    'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][$leveltext][$field_id][option_data]",
                    'value' => json_encode($sub_comp_arr),
                )
            );
            $input_name = "blindmatrix_v4_parameters_data[$field_type_id][$masterParentFieldId][$leveltext][$field_id][chosen_options][]";
        }
        $subcomponent_name_class ="blindmatrix-v4-sub-component-section-$masterParentFieldId-$optionId";
        if(21 == $field_type_id){
            $subcomponent_name_class = $subcomponent_name_class.' '.'blindmatrix-v4-range-section';
        }
        $wrapper_class = "blindmatrix-v4-parameter-wrapper $subcomponent_name_class $shutter_visualizer_class";    
        $bootstrap_class = ' d-flex justify-content-between align-items-center py-3 ';
        $field_args = array(
            'input_class'       => $input_class,
            'wrapper_class'     => $wrapper_class,
            'bootstrap_class'   => $bootstrap_class,
            'label'             => $field_name,
            'label_information' => $field_information,
            'name'              => $input_name,
            'custom_attributes' => array(),
            'mandatory'         => $mandatory,
            'options'           => $options,
            'options_data'      => $options_data,
            'default'           => $default_option,
            'description'       => '',
            'value'             => '',
            'multiple'          => false,
            'data'              => array(
                'field_type_id'   => $field_type_id,
                'field_id'        => $masterParentFieldId,
                'category_id'     => $category_id,
                'fieldlevel'      => $field_level,
                'recipeid'        => $recipeid,
                'field_has_sub_option'     => $field_has_sub_option,
            ),
            'css'               => '',
            'hidden_items'      => $hidden_items,
			'extra_data'        => $extra_data, 
            'fraction_array'    =>array(), 
        );
        get_blindmatrix_v4_parameters_HTML($field_type_id,$field_args);
        
        $color_field_args = array(
            'wrapper_class'         => "blindmatrix-v4-parameter-wrapper $subcomponent_name_class",
            'label'                 => 'Choose a shutter colour',
            'color_wrapper_class'   => "blindmatrix-v4-shutter-color-data-wrapper",
            'color_children_class'  => 'blindmatrix-v4-shutter-color-data',  
            'product_id'            => $product_id,
            'mandatory'             => $mandatory,
            'options'               => $options,
            'options_data'          => $options_data,
            'label_information'     => $field_information,
            'default'               => $default_option,
          );   
          if(strtolower($field_name) == $colour_text && !empty($colour_on)){
        
            blindmatrix_v4_render_shuter_colors_HTML($color_field_args);
        } 
     }
	  $content = ob_get_contents();
      ob_end_clean();
	}
    $result['html'] 				   = $content;
	$result['shutter_sub_comp_exists'] = $shutter_sub_comp_exists;
    // $chosen_color_index = (array_search($product_colourmapid, array_column($color_result_data_arr->result->value, 'id')));
    // $chose_color_data = isset($color_result_data_arr->result->value[$chosen_color_index]) ? (array)$color_result_data_arr->result->value[$chosen_color_index]:array();
    // if(!empty($chose_color_data) && is_array($chose_color_data)){
    //   foreach($chose_color_data as $key => $value){
    //       $result[$key] = $value;
    //   }
    // }

    $result['success'] ='true';
    wp_send_json_success($result);
}
/**
 *
 * Get price details
 * 
 * 
 */
add_action( 'wp_ajax_nopriv_price_calculation', 'price_calculation' );
add_action( 'wp_ajax_price_calculation', 'price_calculation' );
function price_calculation(){
    $form_data = isset($_POST['form_data']) ? $_POST['form_data']:array();
    $form_data = wp_parse_args($form_data);
    $blindmatrix_v4_parameters_data = isset($form_data['blindmatrix_v4_parameters_data']) ? $form_data['blindmatrix_v4_parameters_data']:array();
	$unittype = isset($blindmatrix_v4_parameters_data['unittype']) ? $blindmatrix_v4_parameters_data['unittype']:'';
    $list_data = isset($blindmatrix_v4_parameters_data[3]) ? $blindmatrix_v4_parameters_data[3]:array();
	$overall_list_data = $list_data;
		if(!empty($list_data) && is_array($list_data)){
			foreach($list_data as $list_value){
				if(isset($list_value['level2sub'])){
					$level2sub_data = $list_value['level2sub'];
					$overall_list_data = array_merge($overall_list_data,$level2sub_data);
				}
			}
		}
    $option_overall_data = !empty($overall_list_data) && is_array($overall_list_data) ? array_values($overall_list_data) : array();
    $_option_data =[];
    if(is_array($option_overall_data) || !empty($option_overall_data)){
		foreach($option_overall_data as $option_value){
			$field_data = !empty($option_value['field_data']) ? json_decode($option_value['field_data'],true):array();
		}
        $chosen_option_data = array_filter(array_map(function($option_data){
            return isset($option_data['chosen_options']) ? $option_data['chosen_options']:''; 
        },$option_overall_data));
        if(is_array($chosen_option_data) || !empty($chosen_option_data)){
            foreach($chosen_option_data as $chosen_option_ids){
                if(empty(array_filter($chosen_option_ids))){
                        continue;
                }
                foreach($chosen_option_ids as $chosen_option_id){
                    $_option_data[] =[
                        "optionvalue" => $chosen_option_id,
                        "fieldtypeid" => 3,
                        "optionqty"=> 1
                    ];
                }
            }
        }
    }
	$product_category_id = isset($blindmatrix_v4_parameters_data['category']) ? $blindmatrix_v4_parameters_data['category']:'';
    $product_id = isset($blindmatrix_v4_parameters_data['product_id']) ? $blindmatrix_v4_parameters_data['product_id']:'';
    $supplier_id = isset($blindmatrix_v4_parameters_data['supplier_id']) ? $blindmatrix_v4_parameters_data['supplier_id']:'';
    $width_arr = isset($blindmatrix_v4_parameters_data[11]) ? $blindmatrix_v4_parameters_data[11]:'';
	$widthfraction_id = isset($blindmatrix_v4_parameters_data['widthfraction']) ? $blindmatrix_v4_parameters_data['widthfraction']:'';
	if('5' == $product_category_id){
		$width_arr = isset($blindmatrix_v4_parameters_data[$widthfraction_id]) ? $blindmatrix_v4_parameters_data[$widthfraction_id]:'';
	}
    $width_arr = !empty($width_arr) && is_array($width_arr) ? array_values($width_arr):array();
    $width     = isset($width_arr[0]['value']) ? $width_arr[0]['value']:'';	
    $drop_arr = isset($blindmatrix_v4_parameters_data[12]) ? $blindmatrix_v4_parameters_data[12]:'';
	$dropfraction_id  = isset($blindmatrix_v4_parameters_data['dropfraction']) ? $blindmatrix_v4_parameters_data['dropfraction']:'';
	if( '5' == $product_category_id){
		$drop_arr = isset($blindmatrix_v4_parameters_data[$dropfraction_id]) ? $blindmatrix_v4_parameters_data[$dropfraction_id]:'';
	}
    $drop_arr = !empty($drop_arr) && is_array($drop_arr) ? array_values($drop_arr):array();
    $drop     = isset($drop_arr[0]['value']) ? $drop_arr[0]['value']:'';
	if('4' == $unittype && '5' == $product_category_id){
		// Inch type
		$width_fraction_val = isset($blindmatrix_v4_parameters_data['widthfraction_val']) ? $blindmatrix_v4_parameters_data['widthfraction_val']:'';
		$drop_fraction_val = isset($blindmatrix_v4_parameters_data['dropfraction_val']) ? $blindmatrix_v4_parameters_data['dropfraction_val']:'';
		$fraction_data_arr = !empty($blindmatrix_v4_parameters_data['fraction_data_width']) ? json_decode($blindmatrix_v4_parameters_data['fraction_data_width'],true):array();
		$chosen_width_fraction_index = !empty($width_fraction_val) && !empty($fraction_data_arr) ? array_search($width_fraction_val,array_column($fraction_data_arr, 'name')):'';
		$chosen_drop_fraction_index = !empty($drop_fraction_val) && !empty($fraction_data_arr) ? array_search($drop_fraction_val,array_column($fraction_data_arr, 'name')):'';
		$chosen_width_fraction_arr = isset($fraction_data_arr[$chosen_width_fraction_index]) ? $fraction_data_arr[$chosen_width_fraction_index]:array();
		$chosen_drop_fraction_arr  = isset($fraction_data_arr[$chosen_drop_fraction_index]) ? $fraction_data_arr[$chosen_drop_fraction_index]:array();
		$width_decimalvalue = !empty($chosen_width_fraction_arr['decimalvalue']) ? $chosen_width_fraction_arr['decimalvalue']:'';
		$drop_decimalvalue = !empty($chosen_drop_fraction_arr['decimalvalue']) ? $chosen_drop_fraction_arr['decimalvalue']:'';
		$width = floatval($width) + floatval($width_decimalvalue);
		$drop  = floatval($drop) + floatval($drop_decimalvalue);
	}
	
    $vat_percentage = isset($blindmatrix_v4_parameters_data['vat_percentage']) && !empty($blindmatrix_v4_parameters_data['vat_percentage']) ? $blindmatrix_v4_parameters_data['vat_percentage']:'';
    $fabricid = isset($blindmatrix_v4_parameters_data['fabricid']) ? $blindmatrix_v4_parameters_data['fabricid']:'';
    $colorid = isset($blindmatrix_v4_parameters_data['colorid']) ? $blindmatrix_v4_parameters_data['colorid']:'';
    $product_type = isset($blindmatrix_v4_parameters_data['product_type']) ? $blindmatrix_v4_parameters_data['product_type']:'';
    $rules_cost_price_comes_from = isset($blindmatrix_v4_parameters_data['rules_cost_price_comes_from']) ? $blindmatrix_v4_parameters_data['rules_cost_price_comes_from']:'';
    $rules_net_price_comes_from = isset($blindmatrix_v4_parameters_data['rules_net_price_comes_from']) ? $blindmatrix_v4_parameters_data['rules_net_price_comes_from']:'';
    $chosen_tax_data = isset($blindmatrix_v4_parameters_data['chosen_tax_data']) ? $blindmatrix_v4_parameters_data['chosen_tax_data']:'';
    $option_data  = json_encode($_option_data);
    $decoded_data = json_decode($chosen_tax_data);
    
    $production_material_cost_price                  = 0;
    $production_material_net_price                   = 0;
    $production_material_net_price_with_discount     = 0;
    $price_group_price                               = 0;
    $rules_data                                      = array();
    if('5' != $product_category_id){
        // Blinds with fabrics, slates, accessories
        $rules_data                                  = blindmatrix_get_rules_data();
	    $rules_response                              = CallAPI_v4("POST",'orderitems/calculate/rules/',json_encode($rules_data),true);
	    $production_material_cost_price              = isset($rules_response->productionmaterialcostprice) ? $rules_response->productionmaterialcostprice:0;
        $production_material_net_price               = isset($rules_response->productionmaterialnetprice) ? $rules_response->productionmaterialnetprice:0;
        $production_material_net_price_with_discount = isset($rules_response->productionmaterialnetpricewithdiscount) ? $rules_response->productionmaterialnetpricewithdiscount:0;
        $price_group_price                           = isset($rules_response->getpricegroupprice) ? $rules_response->getpricegroupprice:0;
    }
    
    $matched_rule_data            = array();  
	if('1' == $rules_cost_price_comes_from && isset($form_data['blindmatrix_v4_parameters_data']['list_changed']) && 1 == $form_data['blindmatrix_v4_parameters_data']['list_changed']){
	    $rules_data                   = blindmatrix_get_rules_data(0);    
    	$rules_response               = CallAPI_v4("POST",'orderitems/calculate/rules/',json_encode($rules_data),true);
        $rules_response_arr           = isset($rules_response->ruleresults) ? (array)$rules_response->ruleresults:array();
        
        foreach ((array) $rules_response_arr as $rule_data_obj) {
            $rule_data_array = (array) $rule_data_obj;
        
            $field_id = key($rule_data_array);  
            $field_items = $rule_data_array[$field_id];     
        
            $first_item = $field_items[0] ?? null;
        
            if (isset($first_item->optionvalue) && $first_item->optionvalue !== '') {
                $matched_rule_data[$field_id] = $first_item->optionvalue;
            }
        }
	}
    
	if('5' == $product_category_id){
	  // Shutters Params
	 $data = '{
        "blindopeningwidth": [],
        "productid": '.$product_id.',
        "supplierid": '.$supplier_id.',
        "mode": "",
        "width": '.$width.',
        "drop": '.$drop.',
        "pricegroup": "",
        "customertype": 4,
        "optiondata": '.$option_data.',
        "unittype": '.$unittype.',
        "orderitemqty": 1,
        "jobid": null,
        "overridetype": 1,
        "overrideprice": "",
        "overridevalue": null,
        "vatpercentage": "'.$vat_percentage.'",
        "costpriceoverride": 0,
        "costpriceoverrideprice": 0,
        "orderitemcostprice": 0,
        "productionmaterialcostprice": 0,
        "productionmaterialnetprice": 0,
        "productionmaterialnetpricewithdiscount": 0,
        "overridepricevalue": 0,
        "getpricegroupprice": 0,
        "rulescostpricecomesfrom": '.$rules_cost_price_comes_from.',
        "rulesnetpricecomesfrom": '.$rules_net_price_comes_from.',
        "fabricfieldtype": 21,
        "widthfieldtypeid": '.$widthfraction_id.',
        "dropfieldtypeid": '.$dropfraction_id.',
        "colorid": '.$colorid.',
        "priceapicount": 0,
        "reportpriceresults": [],
        "fabricid": '.$fabricid.',
        "orderid": "",
        "customerid": "",
        "fabriciddual": "",
        "coloriddual": "",
        "subfabricid": "",
        "subcolorid": "",
        "pricegroupdual": ""
    	}';
	}else if(2 == $product_category_id){
	        $unittype                                    = !empty($unittype) ? $unittype:'2';
	        // Acessories Params
	        $data = '{
                "blindopeningwidth": [],
                "productid": '.$product_id.',
                "supplierid": '.$supplier_id.',
                "mode": "pricetableprice",
                "width": "",
                "drop": "",
                "pricegroup": "",
                "customertype": 4,
                "optiondata": '.$option_data.',
                "unittype": '.$unittype.',
                "orderitemqty": 1,
                "jobid": null,
                "overridetype": 1,
                "overrideprice": "",
                "overridevalue": null,
                "vatpercentage": "'.$vat_percentage.'",
                "costpriceoverride": 0,
                "costpriceoverrideprice": 0,
                "orderitemcostprice": 0,
                "productionmaterialcostprice": 0,
                "overridepricevalue": 0,
                "getpricegroupprice": 0,
                "productionmaterialcostprice": "'.$production_material_cost_price.'",
                "productionmaterialnetprice" : "'.$production_material_net_price.'",
                "productionmaterialnetpricewithdiscount" : "'.$production_material_net_price_with_discount.'",
                "rulescostpricecomesfrom": '.$rules_cost_price_comes_from.',
                "rulesnetpricecomesfrom": '.$rules_net_price_comes_from.',
                "fabricfieldtype": "",
                "widthfieldtypeid": "",
                "dropfieldtypeid": "",
                "colorid": "",
                "priceapicount": 0,
                "reportpriceresults": [],
                "fabricid": "",
                "orderid": "",
                "customerid": "",
                "fabriciddual": "",
                "coloriddual": "",
                "subfabricid": "",
                "subcolorid": "",
                "pricegroupdual": ""
            	}';
	}else{
	  // Blinds Params
	  $data = '{
        "blindopeningwidth": [],
        "productid": '.$product_id.',
        "supplierid": '.$supplier_id.',
        "mode": "pricetableprice",
        "width": '.$width.',
        "drop": '.$drop.',
        "pricegroup": ["'.$product_type.'"],
        "customertype": 4,
        "optiondata": '.$option_data.',
        "unittype": '.$unittype.',
        "orderitemqty": 1,
        "jobid": null,
        "overridetype": 1,
        "overrideprice": "",
        "overridevalue": null,
        "vatpercentage": "'.$vat_percentage.'",
        "costpriceoverride": 0,
        "costpriceoverrideprice": 0,
        "orderitemcostprice": '.$production_material_cost_price.',
        "productionmaterialcostprice": '.$production_material_cost_price.',
        "productionmaterialnetprice" : '.$production_material_net_price.',
        "productionmaterialnetpricewithdiscount" : '.$production_material_net_price_with_discount.',
        "overridepricevalue": 0,
        "getpricegroupprice": '.$price_group_price.',
        "rulescostpricecomesfrom": '.$rules_cost_price_comes_from.',
        "rulesnetpricecomesfrom": '.$rules_net_price_comes_from.',
        "fabricfieldtype": 5,
        "widthfieldtypeid": 11,
        "dropfieldtypeid": 12,
        "colorid": '.$colorid.',
        "priceapicount": 0,
        "reportpriceresults": [],
        "fabricid": '.$fabricid.',
        "orderid": "",
        "customerid": "",
        "fabriciddual": "",
        "coloriddual": "",
        "subfabricid": "",
        "subcolorid": "",
        "pricegroupdual": ""
    	}';
	}

    $price_response = CallAPI_v4("POST",'orderitems/calculate/option/price/',$data,true);
	$price_arr = [];
    $price_arr['finalcostprice']    = $price_response->finalcostprice;
    $price_arr['finalnetprice']     = $price_response->finalnetprice;
    $price_arr['fullpriceobject']   = $price_response->fullpriceobject;

    if("incl" == get_option('blindmatrix_vat_type') && !empty($vat_percentage)){
        $price_arr['price_html']= wc_price($price_response->fullpriceobject->grossprice)." (Incl. of ".$decoded_data->tax_displayname.")";
    }else if(!empty($vat_percentage)){
        $price_arr['price_html']= wc_price($price_response->fullpriceobject->netprice)." (Excl. of ".$decoded_data->tax_displayname.")";
    }else{
		$price_arr['price_html']= wc_price($price_response->fullpriceobject->netprice);
	}
    $price_arr['success'] ='true';
    $price_arr['matched_rule_data'] = $matched_rule_data; 
    echo wp_json_encode($price_arr);
    exit;
}

function blindmatrix_get_rules_data($rule_mode = 1){
    $form_data                      = isset($_POST["form_data"]) ? wp_parse_args($_POST["form_data"]):array();
    $blindmatrix_v4_parameters_data = isset($form_data["blindmatrix_v4_parameters_data"]) ? $form_data["blindmatrix_v4_parameters_data"]:array();
    $product_id                     = !empty($blindmatrix_v4_parameters_data['product_id']) ? $blindmatrix_v4_parameters_data['product_id']:0;
    $recipeid                       = !empty($blindmatrix_v4_parameters_data['recipeid']) ? $blindmatrix_v4_parameters_data['recipeid']:0;
    $supplier_id                    = !empty($blindmatrix_v4_parameters_data['supplier_id']) ? $blindmatrix_v4_parameters_data['supplier_id']:0;
    $rules_cost_price_comes_from    = !empty($blindmatrix_v4_parameters_data['rules_cost_price_comes_from']) ? $blindmatrix_v4_parameters_data['rules_cost_price_comes_from']:0;
    $rules_net_price_comes_from     = !empty($blindmatrix_v4_parameters_data['rules_net_price_comes_from']) ? $blindmatrix_v4_parameters_data['rules_net_price_comes_from']:0;
    $supplier_id                    = !empty($blindmatrix_v4_parameters_data['supplier_id']) ? $blindmatrix_v4_parameters_data['supplier_id']:0;
    $pricing_group_name             = !empty($blindmatrix_v4_parameters_data['pricing_group_type']) ? $blindmatrix_v4_parameters_data['pricing_group_type']:'';
    $pricing_group_id               = !empty($blindmatrix_v4_parameters_data['product_type']) ? $blindmatrix_v4_parameters_data['product_type']:"";
    $item_quantity                  = !empty($blindmatrix_v4_parameters_data["qty"]) ? $blindmatrix_v4_parameters_data["qty"]:'1';
    $rules_cost_price_comes_from    = isset($blindmatrix_v4_parameters_data['rules_cost_price_comes_from']) ? $blindmatrix_v4_parameters_data['rules_cost_price_comes_from']:'';
    $rules_net_price_comes_from     = isset($blindmatrix_v4_parameters_data['rules_net_price_comes_from']) ? $blindmatrix_v4_parameters_data['rules_net_price_comes_from']:'';

    $option_data                    = array();
    $order_item_data                = array();
    
    // Product Type Data
    $product_type_data    = isset($blindmatrix_v4_parameters_data[13]) ? $blindmatrix_v4_parameters_data[13]:array();
    if(!empty($product_type_data)){
        foreach($product_type_data as $product_type_id => $product_type_value){
            $field_data            = !empty($product_type_value['field_data']) && !is_array($product_type_value['field_data']) ? json_decode($product_type_value['field_data'],true):array();
            $selected_option_index = !empty($pricing_group_id) && !empty($field_data['optionsvalue']) ?  array_search($pricing_group_id,array_column($field_data['optionsvalue'], 'optionid')):'';
			$selected_option_data  = !empty($field_data['optionsvalue'][$selected_option_index]) ? $field_data['optionsvalue'][$selected_option_index]:array();
            
            $option_data[] = array(
                "optionvalue" => absint($pricing_group_id),
                "fieldtypeid" => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                'optionqty'   => 1,
                "fieldid"     => absint($field_data['fieldid'])
            );
            
            $order_item_data[] = array(
                "id"                => $product_type_id,
                "labelname"         => !empty($product_type_value["label"]) ? $product_type_value["label"]:'',
                "value"             => !empty($selected_option_data['optionname']) ? $selected_option_data['optionname']:'',
                "valueid"           => !empty($selected_option_data['id']) ? strval($selected_option_data['id']):'',
                "quantity"          => "",
                "type"              => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                "optionid"          => strval($pricing_group_id),
                "fabricorcolor"     => !empty($field_data["fabricorcolor"]) ? $field_data["fabricorcolor"]:0,
                "labelnamecode"     => !empty($field_data["labelnamecode"]) ? $field_data["labelnamecode"]:'',
                "issubfabric"       => !empty($field_data["issubfabric"]) ? $field_data["issubfabric"]:0,
                "fractionValue"     => 0,
                "editruleoverride"  =>!empty($field_data["editruleoverride"]) ? $field_data["editruleoverride"]:0,
            );
        }
    }
    
    // Unit Type
    $unittype             = isset($blindmatrix_v4_parameters_data['unittype']) ? $blindmatrix_v4_parameters_data['unittype']:'2';
    $unit_type_data       = isset($blindmatrix_v4_parameters_data[34]) ? $blindmatrix_v4_parameters_data[34]:array();
    if(!empty($unit_type_data)){
        foreach($unit_type_data as $unit_type_id => $unit_type_value){
            $field_data                    = !empty($unit_type_value['field_data']) && !is_array($unit_type_value['field_data']) ? json_decode($unit_type_value['field_data'],true):array();
            $selected_option_index         = !empty($field_data['optionsvalue']) ? array_search($unittype,array_column($field_data['optionsvalue'], 'optionid')):'';
            $selected_option_data          = !empty($field_data['optionsvalue'][$selected_option_index]) ? $field_data['optionsvalue'][$selected_option_index]:array();
            if(empty($selected_option_data)){
                continue;
            }
            
            $option_data[] = array(
                "optionvalue" => absint($unittype),
                "fieldtypeid" => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                'optionqty'   => 1,
                "fieldid"     => absint($field_data['fieldid'])
            );

            $order_item_data[] = array(
                "id"                => $unit_type_id,
                "labelname"         => !empty($unit_type_value["label"]) ? $unit_type_value["label"]:'',
                "value"             => !empty($selected_option_data["optionname"]) ?$selected_option_data["optionname"]:0 ,
                "valueid"           => $unittype,
                "quantity"          => "",
                "type"              => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                "optionid"          => !empty($selected_option_data["optionid"]) ?$selected_option_data["optionid"]:0 ,
                "fabricorcolor"     => !empty($field_data["fabricorcolor"]) ? $field_data["fabricorcolor"]:0,
                "labelnamecode"     => !empty($field_data["labelnamecode"]) ? $field_data["labelnamecode"]:'',
                "issubfabric"       => !empty($field_data["issubfabric"]) ? $field_data["issubfabric"]:0,
                "fractionValue"     => 0,
                "editruleoverride"  =>!empty($field_data["editruleoverride"]) ? $field_data["editruleoverride"]:0,
            );
        }
    }
    
    // Quantity Data
    $quantity_data    = isset($blindmatrix_v4_parameters_data[14]) ? $blindmatrix_v4_parameters_data[14]:array();
    if(!empty($quantity_data)){
        foreach($quantity_data as $quantity_id => $quantity_value){
            $field_data    = !empty($quantity_value['field_data']) && !is_array($quantity_value['field_data']) ? json_decode($quantity_value['field_data'],true):array();

            $order_item_data[] = array(
                "id"                => $quantity_id,
                "labelname"         => !empty($quantity_value["label"]) ? $quantity_value["label"]:'',
                "value"             => $item_quantity ,
                "valueid"           => "",
                "quantity"          => "",
                "type"              => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                "optionid"          => "",
                "fabricorcolor"     => !empty($field_data["fabricorcolor"]) ? $field_data["fabricorcolor"]:0,
                "labelnamecode"     => !empty($field_data["labelnamecode"]) ? $field_data["labelnamecode"]:'',
                "issubfabric"       => !empty($field_data["issubfabric"]) ? $field_data["issubfabric"]:0,
                "fractionValue"     => 0,
                "editruleoverride"  =>!empty($field_data["editruleoverride"]) ? $field_data["editruleoverride"]:0,
            );
        }
    }
    
    // Supplier Data
    $supplier         = isset($blindmatrix_v4_parameters_data['supplier_id']) ? $blindmatrix_v4_parameters_data['supplier_id']:'';
    $supplier_data    = isset($blindmatrix_v4_parameters_data[17]) ? $blindmatrix_v4_parameters_data[17]:array();
    if(!empty($supplier_data)){
        foreach($supplier_data as $_supplier_id => $supplier_value){
            $field_data                    = !empty($supplier_value['field_data']) && !is_array($supplier_value['field_data']) ? json_decode($supplier_value['field_data'],true):array();
            $selected_option_index         = !empty($field_data['optionsvalue']) ? array_search($supplier,array_column($field_data['optionsvalue'], 'optionid')):'';
            $selected_option_data          = !empty($field_data['optionsvalue'][$selected_option_index]) ? $field_data['optionsvalue'][$selected_option_index]:array();
            if(empty($selected_option_data)){
                continue;
            }
            
            $option_data[] = array(
                "optionvalue" => absint($supplier),
                "fieldtypeid" => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                'optionqty'   => 1,
                "fieldid"     => absint($_supplier_id)
            );
            
            $order_item_data[] = array(
                "id"                => $_supplier_id,
                "labelname"         => !empty($supplier_value["label"]) ? $supplier_value["label"]:'',
                "value"             => !empty($selected_option_data["optionname"]) ?$selected_option_data["optionname"]:0 ,
                "valueid"           => $unittype,
                "quantity"          => "",
                "type"              => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                "optionid"          => !empty($selected_option_data["optionid"]) ? strval($selected_option_data["optionid"]):0 ,
                "fabricorcolor"     => !empty($field_data["fabricorcolor"]) ? $field_data["fabricorcolor"]:0,
                "labelnamecode"     => !empty($field_data["labelnamecode"]) ? $field_data["labelnamecode"]:'',
                "issubfabric"       =>  !empty($field_data["issubfabric"]) ? $field_data["issubfabric"]:0,
                "fractionValue"     => 0,
                "editruleoverride"  =>!empty($field_data["editruleoverride"]) ? $field_data["editruleoverride"]:0,
            );
        }
    }
    
    // Width Data
    $width_data  = isset($blindmatrix_v4_parameters_data[11]) ? $blindmatrix_v4_parameters_data[11]:array();
    $stored_width_value = "";
    if(!empty($width_data)){
        foreach($width_data as $width_id => $width_value){
            $field_data = !empty($width_value['field_data']) && !is_array($width_value['field_data']) ? json_decode($width_value['field_data'],true):array();
	        if(empty($field_data['fieldid'])){
			    continue;
			}
			
			if(!$stored_width_value){
			    $stored_width_value = !empty($width_value['value']) ? $width_value['value']:"";
			}
            
            $order_item_data[] = array(
                "id"                => $field_data['fieldid'],
                "labelname"         => !empty($field_data['fieldname']) ? $field_data['fieldname']:'',
                "value"             => !empty($width_value['value']) ? $width_value['value']:'',
                "valueid"           => "",
                "quantity"          => "",
                "type"              => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                "optionid"          => "",
                "fabricorcolor"     => !empty($field_data["fabricorcolor"]) ? $field_data["fabricorcolor"]:0,
                "labelnamecode"     => !empty($field_data["labelnamecode"]) ? $field_data["labelnamecode"]:'',
                "issubfabric"       => !empty($field_data["issubfabric"]) ? $field_data["issubfabric"]:0,
                "fractionValue"     => 0,
                "editruleoverride"  =>!empty($field_data["editruleoverride"]) ? $field_data["editruleoverride"]:1,
            );
        }
    }
    
    // Drop Data
    $drop_data         = isset($blindmatrix_v4_parameters_data[12]) ? $blindmatrix_v4_parameters_data[12]:array();
    $stored_drop_value = ""; 
    if(!empty($drop_data)){
        foreach($drop_data as $drop_id => $drop_value){
            $field_data = !empty($drop_value['field_data']) && !is_array($drop_value['field_data']) ? json_decode($drop_value['field_data'],true):array();
	        if(empty($field_data['fieldid'])){
			    continue;
			}
			
			if(!$stored_drop_value){
			    $stored_drop_value = !empty($drop_value['value']) ? $drop_value['value']:"";
			}
            
            $order_item_data[] = array(
                "id"                => $field_data['fieldid'],
                "labelname"         => !empty($field_data['fieldname']) ? $field_data['fieldname']:'',
                "value"             => !empty($drop_value['value']) ? $drop_value['value']:'',
                "valueid"           => "",
                "quantity"          => "",
                "type"              => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                "optionid"          => "",
                "fabricorcolor"     => !empty($field_data["fabricorcolor"]) ? $field_data["fabricorcolor"]:0,
                "labelnamecode"     => !empty($field_data["labelnamecode"]) ? $field_data["labelnamecode"]:'',
                "issubfabric"       => !empty($field_data["issubfabric"]) ? $field_data["issubfabric"]:0,
                "fractionValue"     => 0,
                "editruleoverride"  =>!empty($field_data["editruleoverride"]) ? $field_data["editruleoverride"]:1,
            );
        }
    }
    
    // Blinds with slates - color.
    $color_blinds_with_slates_data   = isset($blindmatrix_v4_parameters_data['20']) ? $blindmatrix_v4_parameters_data['20']:array();
    if(!empty($color_blinds_with_slates_data)){
        foreach($color_blinds_with_slates_data as $color_blinds_with_slates_id => $color_blinds_with_slates_value){
            $field_data = !empty($color_blinds_with_slates_value['field_data']) && !is_array($color_blinds_with_slates_value['field_data']) ? json_decode($color_blinds_with_slates_value['field_data'],true):array();
	        if(empty($field_data['fieldid'])){
			    continue;
			}
            
            $order_item_data[] = array(
                "id"                => $field_data['fieldid'],
                "labelname"         => !empty($field_data['fieldname']) ? $field_data['fieldname']:'',
                "value"             => "",
                "valueid"           => "",
                "quantity"          => "",
                "type"              => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                "optionid"          => "",
                "fabricorcolor"     => !empty($field_data["fabricorcolor"]) ? $field_data["fabricorcolor"]:'',
                "labelnamecode"     => !empty($field_data["labelnamecode"]) ? $field_data["labelnamecode"]:'',
                "issubfabric"       => !empty($field_data["issubfabric"]) ? $field_data["issubfabric"]:0,
                "fractionValue"     => 0,
                "editruleoverride"  =>!empty($field_data["editruleoverride"]) ? $field_data["editruleoverride"]:0,
            );
        }
    }
    
    // Text fields.
    $text_fields   = isset($blindmatrix_v4_parameters_data['18']) ? $blindmatrix_v4_parameters_data['18']:array();
    if(!empty($text_fields)){
        foreach($text_fields as $text_field_id => $text_field_value){
            $field_data = !empty($text_field_value['field_data']) && !is_array($text_field_value['field_data']) ? json_decode($text_field_value['field_data'],true):array();
	        if(empty($field_data['fieldid'])){
			    continue;
			}
            
            $order_item_data[] = array(
                "id"                => $field_data['fieldid'],
                "labelname"         => !empty($field_data['fieldname']) ? $field_data['fieldname']:'',
                "value"             => !empty($text_field_value['value']) ? $text_field_value['value']:'',
                "valueid"           => "",
                "quantity"          => "",
                "type"              => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                "optionid"          => "",
                "fabricorcolor"     => !empty($field_data["fabricorcolor"]) ? $field_data["fabricorcolor"]:0,
                "labelnamecode"     => !empty($field_data["labelnamecode"]) ? $field_data["labelnamecode"]:'',
                "issubfabric"       => !empty($field_data["issubfabric"]) ? $field_data["issubfabric"]:0,
                "fractionValue"     => 0,
                "editruleoverride"  =>!empty($field_data["editruleoverride"]) ? $field_data["editruleoverride"]:1,
            );
        }
    }
    
    // Number fields.
    $number_fields   = isset($blindmatrix_v4_parameters_data['6']) ? $blindmatrix_v4_parameters_data['6']:array();
    if(!empty($number_fields)){
        foreach($number_fields as $number_field_id => $number_field_value){
            $field_data = !empty($number_field_value['field_data']) && !is_array($number_field_value['field_data']) ? json_decode($number_field_value['field_data'],true):array();
	        if(empty($field_data['fieldid'])){
			    continue;
			}
            
            $order_item_data[] = array(
                "id"                => $field_data['fieldid'],
                "labelname"         => !empty($field_data['fieldname']) ? $field_data['fieldname']:'',
                "value"             => !empty($number_field_value['value']) ? $number_field_value['value']:'',
                "valueid"           => "",
                "quantity"          => "",
                "type"              => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                "optionid"          => "",
                "fabricorcolor"     => !empty($field_data["fabricorcolor"]) ? $field_data["fabricorcolor"]:0,
                "labelnamecode"     => !empty($field_data["labelnamecode"]) ? $field_data["labelnamecode"]:'',
                "issubfabric"       => !empty($field_data["issubfabric"]) ? $field_data["issubfabric"]:0,
                "fractionValue"     => 0,
                "editruleoverride"  =>!empty($field_data["editruleoverride"]) ? $field_data["editruleoverride"]:0,
            );
        }
    }
    
    // List Data
    $list_data                      = isset($blindmatrix_v4_parameters_data[3]) ? $blindmatrix_v4_parameters_data[3]:array();
    if(!empty($list_data)){
        foreach($list_data as $list_id => $list_value){
            $field_data          = !empty($list_value['field_data']) && !is_array($list_value['field_data']) ? json_decode($list_value['field_data'],true):array();
            $chosen_list_options = isset($list_value["chosen_options"]) ? $list_value["chosen_options"]:array();
            $level1_option_data  = !empty($list_value['option_data']) && !is_array($list_value['option_data']) ? json_decode($list_value['option_data'],true):array();
            $altered_level1_lists = array();
            // Level1 List
            if(!empty($chosen_list_options) && is_array($chosen_list_options)){
                foreach($chosen_list_options as $chosen_list_option){
                    if(!$chosen_list_option){
                        continue;
                    }
                    
				    $selected_option_index = !empty($level1_option_data) ?  array_search($chosen_list_option,array_column($level1_option_data, 'optionid')):'';
				    $selected_option_data  = !empty($level1_option_data[$selected_option_index]) ? $level1_option_data[$selected_option_index]:array();
                    $option_data[] = array(
                        "optionvalue" => absint($chosen_list_option),
                        "fieldtypeid" => 3,
                        'optionqty'   => !empty($selected_option_data["optionqty"]) ? absint($selected_option_data["optionqty"]):1,
                        "fieldid"     => $list_id
                    );
                    
                    if(isset($altered_level1_lists[$list_id])){
                        // Value ID
                        $assigned_level1_value_ids                  = !empty($altered_level1_lists[$list_id]['valueid']) && !is_array($altered_level1_lists[$list_id]['valueid']) ? explode(',',$altered_level1_lists[$list_id]['valueid']):array();
                        $level1_value_id                            = !empty($selected_option_data['fieldoptionlinkid']) ? $selected_option_data['fieldoptionlinkid']:0;
                        $altered_level1_lists[$list_id]['valueid']  = implode(',',array_unique(array_merge($assigned_level1_value_ids,array($level1_value_id))));
                                
                        // Option ID
                        $assigned_level1_option_ids                 = !empty($altered_level1_lists[$list_id]['optionid']) && !is_array($altered_level1_lists[$list_id]['optionid']) ? explode(',',$altered_level1_lists[$list_id]['optionid']):array();
                        $level1_options_id                          = !empty($selected_option_data['optionid']) ? $selected_option_data['optionid']:0;
                        $altered_level1_lists[$list_id]['optionid'] = implode(',',array_unique(array_merge($assigned_level1_option_ids,array($level1_options_id))));
                                
                        // Quantity
                        $assigned_level1_qty_ids                    = !empty($altered_level1_lists[$list_id]['quantity']) && !is_array($altered_level1_lists[$list_id]['quantity']) ? explode(',',$altered_level1_lists[$list_id]['quantity']):array();
                        $level1_qty_id                              = !empty($selected_option_data['optionqty']) ? $selected_option_data['optionqty']:1;
                        $altered_level1_lists[$list_id]['quantity'] = implode(',',array_merge($assigned_level1_qty_ids,array($level1_qty_id)));
                    }else{
                        $altered_level1_lists[$list_id] = array(
                            "id"                => $list_id,
                            "labelname"         => !empty($list_value["label"]) ? $list_value["label"]:'',
                            "value"             => !empty($list_value["value"]) ? $list_value["value"]:'',
                            "valueid"           => !empty($selected_option_data['fieldoptionlinkid']) ? strval($selected_option_data['fieldoptionlinkid']):0,
                            "quantity"          => !empty($selected_option_data["optionqty"]) ? $selected_option_data["optionqty"]:1,
                            "type"              => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                            "optionid"          => !empty($selected_option_data["optionid"]) ? strval($selected_option_data["optionid"]):0 ,
                            "fabricorcolor"     => !empty($field_data["fabricorcolor"]) ? $field_data["fabricorcolor"]:0,
                            "labelnamecode"     => !empty($field_data["labelnamecode"]) ? $field_data["labelnamecode"]:'',
                            "issubfabric"       => !empty($field_data["issubfabric"]) ? $field_data["issubfabric"]:0,
                            "fractionValue"     => 0,
                            "editruleoverride"  =>!empty($field_data["editruleoverride"]) ? $field_data["editruleoverride"]:0,
                        );
                    }
                }
            }else{
                $altered_level1_lists[$list_id] = array(
                    "id"                => $list_id,
                    "labelname"         => !empty($list_value["label"]) ? $list_value["label"]:'',
                    "value"             => "",
                    "valueid"           => "",
                    "quantity"          => "",
                    "type"              => !empty($field_data["fieldtypeid"]) ? $field_data["fieldtypeid"]:'',
                    "optionid"          => "",
                    "fabricorcolor"     => !empty($field_data["fabricorcolor"]) ? $field_data["fabricorcolor"]:0,
                    "labelnamecode"     => !empty($field_data["labelnamecode"]) ? $field_data["labelnamecode"]:'',
                    "issubfabric"       => !empty($field_data["issubfabric"]) ? $field_data["issubfabric"]:0,
                    "fractionValue"     => 0,
                    "editruleoverride"  =>!empty($field_data["editruleoverride"]) ? $field_data["editruleoverride"]:0,
                );
            }
            
            if(!empty($altered_level1_lists) && is_array($altered_level1_lists)){
                foreach($altered_level1_lists as $altered_level1_list){
                    $order_item_data[] =  $altered_level1_list;
                }
            }
            
            // Level2 List
            $altered_lists = array();
            $level2sub_data_arr = isset($list_value["level2sub"]) ? $list_value["level2sub"]:array();
            if(!empty($level2sub_data_arr) && is_array($level2sub_data_arr)){
                 foreach($level2sub_data_arr as $level2sub_id => $level2sub_val){
                     $level2_chosen_list_options = isset($level2sub_val["chosen_options"]) ? $level2sub_val["chosen_options"]:array();
                     $level2_field_data          = !empty($level2sub_val['field_data']) && !is_array($level2sub_val['field_data']) ? json_decode($level2sub_val['field_data'],true):array();
                     $level2_option_data         = !empty($level2sub_val['option_data']) && !is_array($level2sub_val['option_data']) ? json_decode($level2sub_val['option_data'],true):array();
                     if(!empty($level2_chosen_list_options) && is_array($level2_chosen_list_options)){
                        foreach($level2_chosen_list_options as $level2_chosen_list_option){
                            if(!$level2_chosen_list_option){
                                continue;
                            }
				            $level2_selected_option_index = !empty($level2_option_data) ?  array_search($level2_chosen_list_option,array_column($level2_option_data, 'optionid')):'';
				            $level2_selected_option_data  = !empty($level2_option_data[$level2_selected_option_index]) ? $level2_option_data[$level2_selected_option_index]:array();
                            
                            $option_data[] = array(
                                "optionvalue" => absint($level2_chosen_list_option),
                                "fieldtypeid" => 3,
                                'optionqty'   => !empty($level2_selected_option_data["optionqty"]) ? absint($level2_selected_option_data["optionqty"]):1,
                                "fieldid"     => $level2sub_id
                            );
                            
                            if(isset($altered_lists[$level2sub_id])){
                                // Value ID
                                $assigned_value_ids              = !empty($altered_lists[$level2sub_id]['valueid']) && !is_array($altered_lists[$level2sub_id]['valueid']) ? explode(',',$altered_lists[$level2sub_id]['valueid']):array();
                                $value_id                        = !empty($level2_selected_option_data['fieldoptionlinkid']) ? $level2_selected_option_data['fieldoptionlinkid']:0;
                                $altered_lists[$level2sub_id]['valueid']  = implode(',',array_unique(array_merge($assigned_value_ids,array($value_id))));
                                
                                // Option ID
                                $assigned_option_ids             = !empty($altered_lists[$level2sub_id]['optionid']) && !is_array($altered_lists[$level2sub_id]['optionid']) ? explode(',',$altered_lists[$level2sub_id]['optionid']):array();
                                $_options_id                     = !empty($level2_selected_option_data['optionid']) ? $level2_selected_option_data['optionid']:0;
                                $altered_lists[$level2sub_id]['optionid'] = implode(',',array_unique(array_merge($assigned_option_ids,array($_options_id))));
                                
                                // Quantity
                                $assigned_qty_ids                 = !empty($altered_lists[$level2sub_id]['quantity']) && !is_array($altered_lists[$level2sub_id]['quantity']) ? explode(',',$altered_lists[$level2sub_id]['quantity']):array();
                                $_qty_id                          = !empty($level2_selected_option_data['optionqty']) ? $level2_selected_option_data['optionqty']:1;
                                $altered_lists[$level2sub_id]['quantity']  = implode(',',array_merge($assigned_qty_ids,array($_qty_id)));
                            }else{
                                $altered_lists[$level2sub_id] = array(
                                    "id"                => $level2sub_id,
                                    "labelname"         => !empty($level2sub_val["label"]) ? $level2sub_val["label"]:'',
                                    "value"             => !empty($level2sub_val["value"]) ? $level2sub_val["value"]:'',
                                    "valueid"           => !empty($level2_selected_option_data['fieldoptionlinkid']) ? strval($level2_selected_option_data['fieldoptionlinkid']):0,
                                    "quantity"          => !empty($level2_selected_option_data["optionqty"]) ? $level2_selected_option_data["optionqty"]:1,
                                    "type"              => !empty($level2_field_data["fieldtypeid"]) ? $level2_field_data["fieldtypeid"]:'',
                                    "optionid"          => !empty($level2_selected_option_data["optionid"]) ? strval($level2_selected_option_data["optionid"]):0 ,
                                    "fabricorcolor"     => !empty($level2_field_data["fabricorcolor"]) ? $level2_field_data["fabricorcolor"]:0,
                                    "labelnamecode"     => !empty($level2_field_data["labelnamecode"]) ? $level2_field_data["labelnamecode"]:'',
                                    "issubfabric"       => !empty($level2_field_data["issubfabric"]) ? $level2_field_data["issubfabric"]:0,
                                    "fractionValue"     => 0,
                                    "editruleoverride"  =>!empty($level2_field_data["editruleoverride"]) ? $level2_field_data["editruleoverride"]:0,
                                );
                            }
                        }
                    }else{
                        $altered_lists[$level2sub_id] = array(
                            "id"                => $level2sub_id,
                            "labelname"         => !empty($level2sub_val["label"]) ? $level2sub_val["label"]:'',
                            "value"             => !empty($level2sub_val["value"]) ? $level2sub_val["value"]:'',
                            "valueid"           => "",
                            "quantity"          => "",
                            "type"              => !empty($level2_field_data["fieldtypeid"]) ? $level2_field_data["fieldtypeid"]:'',
                            "optionid"          => "",
                            "fabricorcolor"     => !empty($level2_field_data["fabricorcolor"]) ? $level2_field_data["fabricorcolor"]:0,
                            "labelnamecode"     => !empty($level2_field_data["labelnamecode"]) ? $level2_field_data["labelnamecode"]:'',
                            "issubfabric"       => !empty($level2_field_data["issubfabric"]) ? $level2_field_data["issubfabric"]:0,
                            "fractionValue"     => 0,
                            "editruleoverride"  =>!empty($level2_field_data["editruleoverride"]) ? $level2_field_data["editruleoverride"]:0,
                        );
                    }
                    
                    if(!empty($altered_lists) && is_array($altered_lists)){
                        foreach($altered_lists as $altered_list){
                            $order_item_data[] =  $altered_list;
                        }
                    }
                 }
            }
        }
    }

    return array(
                "blindopeningwidth" => array(),
                "recipeid"              => absint($product_id),
                "productid"             => absint($recipeid),
                "orderitemdata"         => $order_item_data,
                "supplierid"            => 51,
                "mode"                  => '2' == $rules_net_price_comes_from ? "pricetableprice" :"",
                "width"                 => $stored_width_value,
                "drop"                  => $stored_drop_value,
                "pricegroup"            => !empty($pricing_group_id) ? array("$pricing_group_id"):"",
                "pricegroupdual"        => "",
                "pricegroupmulticurtain"=> array(),
                "customertype"          => "4",
                "optiondata"            => $option_data,
                "unittype"              => absint($unittype),
                "orderitemqty"          => !empty($item_quantity) ? absint($item_quantity):1,
                "jobid"                 => null,
                "customerid"            => "",
                "rulemode"              => $rule_mode,
                "productionoveridedata" => array(),
                "widthfieldtypeid"      => 11,
                "dropfieldtypeid"       => 12,
                "overridetype"          => 1,
                "overrideprice"         => "",
                "fabricid"              => "",
                "fabriciddual"          => "",
                "colorid"               => "",
                "coloriddual"           => "",
                "subfabricid"           => "",
                "subcolorid"            => "",
                "fabricmulticurtain"    => array(),
                "colormulticurtain"     => array()
    );
}
/**
 *
 * single product add to cart funtion
 * 
 * 
 */
add_action( 'wp_ajax_nopriv_add_to_cart', 'add_to_cart' );
add_action( 'wp_ajax_add_to_cart', 'add_to_cart' );
function add_to_cart(){
    $form_data = isset($_POST['form_data']) ? $_POST['form_data']:array();
    $form_data = wp_parse_args($form_data);
    $blindmatrix_v4_parameters_data = isset($form_data['blindmatrix_v4_parameters_data']) ? $form_data['blindmatrix_v4_parameters_data']:array();
    if(!is_array($blindmatrix_v4_parameters_data) || empty($blindmatrix_v4_parameters_data)){
        return;
    }    
	$shutter_img_html = $_POST['shutter_img_html'] ;

	$cart_item_data['new_product_image_path'] = '';
	$blindmatrix_v4_parameters_data['image_id'] = blindmatrix_v4_set_uploaded_image_as_attachment($blindmatrix_v4_parameters_data['fabric_img_url']);
	$product_id  = blindmatrix_v4_product_id();
	$quantity    = isset($blindmatrix_v4_parameters_data['qty']) ? $blindmatrix_v4_parameters_data['qty']:'';
	$html = [];  
	$passed_validation = apply_filters('woocommerce_add_to_cart_validation',true, $product_id, 1);
	$old_cart_item_key = !empty($blindmatrix_v4_parameters_data['stored_cart_item_key']) ? $blindmatrix_v4_parameters_data['stored_cart_item_key']:'';
	if('' != $old_cart_item_key){
	    WC()->cart->remove_cart_item($old_cart_item_key);
	}
    if($passed_validation && WC()->cart->add_to_cart( $product_id, $quantity,0,array(),array('blindmatrix_v4_parameters_data'=> $blindmatrix_v4_parameters_data,'old_cart_item_key' => $old_cart_item_key)) ){
        $html['success'] ='true';
        $html['cartitem'] ='product added';
    }else{
        $html['success'] ='false';
        $html['error'] = 'Since normal product is already added in the cart and hence blinds product cannot be added.';
        $html['cartitem'] ='';
    }
    
    $html['cart_count'] = WC()->cart->get_cart_contents_count();
    echo wp_json_encode($html);
    exit;
}
/**
 *
 * update single product details on cart
 * 
 * 
 */
add_action('woocommerce_before_calculate_totals', 'update_cart_data');
function update_cart_data($cart) {
    if (is_admin() && !defined('DOING_AJAX')) {
        return;
    }
    // Loop through cart items
    foreach( $cart->get_cart() as $cart_item_key => $cart_value ) {		
        if(!isset($cart_value['blindmatrix_v4_parameters_data'])){
            continue;
        }
        $blindmatrix_v4_parameters_data = isset($cart_value['blindmatrix_v4_parameters_data']) ? $cart_value['blindmatrix_v4_parameters_data']:array();
		$free_sample_data               = isset($blindmatrix_v4_parameters_data["free_sample_data"]) ? $blindmatrix_v4_parameters_data["free_sample_data"]:array();
		$type            		        = isset($free_sample_data["type"]) ? $free_sample_data["type"]:'';
		$free_sample_price            	= isset($free_sample_data["free_sample_price"]) ? $free_sample_data["free_sample_price"]:'';
		if('free_sample' == $type){
		    $cart_value['data']->set_price($free_sample_price);
			if( isset( $blindmatrix_v4_parameters_data['free_sample_data']['product_with_fabric_and_color'] ) ) {
            	$name = $blindmatrix_v4_parameters_data['free_sample_data']['product_with_fabric_and_color'];
            	$cart_value['data']->set_name($name);				
       	 	}
		}else{
		    if(!empty($blindmatrix_v4_parameters_data['type']) && 'quote_link' == $blindmatrix_v4_parameters_data['type']){
		        if( isset( $blindmatrix_v4_parameters_data['grossprice'] ) ) {	
		           $_cart_item_keys[] = $cart_item_key; 
                   $price = isset($blindmatrix_v4_parameters_data['grossprice']) ?$blindmatrix_v4_parameters_data['grossprice']:'';
                   $cart_value['data']->set_price($price);
                }
		    }else{
		        if("incl" == get_option('blindmatrix_vat_type')){
                    if( isset( $blindmatrix_v4_parameters_data['grossprice'] ) ) {				
                        $price = $blindmatrix_v4_parameters_data['grossprice'];
                        $cart_value['data']->set_price($price);
                    }
                }else{
                    if( isset( $blindmatrix_v4_parameters_data['netprice'] ) ) {				
                        $price = $blindmatrix_v4_parameters_data['netprice'];
                        $cart_value['data']->set_price($price);
                    }
                }
		    }
		    if( isset( $blindmatrix_v4_parameters_data['overallproductname'] ) ) {
                $name = $blindmatrix_v4_parameters_data['overallproductname'];
                $cart_value['data']->set_name($name);				
            }
		}
        if( !empty( $blindmatrix_v4_parameters_data['image_id'] ) ) {
            $cart_value['data']->set_image_id($blindmatrix_v4_parameters_data['image_id']);				
        }
        $cart_value['data']->set_weight( 100 );
    }
}
add_filter('woocommerce_get_item_data', function($item_data, $cart_item){
    $parameters = blindmatrixv4_get_item_data($cart_item);
	if(!empty($parameters) && is_array($parameters)){ 
      foreach($parameters as $parameter){
        if('' == trim($parameter['value']) || '-' == $parameter['value']){
            continue;
        }
        $item_data[] = array(
		    'key'   => $parameter['key'],
		    'value' => $parameter['value']
		);
      } 
	}
    return $item_data;
}, 999, 2 );	
function blindmatrixv4_get_quote_link_item_data($blindmatrix_v4_parameters_data){
    $parameters = array();
    $unit_type_arr  = isset($blindmatrix_v4_parameters_data[34])? $blindmatrix_v4_parameters_data[34]:array();
    $quantity_arr  = isset($blindmatrix_v4_parameters_data[14])? $blindmatrix_v4_parameters_data[14]:array();
    $text_field_arr  = isset($blindmatrix_v4_parameters_data[18])? $blindmatrix_v4_parameters_data[18]:array();
    if(!empty($unit_type_arr) && is_array($unit_type_arr)){
        $parameters = array_merge($parameters,$unit_type_arr);
    }
    if(!empty($quantity_arr) && is_array($quantity_arr)){
        $parameters = array_merge($parameters,$quantity_arr);
    }
    if(!empty($text_field_arr) && is_array($text_field_arr)){
        $parameters = array_merge($parameters,$text_field_arr);
    }
    return $parameters;
}
function blindmatrixv4_get_item_data($cart_item){
	$blindmatrix_v4_parameters_data = isset($cart_item['blindmatrix_v4_parameters_data']) ? $cart_item['blindmatrix_v4_parameters_data']:array();
    if(empty($blindmatrix_v4_parameters_data) || !is_array($blindmatrix_v4_parameters_data)){
        return $item_data;
    }
    if(!empty($blindmatrix_v4_parameters_data['type']) && 'quote_link' == $blindmatrix_v4_parameters_data['type']){
        return blindmatrixv4_get_quote_link_item_data($blindmatrix_v4_parameters_data);
    }
    $parameters = array();
    // Unit Type
    $unit_type   = isset($blindmatrix_v4_parameters_data['unit'])? $blindmatrix_v4_parameters_data['unit']:'';
    // Width
    $width_data  = isset($blindmatrix_v4_parameters_data[11])? array_values($blindmatrix_v4_parameters_data[11]):'';
	if('5' == $blindmatrix_v4_parameters_data['category']){
		$widthfraction_id = isset($blindmatrix_v4_parameters_data['widthfraction']) ? $blindmatrix_v4_parameters_data['widthfraction']:'';
		$width_data  = isset($blindmatrix_v4_parameters_data[$widthfraction_id])? array_values($blindmatrix_v4_parameters_data[$widthfraction_id]):'-';
	}
	
	$width_value = isset($width_data[0]['value']) ? $width_data[0]['value'].' '.$unit_type:'-';
	if(!empty($blindmatrix_v4_parameters_data['widthfraction_val']) && '4' == $blindmatrix_v4_parameters_data['unittype'] && isset($width_data[0]['value'])){
	    $width_value = $width_data[0]['value'].' '.$blindmatrix_v4_parameters_data['widthfraction_val'].' '.$unit_type;
	}
	
    $parameters[] = array(
        'key'   => isset($width_data[0]['label']) ? $width_data[0]['label']:'-',     
        'value' => $width_value
    );
    // Drop
    $drop_data  = isset($blindmatrix_v4_parameters_data[12])? array_values($blindmatrix_v4_parameters_data[12]):'';
	if('5' == $blindmatrix_v4_parameters_data['category']){
		$dropfraction_id  = isset($blindmatrix_v4_parameters_data['dropfraction']) ? $blindmatrix_v4_parameters_data['dropfraction']:'';
		$drop_data  = isset($blindmatrix_v4_parameters_data[$dropfraction_id])? array_values($blindmatrix_v4_parameters_data[$dropfraction_id]):'-';
	}
	
	$drop_value = isset($drop_data[0]['value']) ? $drop_data[0]['value'].' '.$unit_type:'-';
	if(!empty($blindmatrix_v4_parameters_data['dropfraction_val']) && '4' == $blindmatrix_v4_parameters_data['unittype'] && isset($drop_data[0]['value'])){
	    $drop_value = $drop_data[0]['value'].' '.$blindmatrix_v4_parameters_data['dropfraction_val'].' '.$unit_type;
	}
	
    $parameters[] = array(
        'key'   => isset($drop_data[0]['label']) ? $drop_data[0]['label']:'-',     
        'value' => $drop_value
    );
    // Text
    $text_values  = isset($blindmatrix_v4_parameters_data[18])? array_values($blindmatrix_v4_parameters_data[18]):'';
    if(!empty($text_values) && is_array($text_values)){
		$text_data = $text_values;
		$overall_text_data = array();
		foreach($text_values as $key => $value){
			$level2sub = isset($value['level2sub']) ? array_values($value['level2sub']):array();
			if(!empty($level2sub) && is_array($level2sub)){
				$overall_text_data = array_merge($text_data,$level2sub);
			}
		}
		
		if(empty($overall_text_data)){
			$overall_text_data = $text_data;
		}
		
        foreach($overall_text_data as $key => $value){
			if(!isset($value['label']) || !isset($value['value'])){
				continue;
			}
            $parameters[] = array(
                'key'   => isset($value['label']) ? $value['label']:'-',     
                'value' => isset($value['value']) ? $value['value']:'-'
             );
         }
    }

	 $number_values  = isset($blindmatrix_v4_parameters_data[6])? array_values($blindmatrix_v4_parameters_data[6]):'';
	 if(!empty($number_values) && is_array($number_values)){
		$numbers_data = $number_values;
		 $overall_numbers_data = array();
		foreach($numbers_data as $key => $value){
			$level2sub = isset($value['level2sub']) ? array_values($value['level2sub']):array();
			if(!empty($level2sub) && is_array($level2sub)){
				$overall_numbers_data = array_merge($numbers_data,$level2sub);
			}
		}
		 
		if(empty($overall_numbers_data)){
			$overall_numbers_data = $numbers_data;
		}
		 
		foreach($overall_numbers_data as $key => $value){
			if(!isset($value['label']) || !isset($value['value'])){
				continue;
			}
            $parameters[] = array(
                'key'   => isset($value['label']) ? $value['label']:'-',     
                'value' => isset($value['value']) ? $value['value']:'-'
             );
         }
	 }
    // Component & Drop down
    $stored_list_values  = isset($blindmatrix_v4_parameters_data[3])? array_values($blindmatrix_v4_parameters_data[3]):'';
	$list_data = $stored_list_values;
	$overall_list_data = $stored_list_values;
	 if(!empty($stored_list_values) && is_array($stored_list_values)){	
        foreach($stored_list_values as $key => $value){
			$level2sub = isset($value['level2sub']) ? array_values($value['level2sub']):array();
			if(!empty($level2sub) && is_array($level2sub)){
				$overall_list_data = array_merge($list_data,$level2sub);
			}
		}
	 }
    if(!empty($overall_list_data) && is_array($overall_list_data)){
        foreach($overall_list_data as $key => $value){
			if(!$value['label'] || !$value['value']){
				continue;
			}
            $parameters[] = array(
                'key'   => isset($value['label']) ? $value['label']:'-',     
                'value' => isset($value['value']) ? $value['value']:'-'
             );			
         }
    }	
    if(!empty($blindmatrix_v4_parameters_data['product_type']) && 'Free Sample' == $blindmatrix_v4_parameters_data['product_type']){
        $parameters[] = array(
           'key'   => 'Type',     
           'value' => 'Free Sample'
        );		
    }
	return $parameters;
}
//extra form field on checkout page
add_filter( 'woocommerce_billing_fields', 'blindmatrixv4_add_custom_checkout_field' );
function blindmatrixv4_add_custom_checkout_field( $fields ) {
    $fields['billing_company'] = array(
        'label'         => __('Company', 'woocommerce'), // Add your field label here
        'placeholder'   => _x('Company', 'placeholder', 'woocommerce'), // Add your placeholder here
        'required'      => true, // if field is required or not
        'class'         => array('form-row-wide'),
        'clear'         => true,
        'priority'      => 2
     );
     return $fields;
}
add_action('woocommerce_checkout_create_order_line_item', function($item, $cart_item_key, $values, $order){
	$parameters = blindmatrixv4_get_item_data($values);
	if(!empty($parameters) && is_array($parameters)){ 
      foreach($parameters as $parameter){
        if('' == $parameter['value'] || '-' == $parameter['value']){
            continue;
        }
		$item->update_meta_data( $parameter['key'], $parameter['value'] );  
      } 
	  $item->save();	
	}
}, 999, 4);
add_action( 'woocommerce_add_order_item_meta',function($item_id, $values){
    $blindmatrix_v4_parameters_data = isset($values['blindmatrix_v4_parameters_data']) ? $values['blindmatrix_v4_parameters_data']:array();
    if(!empty($blindmatrix_v4_parameters_data) || is_array($blindmatrix_v4_parameters_data)){
        wc_add_order_item_meta( $item_id, 'blindmatrix_v4_parameters_data', $blindmatrix_v4_parameters_data );	
    }
}, 10, 2);
add_action("woocommerce_cart_calculate_fees",function($cart){
	if ( is_admin() && ! defined( 'DOING_AJAX' ) ){
		return;
	}	
    $bm_vat_total = 0;
    $displayed_tax = '';
    $declared_tax = ''; 
	$line_net_price = 0;
	$net_price = 0;
    foreach($cart->cart_contents as $cart_item){
        if(is_array($cart_item['blindmatrix_v4_parameters_data']) && !empty($cart_item['blindmatrix_v4_parameters_data']) && isset($cart_item['blindmatrix_v4_parameters_data']['chosen_tax_data']) && isset($cart_item['blindmatrix_v4_parameters_data']['vat_percentage'])){
            $displayed_tax = isset($cart_item['blindmatrix_v4_parameters_data']['chosen_tax_data']) ?  json_decode( $cart_item['blindmatrix_v4_parameters_data']['chosen_tax_data'])->tax_displayname:'';
            $declared_tax = isset($cart_item['blindmatrix_v4_parameters_data']['vat_percentage']) ? $cart_item['blindmatrix_v4_parameters_data']['vat_percentage']:'';
            $cart_qty = isset($cart_item['quantity']) ? $cart_item['quantity']:'';
            $bm_vat_total += $cart_item['blindmatrix_v4_parameters_data']['vatprice'] *$cart_qty;
			$net_price += !empty($cart_item['blindmatrix_v4_parameters_data']["netprice"]) ? $cart_item['blindmatrix_v4_parameters_data']["netprice"]*$cart_qty:0;
			$line_net_price += !empty($cart_item['blindmatrix_v4_parameters_data']["costprice"]) ? $cart_item['blindmatrix_v4_parameters_data']["costprice"]*$cart_qty:0;
        } 
    }
	$discount = $cart->get_discount_total();
	$subtotal = $cart->get_subtotal();
	if(!empty($discount)){
		$data = '{"jobid":"null",
"overridetype":5,
"overridevalue":"'.$discount.'",
"listnetprice":"'.$net_price.'",
"netprice":"'.$net_price.'",
"zipcode":"",
"organisation":25,
"mode":"",
"customertype":"4",
"commissionvalues":"[]",
"customerid":null,
"is_round_gross_price":"",
"is_vat_enable":1}';
		
		$price_response = CallAPI_v4("POST",'job/get/override/vatprice',$data,true);
		$bm_vat_total = !empty($price_response->data->vat) ? floatval($price_response->data->vat):0;
	}
    if("excl" == get_option('blindmatrix_vat_type') && $bm_vat_total>0 ){
    WC()->cart->add_fee( $displayed_tax." - ".floatval($declared_tax)."%",  $bm_vat_total);            
    }
});
/**
 * fabric color ajax search result.
 * 
 * @return json
 */
 add_action( 'wp_ajax_ajax_search_products_v4', 'ajax_search_products_v4', 1 );
add_action( 'wp_ajax_nopriv_ajax_search_products_v4', 'ajax_search_products_v4', 1 );
function ajax_search_products_v4(){
		global $v4_product_visualizer_page;
		global $fabric_image_file_path;
		$searchtext = $_POST['query'];	
        //    $Ecomfabiclistarr = blindmatrix_v4_all_fabric_color_products_for_search();
// 			if($searchtext != ''){
// 			  $Searchlist = array_filter($Ecomfabiclistarr, function($item) use ($searchtext) {
// 				return (isset($item['pei_productname']) && stripos($item['pei_productname'], $searchtext) !== false) ||
// 					   (isset($item['fabricname']) && stripos($item['fabricname'], $searchtext) !== false) ||
// 					   (isset($item['colorname']) && stripos($item['colorname'], $searchtext) !== false);
// 			  });
// 			}
// 			$searchlist = array_slice($Searchlist,0,10);
			
			$searchlist = CallAPI_v4("POST",'productsearch',json_encode(array('productsearch' => $searchtext)));
            $searchlist  = json_decode(json_encode($searchlist->result), true);
            
	/* 	$mode ="searchproduct";
		$data=array('searchtext'=>$_POST['query'],'product_data'=>$groupedByCategory);
		$response = CallAPI_v4("POST",$mode,json_encode($data)); */
		$fabric_list_array = $searchlist;
		$product = array();
        $products_not_found = true;
        $return = array();
		if(is_array($fabric_list_array) && count($fabric_list_array) > 0){
			foreach($fabric_list_array as $key=>$searchval){	
				$productname = $searchval['productname'];
				$productname_slug =str_replace(" ","-",strtolower($productname));
				if($searchval['category'] == 3){
					$categoryname = "blinds-with-fabric";
					$fabriccolorname = $searchval['fabricname']." ".$searchval['colorname'];
					$fabricname_slug =str_replace(" ","-",strtolower($fabriccolorname));
					$fabricid = $searchval['fd_id'];
					$color_id = $searchval['cd_id'];
					$groupid = $searchval['groupid'];
					$supplierid = $searchval['supplierid'];
					$mapid = $searchval['matmapid'];
					$productviewurl = get_bloginfo('url').'/'.$v4_product_visualizer_page.'/'.$categoryname.'/'.$productname_slug.'/'.$fabricname_slug.'/'.$fabricid.'/'.$color_id.'/'.$mapid.'/'.$groupid.'/'.$supplierid;
				}elseif($searchval['category'] == 4){
					$categoryname = "blinds-with-slats";
					$fabriccolorname = $searchval['colorname'];
					$color_id = $searchval['cd_id'];
					$fabricid = 0;
					$groupid = $searchval['groupid'];
					$supplierid = $searchval['supplierid'];
					$mapid = $searchval['matmapid'];
					$fabricname_slug =str_replace(" ","-",strtolower($fabriccolorname));
					$productviewurl = get_bloginfo('url').'/'.$v4_product_visualizer_page.'/'.$categoryname.'/'.$productname_slug.'/'.$fabricname_slug.'/'.$fabricid.'/'.$color_id.'/'.$mapid.'/'.$groupid.'/'.$supplierid;				
				}
				if($searchval['colorimage'] != "" && strpos($searchval['colorimage'], ".") !== false ){
				// 	$product_image = $fabric_image_file_path.$searchval['colorimage'];
    //                 $product_image_url_check  = blindmatrix_v4_validate_upload_image_curl_request(esc_url_raw($product_image));
    //             if ( !$product_image_url_check ) {
    //                 $product_image = plugin_dir_url( __FILE__ ).'Shortcode-Source/images/no-image.jpg';
    //             }
                // $product_image = $searchval['fabric_and_color_image_url'];
                $product_image = $fabric_image_file_path.$searchval['colorimage'];
				$product['blind_'.$key]['name'] = $productname.' '.$fabriccolorname;
				$product['blind_'.$key]['url'] = $productviewurl;
				$product['blind_'.$key]['img'] = $product_image;
				$product['blind_'.$key]['price'] = $searchval['minprice'];
			}
		}
			$searcharrfilter = array_values($product);
		if(count($searcharrfilter) > 0){
			$searchresult=array();
			foreach($searcharrfilter as $keyss=>$searchval){
					$searchresult['type']   = 'Product';
					$searchresult['id'] 	= $keyss;
					$searchresult['value'] 	= $searchval['name'];
					$searchresult['url'] 	= $searchval['url'];
					$searchresult['img'] 	= $searchval['img'];
					$searchresult['price'] 	= wc_price($searchval['price']);
				$searchresultlist[] = $searchresult;
			}
			$return['suggestions'] = $searchresultlist;
            $products_not_found = false;
		}
    }
    if($products_not_found){
    $return['suggestions'] = array(
        [
            'id'    => -1,
            'value' => 'No products found.',
            'url'   => '',
            'img'   => '',
            'price' => ''
        ]
        );
    }
    echo wp_json_encode($return);
	exit;
}
/**
 * Set uploaded image as attachment.
 * 
 * @return int
 */
function blindmatrix_v4_set_uploaded_image_as_attachment( $url, $attachment_id = 0) {
	if (!blindmatrix_v4_validate_upload_image_curl_request($url)) {
		return 0;
	}
	$product_img_upload  = wc_rest_upload_image_from_url(esc_url_raw($url));
	if ( is_wp_error( $product_img_upload ) ) {
		return 0;
	}
	
	if ($attachment_id) {
		if (isset($product_img_upload['file'])) {
			$filename = $product_img_upload['file'];
			require_once(ABSPATH . 'wp-admin/includes/image.php');
			$attach_data = wp_generate_attachment_metadata($attachment_id, $filename);
			wp_update_attachment_metadata($attachment_id, $attach_data);
			update_attached_file($attachment_id, $product_img_upload['file']);
		}
	} else {
		$attachment_id = wc_rest_set_uploaded_image_as_attachment($product_img_upload);
	}
	return $attachment_id;
}
/**
 * Validate upload image cURL request.
 * 
 * @return bool
 */
function blindmatrix_v4_validate_upload_image_curl_request($url){
//   $product_img_upload  = wc_rest_upload_image_from_url(esc_url_raw($url));
//   if ( is_wp_error( $product_img_upload ) ) {
// 		return '';
//   }
   return $url;
}
add_filter('woocommerce_cart_item_quantity','alter_cart_item_quantity',999,3);
function alter_cart_item_quantity( $product_quantity, $cart_item_key, $cart_item){
    $pro_type     = isset($cart_item['blindmatrix_v4_parameters_data']['product_type']) ? $cart_item['blindmatrix_v4_parameters_data']['product_type']:'';
    $job_id       = isset($cart_item['blindmatrix_v4_parameters_data']['job_id']) ? $cart_item['blindmatrix_v4_parameters_data']['job_id']:'';
    if($pro_type == 'Free Sample'){
        $product_quantity = 1;
    }
    if($job_id){
        $product_quantity = 1;
    }
    return $product_quantity;
}
function blindmatrix_v4_get_free_sample_data($free_sample_args){
	extract($free_sample_args);
	$category_id            = isset($chosen_product_data['pi_category']) ? $chosen_product_data['pi_category']:'';
	$fabric_and_color_name  = !empty($fabric_and_color_arr['fabricname']) && !empty($fabric_and_color_arr['colorname']) ? ($fabric_and_color_arr['fabricname'].'-'.$fabric_and_color_arr['colorname']):'';
	if('4' == $category_id){
	    $fabric_and_color_name = !empty($fabric_and_color_arr['colorname']) ? $fabric_and_color_arr['colorname']:'';
	}
	$fabric_id              = !empty($fabric_and_color_arr['fd_id']) ? $fabric_and_color_arr['fd_id'] : $product_listing_value['fd_id'];
    $color_id               = !empty($fabric_and_color_arr['cd_id']) ? $fabric_and_color_arr['cd_id'] : 0;
	$_product_default_name  = isset($chosen_product_data['label']) ? $chosen_product_data['label']:'';
	if(!empty($parameters_arr) && is_array($parameters_arr)){
		  foreach($parameters_arr as $parameter){
		    $parameter               = (array)$parameter;
			$showFieldOnEcommerce    = isset($parameter['showfieldecomonjob'])? $parameter['showfieldecomonjob'] :'';
        	$field_type_id   		 = isset($parameter['fieldtypeid'])? $parameter['fieldtypeid'] :'';
        	$field_name      		 = isset($parameter['fieldname'])? $parameter['fieldname'] :'';
        	$field_id        		 = isset($parameter['fieldid'])? $parameter['fieldid'] :'';
			$default_option  		 = isset($parameter['optiondefault'])?$parameter['optiondefault']:'';
        	$multiple         		 = isset($parameter['selection']) ? ($parameter['selection'] == 1 ? true : false) : '';
        	$mandatory        		 = isset($parameter['mandatory'])? $parameter['mandatory'] :'';
        	$mandatory               = '1' == $mandatory ? 'on':'off';
        	$field_type_name  		 = isset($parameter['field_type_name'])? $parameter['field_type_name'] :'';
        	if(!$field_type_id || !$field_name || !$field_id){
				continue;
			}
			if(in_array($field_type_id,array('11','12','13','14','5','20'))){
				$parameter_option = isset($fabric_and_color_arr['prices']) ? $fabric_and_color_arr['prices']:'' ;
				if('11' == $field_type_id || '12' == $field_type_id){
					$parameter_option = 0;
				}else if('14' == $field_type_id){
					$parameter_option = 1;
				}else if('5' == $field_type_id ){
					$parameter_option = !empty($fabric_and_color_arr['fabricname']) ? trim($fabric_and_color_arr['fabricname']) : trim($fabric_grouped_data['fabricname']);
				}else if('20' == $field_type_id){
				    $parameter_option = !empty($fabric_and_color_arr['colorname']) ? trim($fabric_and_color_arr['colorname']) : trim($fabric_grouped_data['colorname']);
				}
				$args = array(
					   'ParameterType'        => $field_type_id,
	                   'ParameterName'        => isset($parameter['fieldname']) ? $parameter['fieldname']:"",
					   'ParameterOption'      => $parameter_option ,
					   'fieldCode' 		      => isset($parameter['labelnamecode']) ? $parameter['labelnamecode']:"",
	                   'ParameterFraction'    => "", 
	                   'DualSeq'              => "",
					   'ParameterSelectType'  => '0',
	             );
				if('11' == $field_type_id ){
					$args['WidthFraction'] = '';
				}elseif('12' == $field_type_id ){
					$args['DropFraction'] = '';
				}
				$parameter_field_data[$pei_productid][$field_type_id] = $args;
			}
	      }
	    }		
		$free_sample_data = array(
				'pid' 						  => $pei_productid,
				'free_sample_price'           => $free_sample_price,
				'type'                        => 'free_sample',
				'product_with_fabric_and_color' => $_product_default_name.' - ' . ucwords(str_replace('-',' ',$fabric_and_color_name)),
	            'ProductName'            	  => $_product_default_name,
	            'sid'                    	  => !empty($fabric_and_color_arr['supplierid']) ? $fabric_and_color_arr['supplierid'] : '',
		        'matmapid'                    => !empty($fabric_and_color_arr['matmapid']) ? $fabric_and_color_arr['matmapid'] : '',	
	            'Measurement'            	  => '',
	            'Quantity'               	  => 1,
				'categoryid'            	  => isset($fabric_and_color_arr['category']) ? $fabric_and_color_arr['category']:'',
	            'ProductCode'            	  => '',
	            'Supplier'               	  => isset($fabric_and_color_arr['pricetablesupplier']) ? $fabric_and_color_arr['pricetablesupplier']:'',
				'pricing_group_type'     	  => isset($fabric_and_color_arr['prices']) ? $fabric_and_color_arr['prices']:'',
				'width'                    	  => isset($parameter_field_data[$pei_productid][11]) ? $parameter_field_data[$pei_productid][11]:array(),
	            'drop'                     	  => isset($parameter_field_data[$pei_productid][12]) ? $parameter_field_data[$pei_productid][12]:array(),
	            'product_type'             	  => isset($parameter_field_data[$pei_productid][13]) ? $parameter_field_data[$pei_productid][13]:array(),
				'quantity'                     => isset($parameter_field_data[$pei_productid][14]) ? $parameter_field_data[$pei_productid][14]:array(),
				'Seqno'                  	  => '',
	            'fittedbywho'            	  => '',
	            'fittingheight'          	  => '',
	            'chainfraction'          	  => '',
	            'childfraction'          	  => '',
	            'totalchainfraction'     	  => '', 
	            'childsafetyrequired'    	  => '',
	            'chaincordsystem'        	  => '',
	            'additionalchaincorddeduction' => '',
	            'wandlength'             	  => '',
	            'chaincorddrop'          	  => '',
	            'totalchaincorddrop'     	  => '', 
	            'itemno'                 	  => "",
	            'itemid'                 	  => "",
	            'cus_seq'                	  => "", 
	            'ordertransfertype'      	  => "",
	            'OverridePrice'          	  => "",
	            'api_url'                     => untrailingslashit(blindmatrix_v4_get_api_url())
 			);
		if('' != $fabric_id && '3' == $category_id){
			$free_sample_data['fabric'] = isset($parameter_field_data[$pei_productid][5]) ? $parameter_field_data[$pei_productid][5]:array();
			$free_sample_data['color']  = array(
				'ParameterType'        => 5,
	            'ParameterName'        => 'Color',
				'ParameterOption'      => !empty($fabric_and_color_arr['colorname']) ? trim($fabric_and_color_arr['colorname']) : trim($fabric_grouped_data['colorname']) ,
				'fieldCode' 		   => "",
	            'ParameterFraction'    => "", 
	            'DualSeq'              => "",
				'ParameterSelectType'  => '0',
			);
		}else{
			$free_sample_data['color'] = isset($parameter_field_data[$pei_productid][20]) ? $parameter_field_data[$pei_productid][20]:array();
		}
	return $free_sample_data;
}
/**
 *
 * Submit a Quote  from cart 
 *
 *
 */
add_action( 'wp_ajax_nopriv_quote_form_submit_cart', 'quote_form_submit_cart' );
add_action( 'wp_ajax_quote_form_submit_cart', 'quote_form_submit_cart' );
function quote_form_submit_cart(){
    $quote_form        =   isset($_POST['quote_form']) ? $_POST['quote_form']:array();
    $quote_form        = wp_parse_args($quote_form);
    $message = blindmatrix_cart_enquiry_template_HTML($quote_form);
    $admin_email =  get_option('admin_email').','.get_option('woocommerce_email_from_address');
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: <no-reply@example.com>' . "\r\n";
   $subject = "New Cart Quote Request";
   $mailer = WC()->mailer();
	$email = new WC_Email();
	$message = apply_filters( 'woocommerce_mail_content', $email->style_inline( $mailer->wrap_message( $subject, $message ) ) );
      // Send email
      if(wp_mail($admin_email, $subject, $message, $headers)) {
        $response = array("status" => "success", "message" => "An Cart enquiry has been Submitted");
    } else {
        $response = array("status" => "error", "message" => "Unable to submit the enquiry");
    }
     echo wp_json_encode($response);
     exit;
}
/**
 * Submit a Quote 
 */
 add_action( 'wp_ajax_nopriv_quote_form_submit', 'quote_form_submit' );
 add_action( 'wp_ajax_quote_form_submit', 'quote_form_submit' );
 function quote_form_submit(){
    $param_details =   $_POST['param_details'];
    $quote_form =   isset($_POST['quote_form']) ? $_POST['quote_form']:array();
    $quote_form  = wp_parse_args($quote_form);
    $arrayToHtmlTable = arrayToHtmlTable($param_details);
    $admin_email =  get_option('admin_email').','.get_option('woocommerce_email_from_address');
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: <no-reply@example.com>' . "\r\n";
   $subject = "New Quote Request";
   ob_start();
    ?>
    <p><strong>You have received a new quote request with the following details:</strong></p>
    <table>
        <tr>
            <th>Email:</th><td><?php echo htmlspecialchars($quote_form['quote_email']); ?></td>
        </tr>
        <tr>
            <th>Phone:</th><td><?php echo htmlspecialchars($quote_form['quote_phone']); ?></td>
        </tr>
        <tr>
            <th>Notes:</th><td><?php echo htmlspecialchars($quote_form['quote_notes']); ?></td>
        </tr>
    </table>
    <h3>Order Details</h3>
    <?php echo $arrayToHtmlTable; ?>
    <?php
    $message = ob_get_clean();
    $mailer = WC()->mailer();
	$email = new WC_Email();
	$message = apply_filters( 'woocommerce_mail_content', $email->style_inline( $mailer->wrap_message( $subject, $message ) ) );
    // Send email
    if(wp_mail($admin_email, $subject, $message, $headers)) {
        $response = array("status" => "success", "message" => "An enquiry has been Submitted");
    } else {
        $response = array("status" => "error", "message" => "Unable to submit the enquiry");
    }
     echo wp_json_encode($response);
     exit;
 }
  function arrayToHtmlTable($array) {
    $html = "<div style='border: 1px solid #000; padding: 10px;'>";
    // Adding the side heading
    $html .= "<h2 style='margin: 0 0 10px 0;'>".$array['product name']. "</h2>";
    foreach ($array as $key => $value) {
        if ($array['product name'] != $value) {
            $html .= "<p> <strong>" . htmlspecialchars($key) . ":</strong> " . htmlspecialchars($value) . "</p>";
        }
    }
    $html .= "</div>";
    return $html;
}
function blindmatrix_v4_get_product_list_data($type="blinds"){
    $v4_productlist     = !empty(get_option('v4_productlistdata')) ? get_option('v4_productlistdata'):'';
    $v4_productlist_arr =  !empty($v4_productlist) ? json_decode($v4_productlist,true):array();
    if("blinds" == $type){
        return !empty($v4_productlist_arr['result']['EcomProductlist']) ? $v4_productlist_arr['result']['EcomProductlist']:array();
    }else if("shutters" == $type){
        return !empty($v4_productlist_arr['result']['ShutterProductDetails']) ? $v4_productlist_arr['result']['ShutterProductDetails']:array();
    }
    return array();
}
function blindmatrix_v4_shutter_product_list_data($productid,$shuttertypeid){
    $productid          = intval($productid);
    $shuttertypeid      = intval($shuttertypeid);
    $v4_productlist     = CallAPI_v4("GET","getshutthermaterialsdetailssub/$productid/$shuttertypeid",array());
    $v4_productlist     = json_decode(json_encode($v4_productlist->result->value)); 
    //$v4_productlist_arr =  !empty($v4_productlist) ? $v4_productlist,true:array();
    return $v4_productlist;
    //return !empty($v4_productlist_arr) ? $v4_productlist_arr:array();
}
function blindmatrix_v4_set_all_fabric_and_color_products($productid,$category_id = '',$args = array()){
	if(!$productid || !$category_id){
        return array();
    }
	$fabric_id = !empty($args['related_fabric']) ? $args['related_fabric']:"";
	$matmapid  = !empty($args['matmapid']) ? $args['matmapid']:"";
	$colorid   = !empty($args['colorid']) ? $args['colorid']:"";
	if(!$fabric_id){
		$fabric_id = $colorid;
	}
	$product_data_arr     =  CallAPI_v4("POST",'fabriclistview/'.$category_id.'/'.$productid,json_encode($args));
	$fabriclist           =  json_decode(json_encode($product_data_arr->result), true);
	update_option('v4_related_fabric_product_data_'.$productid.$fabric_id,$fabriclist);
	return $fabriclist;
}
function blindmatrix_v4_get_all_fabric_and_color_products($productid,$category_id = '',$args = array()){
    if(!$productid || !$category_id){
        return array();
    }
	$fabric_id = !empty($args['related_fabric']) ? $args['related_fabric']:"";
	$matmapid  = !empty($args['matmapid']) ? $args['matmapid']:"";
	$colorid   = !empty($args['colorid']) ? $args['colorid']:"";
	if(!$fabric_id){
		$fabric_id = $colorid;
	}
	return !empty(get_option('v4_related_fabric_product_data_'.$productid.$fabric_id)) ? get_option('v4_related_fabric_product_data_'.$productid.$fabric_id):array();
// 	$product_data_arr     =  CallAPI_v4("POST",'fabriclistview/'.$category_id.'/'.$productid,json_encode($args));
// 	$fabriclist           =  json_decode(json_encode($product_data_arr->result), true);
// 	update_option('v4_related_fabric_product_data_'.$productid.$fabric_id,$fabriclist);
// 	return $fabriclist;
    // return !empty(get_option('v4_product_data_'.$productid)) ? get_option('v4_product_data_'.$productid):'';
//     $mode                 = 'fabriclistview/'.$category_id.'/'.$productid;
//     $default_args         = array(
//         'matmapid'       => '',
//         'fabricid'       => '',
//         'colorid'        => '',
//         'related_fabric' => '',
//         'showall'        => false,
//     ); 
//     $args = array_merge($default_args,$args);
//     $product_data_arr     =  CallAPI_v4("POST",$mode,json_encode($args));
//     $fabriclist           =  json_decode(json_encode($product_data_arr->result), true);
//     return $fabriclist;
}
function blindmatrix_v4_get_all_fabric_view_products($productid){
    return !empty(get_option('v4_fabric_view_product_data_'.$productid)) ? get_option('v4_fabric_view_product_data_'.$productid):'';
}
function blindmatrix_v4_get_category_data($productid){
    return !empty(get_option('v4_product_category_data_'.$productid)) ? get_option('v4_product_category_data_'.$productid):'';
}
function blindmatrix_v4_get_filtered_fabric_view_products($productid,$args){
    $all_fabric_view_products          = blindmatrix_v4_get_all_fabric_view_products($productid);
    $all_fabric_view_products_arr      = $all_fabric_view_products->result;
}
function blindmatrix_v4_all_fabric_color_products_for_search(){
    return !empty(get_option('blindmatrix_v4_all_fabric_color_products_for_search')) ? get_option('blindmatrix_v4_all_fabric_color_products_for_search'):array();
}
function blindmatrix_v4_get_brands(){
    return !empty(get_option('blindmatrix_v4_getbrands')) ? get_option('blindmatrix_v4_getbrands'):array();
}
function blindmatrix_v4_stored_parameters_data($product_id){
    return !empty(get_option('v4_store_parameters_data_'.$product_id)) ? get_option('v4_store_parameters_data_'.$product_id):array();
}
function blindmatrix_v4_list_type_parameter_data($product_id,$field_id){
    return !empty(get_option('v4_list_type_parameter_data_'.$product_id.$field_id)) ? get_option('v4_list_type_parameter_data_'.$product_id.$field_id):array();
}
function blindmatrix_v4_taxlist(){
    return !empty(get_option('blindmatrix_v4_taxlist')) ? get_option('blindmatrix_v4_taxlist'):array();
}
function blindmatrix_v4_unittype_data($product_id){
    return !empty(get_option('blindmatrix_v4_unittype_'.$product_id)) ? get_option('blindmatrix_v4_unittype_'.$product_id):'';
}
function blindmatrix_v4_unittype_inch_fraction_data($product_id){
    return !empty(get_option('blindmatrix_v4_unittype_inch_fraction_'.$product_id)) ? get_option('blindmatrix_v4_unittype_inch_fraction_'.$product_id):'';
}
function blindmatrix_v4_product_groups(){
    return !empty(get_option('blindmatrix_v4_product_groups')) ? get_option('blindmatrix_v4_product_groups'):array();
}
function blindmatrix_v4_get_filtered_fabric_and_color_products($productid,$args){
    $filter_data                       = !empty($args['filter_data']) ? $args['filter_data']:array();
    $sorting_data                      = !empty($args['sorting_data']) ? $args['sorting_data']:array();
    $page                              = !empty($args['page']) ? $args['page']:1;
    $view                              = !empty($args['view']) ? $args['view']:'';
    $related_fabricid                  = !empty($args['related_fabricid']) ? $args['related_fabricid']:'';
    $per_page                          = 24;  
    if('fabric' != $view){
     $fabriclist                       = blindmatrix_v4_get_all_fabric_and_color_products($productid);
	 $subfabric    = [];
	 $filevel      = 0;
	 if(!empty($filter_data) && !empty($fabriclist)){
	     $altered_filter_data = array();
	     foreach($filter_data as $key=>$singlefilter){
	            if('suppliers' == $key){
	                $altered_filter_data['supplier'] = $singlefilter;
	            }else{
	                $altered_filter_data[$key] = $singlefilter;
	            }
	     }
	     $filter_data = $altered_filter_data;
		foreach($fabriclist as $singlelist){
			foreach($filter_data as $key=>$singlefilter){
				$filtered_color = isset($singlelist[$key]) ? $singlelist[$key]:'';
				if(in_array($filtered_color,$singlefilter)){
					$subfabric[] = $singlelist;
				}
			}
		}
		$fabriclist  = $subfabric;
	 }
	 if(!empty($sorting_data)){
		if($sorting_data =='bestselling'){
			$fabriclist	= removeNullEmptyBestselling($fabriclist);
			$fabriclist = blindmatrix_v4_sortBy($fabriclist,"bestselling","asc" );
		}elseif($sorting_data =='priceasc'){
			$fabriclist = blindmatrix_v4_sortBy($fabriclist,"minprice","asc" );
		}elseif($sorting_data =='pricedesc'){
			$fabriclist = blindmatrix_v4_sortBy($fabriclist,"minprice","desc" );
		}
	 }
    }else{
        $per_page                          = 4;
        $all_fabric_and_color_products     = blindmatrix_v4_get_all_fabric_view_products($productid);
        $fabriclist                        = json_decode(json_encode($all_fabric_and_color_products->result), true);
    }
    $fd_id_fabric_map = [];
	$matmapid =[];
	if($related_fabricid  != ''){
		if($fieldscategoryid == 5){
			$fd_id = $related_fabricid;
			$fabriclist = array_filter($fabriclist, function ($item) use ($fd_id) {
				return $item['fd_id'] === $fd_id;
			});
		}else{
			$fabriclist = array_slice($fabriclist, 0, 10);
		}
	}
	$total_items         = !empty($fabriclist) && is_array($fabriclist) ? count($fabriclist):0;
	$total_pages         = ceil($total_items/$per_page);
	$current_page        = $page;
	$chunked_fabric_list = !empty($fabriclist) && is_array($fabriclist) ? array_chunk($fabriclist,$per_page):array();
	if($page){
	    $page = $page - 1;
	    $chunked_fabric_list = isset($chunked_fabric_list[$page]) ? $chunked_fabric_list[$page]:array();
	}
	$fabric_list_data = array();
	$fabric_list_data['result'] = array(
	    'Ecomfabiclist' => array()
	);
	if ($total_items > 0) {
	    $fabric_list_data['result'] = array(
	        'Ecomfabiclist'  => $chunked_fabric_list,
	        'total'          => $total_items,
	        'total_pages'    => $total_pages,
	        'current_page'   => $current_page,
	        'per_page'       => $per_page
 	    );
	}
	return json_encode($fabric_list_data);
}
function removeNullEmptyBestselling($data) {
	  foreach ($data as $key => $item) {
		if (is_null($item['bestselling']) || empty($item['bestselling'])) {
		  unset($data[$key]); 
		}
	  }
	  return $data;
}
function blindmatrix_v4_sortBy($data, $type, $shifting_gears) {
	$epsilon = 0.00001;
	usort($data, function($a, $b) use ($type, $shifting_gears, $epsilon) {
	if ($a[$type] === null) {
		return 1;
	} else if ($b[$type] === null) {
		return -1;
	}
	if ($shifting_gears == 'asc') {
		if (abs($a[$type] - $b[$type]) < $epsilon) {
			return 0;
		}
		return ($a[$type] < $b[$type]) ? -1 : 1;
	} else if ($shifting_gears == 'desc') {
		if (abs($a[$type] - $b[$type]) < $epsilon) {
			return 0;
		}
		return ($a[$type] > $b[$type]) ? -1 : 1;
	}
	});
	return $data;
}
function v4_add_to_cart_validation($bool,$product_id){
    $cart = WC()->cart->get_cart();
    if(empty($cart)){
        return $bool;
    }
    $blinds_product_id = blindmatrix_v4_product_id();
    $validation  = false;
    foreach($cart as $cart_value){
        if(!empty($cart_value['blindmatrix_v4_parameters_data'])){
            $validation = true;
        }
    }
    if(true == $validation && $blinds_product_id != $product_id){
        wc_add_notice('Since blinds product is already added in the cart and hence normal product cannot be added.','error');
        return false;
    }
    $cart_product_ids = array();
    foreach($cart as $cart_value){
        $cart_product_id = isset($cart_value['product_id']) ? $cart_value['product_id']:0;
        $cart_product_ids[] = $cart_product_id;
    }
    if($product_id == $blinds_product_id && !in_array($blinds_product_id,$cart_product_ids)){
        return false;
    }
    return $bool;
} 
add_filter('woocommerce_add_to_cart_validation' ,'v4_add_to_cart_validation',999,2);
/**
 * cart template 
 */
function blindmatrix_cart_enquiry_template_HTML($quote_form){
    WC()->cart->calculate_totals();
    ob_start();
    wc_get_template("cart-template.php",array('quote_form' => $quote_form),"",untrailingslashit( plugin_dir_path( __FILE__) ) . '/templates/' );
    $content = ob_get_contents();
    ob_end_clean();
    return $content;
}
function v4_enquiry_button(){
    echo '<div style="text-align:end;margin-bottom: 10px;"><a href="#" class="button button-primary v4-send-enquiry">Submit enquiry</a></div>';
}
add_action("woocommerce_before_cart" , "v4_enquiry_button" );
function blindmatrix_v4_cart_template_display_item_meta( $item, $args = array() ) {
	$strings = array();
	$html    = '';
	$args    = wp_parse_args(
		$args,
		array(
			'before'       => '<ul class="wc-item-meta"><li>',
			'after'        => '</li></ul>',
			'separator'    => '</li><li>',
			'echo'         => true,
			'autop'        => false,
			'label_before' => '<strong class="wc-item-meta-label">',
			'label_after'  => ':</strong> ',
		)
	);
    $item_data = apply_filters( 'woocommerce_get_item_data', array(), $item );
    if(!empty($item_data) && is_array($item_data)){
        foreach($item_data as $item){
            $value = $args['autop'] ? wp_kses_post( $item['value'] ) : wp_kses_post( make_clickable( trim( $item['value'] ) ) );
            $strings[] = $args['label_before'] . wp_kses_post( $item['key'] ) . $args['label_after'] . $item['value'];
        }
    }
	if ( $strings ) {
		$html = $args['before'] . implode( $args['separator'], $strings ) . $args['after'];
	}
	if ( $args['echo'] ) {
		echo $html;
	} else {
		return $html;
	}
}
function blindmatrix_v4_get_all_color_categories(){
    $product_list        = blindmatrix_v4_get_product_list_data();
    if(empty($product_list)){
        return array();
    }
    $colors_data = array();
    foreach($product_list as $product){
        $pei_productid      = $product['pei_productid'];
        $resultcontact      = blindmatrix_v4_get_category_data($pei_productid); 
        $category_list_arr  = json_decode(json_encode($resultcontact->result), true);
        if(empty($category_list_arr) || !is_array($category_list_arr)){
            continue;
        }
        $color_category_list_name = blindmatrix_v4_get_color_category_list_name($category_list_arr,$pei_productid); 
        foreach($category_list_arr as $category_list_data){
            if($color_category_list_name == $category_list_data['name']){
                $list_color_values = $category_list_data['values'];
                if(!empty($list_color_values) && is_array($list_color_values)){
                    $colors_data = array_merge($colors_data,$list_color_values);
                }
            }
        }
    }
    if(!empty($colors_data) && is_array($colors_data)){
        $filtered_arr = array();
        foreach($colors_data as $color_values){
            $color_name = !empty($color_values["name"]) ? strtolower($color_values["name"]):'';
            if(!$color_name){
                continue;    
            }
            $filtered_arr[$color_name] = $color_values;
        }
        $colors_data = array_values($filtered_arr);
    }
    return $colors_data;
}
/**
 *
 * brands and color list
 *
 *
 */
add_action( 'wp_ajax_nopriv_brandslist', 'brandslist' );
add_action( 'wp_ajax_brandslist', 'brandslist' );
function brandslist(){ 
    global $v4_product_page;
    $chosen_brand     = $_POST['chosen_brand'];
    $colorlist = isset($_POST['colorlist']) ? $_POST['colorlist'] : '';
    $filter_cate_count = 0;
    $matched_brands_product_ids = array();
    if(!empty($chosen_brand)){
    //     $searchtext = strtolower($colorlist);	
    //         $searchlist = CallAPI_v4("POST",'productsearch',json_encode(array('productsearch' => $searchtext)));
    //         $searchlist  = json_decode(json_encode($searchlist->result), true);
    //         print_r(json_encode($searchlist));
    //   // $all_fabric_color_products_for_search   = blindmatrix_v4_all_fabric_color_products_for_search();
    //     $filtered_fabric_color_products = array_filter($all_fabric_color_products_for_search, function($fabric_color_product_arr) use ($chosen_brand) {
    //         $validate_brands_with_fabric = !empty($fabric_color_product_arr['supplier']) && $chosen_brand == strtolower(str_replace(' ','-',$fabric_color_product_arr['supplier']));
    //         if($validate_brands_with_fabric){
    //             return true;
    //         }
    //     });
    //     if(!empty($filtered_fabric_color_products) && is_array($filtered_fabric_color_products)){
    //         foreach($filtered_fabric_color_products as $filtered_fabric_color_value){
    //             if(!empty($filtered_fabric_color_value['pei_productid'])){
    //                 $matched_brands_product_ids[] = $filtered_fabric_color_value['pei_productid'];
    //             }
    //         }
    //     }
        $category = !empty($_POST['category']) ? strtolower($_POST['category']):'';
        $arr      = array();
        $filterdata_arr = !empty($colorlist) ? explode('=',$colorlist):array();
        if(!empty($filterdata_arr)){
            $arr = json_encode(array(
                'filter_data' => array(
                    $category  => implode(',',array_values($filterdata_arr)),    
                )
            ));
        }
        $brands_obj                    = CallAPI_v4("POST",'getbrands',$arr);
        $brands_arr                    = json_decode(json_encode($brands_obj->result), true);
        $matched_brands_product_ids    = array();
        if(!empty($brands_arr) && is_array($brands_arr)){
            foreach($brands_arr as $brand_val){
                if($chosen_brand == strtolower(str_replace(' ','-',$brand_val["supplier_name"]))){
                    $matched_brands_product_ids = !empty($brand_val["product_ids"]) ? explode(',',$brand_val["product_ids"]):array();
                }
            }
        }
    }
    $product_list = blindmatrix_v4_get_product_list_data();
ob_start();
if(count($matched_brands_product_ids) != 0):
    foreach ($product_list as $product):
        $product_id = $product["pei_productid"];   
        $fieldscategoryid = $product['pi_category'];
        if(!empty($chosen_brand) && !in_array($product_id,$matched_brands_product_ids)){
            continue;
        }    
        $resultcontact      = blindmatrix_v4_get_category_data($product_id); 
        $category_list_arr  = json_decode(json_encode($resultcontact->result), true);
        $color_url          = '';
        if(!empty($colorlist)){
            if(empty($category_list_arr) || !is_array($category_list_arr)){
                continue;
            }
            $color_category_list_name = blindmatrix_v4_get_color_category_list_name($category_list_arr,$product_id); 
            foreach($category_list_arr as $category_list_data){
                if($color_category_list_name == $category_list_data['name']){
                    $color_url = $colorlist; 
                }
            }
            if(!$color_url){
                continue;
            }
        }
        $fieldscategoryname ='';
        $category_heading = '';
        if( $fieldscategoryid == 3){
            $category_heading    =  'Blinds With Fabrics';
            $fieldscategoryname  =  'Blinds With Fabric';
        }else if($fieldscategoryid == 4){
            $category_heading    =  'Blinds With Slats';
            $fieldscategoryname  =  'Blinds With Slats';
        }
        $fieldscategorynameslug = str_replace(" ","-",strtolower($fieldscategoryname));
            $product_name           = $product["pei_ecomProductName"];
            $product_slug           = str_replace(" ","-",strtolower($product_name));
             $list_page_url         = '/'.$v4_product_page.'/'.$fieldscategorynameslug.'/'.$product_slug.'/?Supplier='.ucwords(str_replace('-',' ',$chosen_brand));
            if(!empty($color_url)){
                $list_page_url      = '/'.$v4_product_page.'/'.$fieldscategorynameslug.'/'.$product_slug.'/?Supplier='.ucwords(str_replace('-',' ',$chosen_brand)).'&'.$color_url;
            }
            $product_main_img       = $product['product_list_image_url'];   
            $filter_cate_count = 1;      
        ?>
                <article class="col-md-6 col-sm-12 d-flex card-product">
                    <div class="blinds_container "  >
                        <a href="<?php echo($list_page_url);?>">  
                            <img class="w-100 rounded-start"  src="<?php echo($product_main_img);?>" alt="">                                
                        </a>
                    </div>
                    <div class="card-product-meta d-flex flex-column justify-content-evenly rounded-end text-start w-100" >
                        <div class="blinds_container m-1" >
                            <a href="<?php echo($list_page_url);?>"><h5 class="blind_productname m-0 text-dark"><?php echo($product_name);?></h5></a>
                        </div>
                        <div class="m-1"><b>Category:</b> <?php echo $category_heading; ?></div>
                        <div class="m-1" >
                            <span> <?php echo !empty($product['pi_productdescription']) ? substr_replace($product['pi_productdescription'], "...", 85):''; ?></span>
                        </div>
                        <a href="<?php echo($list_page_url);?>" class="button d-block w-100 bm-v4-buynow text-white m-0 rounded-0 box-shadow-2 text-center">
                             <span>View Products</span>
                        </a>
                    </div>
                </article>
        <?php 
        endforeach;
        ?>
        <article class="col-md-6 col-sm-12 card-product"> </article>
        <?php else: ?>
            <p class='text-center'>No Products Found.</p>
        <?php endif; 
    $content = ob_get_contents();
    ob_end_clean();
if($filter_cate_count == 0){
    $content =" <p class='text-center'>No Products Found.</p>";
}
$html['html'] = $content;
$html['success'] ='true';
echo wp_json_encode($html);
exit;
}
add_action('wp_ajax_blindmatrix_v4_appointment_action', 'blindmatrix_v4_appointment_action');
add_action('wp_ajax_nopriv_blindmatrix_v4_appointment_action','blindmatrix_v4_appointment_action');	
function blindmatrix_v4_appointment_action(){
    try {
		$post = $_POST;
		if (!isset($post)) {
			throw new Exception('Invalid Data');
		}
		if ( isset( $_POST['appointment_api_credentials'] ) ) {
			$appointment_api_credentials = $_POST['appointment_api_credentials']; 
		}
		$form_data = wp_parse_args(wp_unslash($post['form_data']));
		if(empty($form_data)){
		    throw new Exception('Invalid Data');
		}
		$blindmatrix_v4_appointment = !empty($form_data['blindmatrix_v4_appointment']) && is_array($form_data['blindmatrix_v4_appointment']) ? $form_data['blindmatrix_v4_appointment']:array();
		if(empty($blindmatrix_v4_appointment)){
		    throw new Exception('Invalid Data');
		}
		$first_name = !empty($blindmatrix_v4_appointment['firstname']) ? $blindmatrix_v4_appointment['firstname']:'';
		$last_name = !empty($blindmatrix_v4_appointment['lastname']) ? $blindmatrix_v4_appointment['lastname']:'';
		$blindmatrix_appointment_args = array(
		    'billing_first_name' => $first_name,      
		    'billing_last_name'  => $last_name, 
		    'billing_company'    => $first_name.' '.$last_name,    
		    'billing_email'      => !empty($blindmatrix_v4_appointment['email']) ? $blindmatrix_v4_appointment['email']:'', 
		    'billing_phone'      => !empty($blindmatrix_v4_appointment['mobile']) ? $blindmatrix_v4_appointment['mobile']:'', 
		    'billing_city'       => !empty($blindmatrix_v4_appointment['town_or_city']) ? $blindmatrix_v4_appointment['town_or_city']:'', 
		    'billing_state'      => !empty($blindmatrix_v4_appointment['state_or_county']) ? $blindmatrix_v4_appointment['state_or_county']:'', 
		    'billing_postcode'   => !empty($blindmatrix_v4_appointment['zipcode_or_postcode']) ? $blindmatrix_v4_appointment['zipcode_or_postcode']:'', 
		    'billing_address_1'  => !empty($blindmatrix_v4_appointment['address']) ? $blindmatrix_v4_appointment['address']:'', 
		    'billing_address_2'  => '',
		    'api_url'            => untrailingslashit($appointment_api_credentials['api_url'])
		);
		$resultcontact	    = CallAPI_v4("POST",'createweblead',json_encode($blindmatrix_appointment_args),false,$appointment_api_credentials);
	
		if(!empty($resultcontact)){
		    $blindmatrix_appointment_args['job_id'] = $resultcontact;
		    $blindmatrix_appointment_data[time()]   = $blindmatrix_appointment_args; 
		    $blindmatrix_v4_stored_appointment_data = get_option('blindmatrix_v4_stored_appointment_data',array());
		    if(!empty($blindmatrix_v4_stored_appointment_data)){
		        update_option('blindmatrix_v4_stored_appointment_data',$blindmatrix_v4_stored_appointment_data + $blindmatrix_appointment_data);
		    }else{
		        update_option('blindmatrix_v4_stored_appointment_data',$blindmatrix_appointment_data);
		    }
		}
		wp_send_json_success( array( 'success' => true,'result'=>$resultcontact ));
	} catch (Exception $ex) {
			wp_send_json_error( array( 'error' => $ex->getMessage() ) );
	}
}
/**
 *
 * all product list 
 *
 */
function allproducts_filter($args = array()){
    $all_fabric_and_color_products = blindmatrix_v4_all_fabric_color_products_for_search();
    $all_fabric_list_arr = array();
    // Brands
    if(!empty($args['suppliers']) && !empty($all_fabric_and_color_products)){
        foreach($all_fabric_and_color_products as $product_list_value){
            $product_id       = isset($product_list_value['pei_productid']) ? $product_list_value['pei_productid']:'';
            $supplier         = !empty($product_list_value['supplier']) ? str_replace(" ","-",strtolower($product_list_value['supplier'])):'';
            if(!$supplier || $args['suppliers'] != $supplier){
                continue;
            }
            $all_fabric_list_arr[] = $product_list_value;
        }
    }  
    // Color
    if(!empty($args['color']) && !empty($all_fabric_and_color_products)){
        foreach($all_fabric_and_color_products as $product_list_value){
            $product_id       = isset($product_list_value['pei_productid']) ? $product_list_value['pei_productid']:'';
            $colorname        = !empty($product_list_value['colours']) ? str_replace(" ","-",strtolower($product_list_value['colours'])):'';
            if(!$colorname || $args['color'] != $colorname){
                continue;
            }
            $all_fabric_list_arr[] = $product_list_value;
        }
    }
    if(empty($all_fabric_list_arr)){
        return array();
    }
    $per_page            = 40;
    $total_fabric_color  = count($all_fabric_list_arr);
    $current_page        = !empty($args['current_page']) ? $args['current_page']:1;
    $page_count          = count($all_fabric_list_arr)/$per_page;
    $offset              = ($current_page - 1) * $per_page; 
    $posts_per_page      = $current_page * $per_page;       
    $all_fabric_list_arr = array_slice($all_fabric_list_arr,$offset,$posts_per_page);
    $matched_fabric_list_based_on_product_arr = array();
    foreach($all_fabric_list_arr as $product_list_value){
        $product_id            = isset($product_list_value['pei_productid']) ? $product_list_value['pei_productid']:'';
        $matched_fabric_list_based_on_product_arr[$product_id][] = $product_list_value;
    }
    return array(
        'current_page'            => $current_page,
        'per_page'                => $per_page,
        'page_count'              => $page_count,
        'total_fabric_color'      => $total_fabric_color,
        'matched_fabric_list_arr' => $matched_fabric_list_based_on_product_arr
    );
}
function blindmatrix_v4_seo_details(){
     return !empty(get_option('blindmatrix_v4_seo_details')) ? get_option('blindmatrix_v4_seo_details'):array();
}
function blindmatrix_v4_gretathemes_meta_description(){
    global $post;
	global $v4_product_visualizer_page;
	global $v4_product_page;
    $productslug = get_query_var("productname");
    $productname =str_replace("-"," ",strtolower($productslug));
    $product_list = blindmatrix_v4_get_product_list_data();
    $id = array_search(strtolower($productname), array_map('strtolower', array_column($product_list, 'pei_ecomProductName')));
    if (is_page($v4_product_page) ) {
        $blindmatrix_seo_details = blindmatrix_v4_seo_details();
        if(isset($blindmatrix_seo_details[$id]['seo_mtitle'])){
            echo '<meta name="meta_name" content="'.$blindmatrix_seo_details[$id]['seo_mtitle'].'" >'."\n";
        }
        if(isset($blindmatrix_seo_details[$id]['seo_mdescription'])){
            echo '<meta name="description" content="'.$blindmatrix_seo_details[$id]['seo_mdescription'].'" >'."\n";
        }
        if(isset($blindmatrix_seo_details[$id]['seo_mkeyword'])){
            echo '<meta name="description" content="'.$blindmatrix_seo_details[$id]['seo_mkeyword'].'" >'."\n";
        }
        if(isset($blindmatrix_seo_details[$id]['seo_conical_url'])){
            echo '<link rel="canonical" href="'.$blindmatrix_seo_details[$id]['seo_conical_url'].'" />'."\n";
        }
        $page = get_page_by_path($v4_product_page);
        if($page && isset($blindmatrix_seo_details[$id])){
		    update_post_meta( $page->ID,'_yoast_wpseo_metadesc',$blindmatrix_seo_details[$id]['seo_mdescription'] );
		    update_post_meta( $page->ID,'_yoast_wpseo_title',$blindmatrix_seo_details[$id]['seo_mtitle'] );
		    update_post_meta( $page->ID,'_yoast_wpseo_canonical',$blindmatrix_seo_details[$id]['seo_conical_url']);    
        }
    }
    if(is_page($v4_product_visualizer_page)){
        $product_id = $product_list[$id]['pei_productid'];
        // $fabric_list = blindmatrix_v4_get_all_fabric_and_color_products($product_id);
        $fabricid           = get_query_var("fabricid");
        $matmapid           = get_query_var("mapid");
        $colorid            = get_query_var("colorid");
        $productcategoryid  = $product_list[$id]['pi_category'];  
        $fieldscategoryid   = 0;
        if($productcategoryid == 3){
            $fieldscategoryid = 5;
        }else if($productcategoryid == 4){
            $fieldscategoryid = 20;
        }
		$_fabric_args           =  array(
			//'related_fabric' => $fabricid,
			'matmapid'       => $matmapid,
			'colorid'        => $colorid,
		);
		blindmatrix_v4_set_all_fabric_and_color_products($product_id,$fieldscategoryid,array_merge(array('showall' => true ),$_fabric_args));
        $fabric_list = blindmatrix_v4_get_all_fabric_and_color_products($product_id,$fieldscategoryid,$_fabric_args);
        $color_arr = array();
            if(!empty($fabric_list) && is_array($fabric_list)){
            	if($fabricid == 0){
                	$color_arr = array_values(array_filter($fabric_list, function ($item) use ($colorid , $matmapid) {
                    	return isset($item["cd_id"]) && isset($item["matmapid"]) && $item["cd_id"] ==  $colorid && $item["matmapid"] ==  $matmapid;
                	}));
            	}else{
                	$color_arr = array_values(array_filter($fabric_list, function ($item) use ($fabricid, $colorid , $matmapid) {
                    	return isset($item["cd_id"]) && isset($item["fd_id"]) && isset($item["matmapid"]) && $item["fd_id"] ==  $fabricid && $item["cd_id"] ==  $colorid && $item["matmapid"] ==  $matmapid;
                	}));
            	}
            }
            if(isset($color_arr[0]['metatitle'])){
                echo '<meta name="meta_name" content="'.$color_arr[0]['metatitle'].'" >'."\n";
            }
            if(isset($color_arr[0]['metadescription'])){
                echo '<meta name="description" content="'.$color_arr[0]['metadescription'].'" >'."\n";
            }
            if(isset($color_arr[0]['metakeyword'])){
                echo '<meta name="description" content="'.$color_arr[0]['metakeyword'].'" >'."\n";
            }
            if(isset($color_arr[0]['canonicalurl'])){
                echo '<link rel="canonical" href="'.$color_arr[0]['canonicalurl'].'" />'."\n";
            }
        $page = get_page_by_path($v4_product_visualizer_page);
		update_post_meta( $page->ID,'_yoast_wpseo_metadesc',$color_arr[0]['metadescription'] );
		update_post_meta( $page->ID,'_yoast_wpseo_title',$color_arr[0]['metatitle'] );
		update_post_meta( $page->ID,'_yoast_wpseo_canonical',$color_arr[0]['canonicalurl']);
    }
}
add_action( 'wp_head', 'blindmatrix_v4_gretathemes_meta_description',1);
add_filter( 'wpseo_json_ld_output', 'blindmatrix_v4_remove_multiple_yoast_meta_tags',9999 );
add_filter( 'wpseo_robots', 'blindmatrix_v4_remove_multiple_yoast_meta_tags',9999 );
add_filter( 'wpseo_canonical', 'blindmatrix_v4_remove_multiple_yoast_meta_tags',9999 );
add_filter( 'wpseo_title', 'blindmatrix_v4_remove_multiple_yoast_meta_tags',9999 );
add_filter( 'wpseo_metadesc', 'blindmatrix_v4_remove_multiple_yoast_meta_tags',9999 );
add_filter( 'wpseo_opengraph_desc', 'blindmatrix_v4_remove_multiple_yoast_meta_tags',9999 );
add_filter( 'wpseo_opengraph_title', 'blindmatrix_v4_remove_multiple_yoast_meta_tags',9999 );
function blindmatrix_v4_remove_multiple_yoast_meta_tags( $myfilter ) {
    global $v4_product_visualizer_page;
     global $v4_product_page  ;
     if ( is_page($v4_product_visualizer_page) || is_page( $v4_product_page) ) {
         return false;
     }
      return $myfilter;
}
function blindmatrix_v4_get_color_category_list_name($category_list_arr,$product_id = 0){
    $index = apply_filters('blindmatrix_v4_alter_color_cat_list_name_index',0,$product_id);
    return !empty($category_list_arr[$index]['name']) ? $category_list_arr[$index]['name']:'';
}
function blindmatrix_v4_menu_products_list(){
global $v4_product_page;
$allproducts = array();
$get_v4_productlists = blindmatrix_v4_get_product_list_data();
    //products list
foreach($get_v4_productlists as $key => $productss){
    $pei_productid      = $productss['pei_productid'];
    $pi_category        = $productss['pi_category'];
    $ProductName        = ucfirst($productss['pei_ecomProductName']);
    $v4_option_data     = !empty(get_option('blindmatrix_v4_option_data')) && is_array(get_option('blindmatrix_v4_option_data')) ? get_option('blindmatrix_v4_option_data'):array();
    if( 3 == $pi_category){
        $type =	'blinds_with_fabric';
        $icon_type =	'blinds_with_fabrics';
    }
    if( 4 ==  $pi_category){
        $type =	'blinds_with_slates';
        $icon_type =	'blinds_with_slates';
        $blindswithslates['menuimage'][$pei_productid] = $productss['product_list_image_url'];
    }
	if( 5 ==  $pi_category){
		continue;
	}
    $menu_img_icon      = isset($v4_option_data['product_spec'][$icon_type][$pei_productid]['icon']) ? $v4_option_data['product_spec'][$icon_type][$pei_productid]['icon']:'';
    $product_slug       = str_replace(" ","-",strtolower($ProductName));
    $fieldscategoryname = str_replace("_","-",strtolower($type));
    $list_page_url      = get_site_url().'/'.$v4_product_page.'/'.$fieldscategoryname.'/'.$product_slug.'/';
    $key                = !empty(get_option('option_blindmatrix_shop_by_products_title')) ? get_option('option_blindmatrix_shop_by_products_title') : 'shop by products';
    $key                = str_replace(" ","-",$key);
    $total              = !empty(get_option('option_blindmatrix_shop_by_products_totals_products')) ? get_option('option_blindmatrix_shop_by_products_totals_products') : '12';
    $width              = !empty(get_option('option_blindmatrix_shop_by_products_column_width')) ? get_option('option_blindmatrix_shop_by_products_column_width') : '24';
    $allproducts[$key]['menu_total'] = $total;
    $allproducts[$key]['menu_width'] = $width;
    $allproducts[$key]['menu_icon_style'] = '';
    $allproducts[$key]['values'][]= array(
        'menu_name'   => $ProductName,
        'menu_link'   => $list_page_url,
        'menu_icon'   => $menu_img_icon,
    );
}
return $allproducts ;
}
function blindmatrix_v4_menu_suppliers_list(){
//brands list
$allproducts = array();
$brandid = blindmatrix_v4_brands_page_id();	
$brandsurl = get_permalink($brandid);	
$brands = blindmatrix_v4_get_brands(); 
   foreach($brands as $brand){
        $key           = strtolower(str_replace(' ','-',$brand->supplier_name));
        $name          = ucfirst($brand->supplier_name);
        $page_link     = $brandsurl.$key.'/';
        $key           = !empty(get_option('option_blindmatrix_shop_by_suppliers_title')) ? get_option('option_blindmatrix_shop_by_suppliers_title') : 'suppliers';
        $key           = str_replace(" ","-",$key);
        $total         = !empty(get_option('option_blindmatrix_shop_by_suppliers_totals_products')) ? get_option('option_blindmatrix_shop_by_suppliers_totals_products') : '12';
        $width         = !empty(get_option('option_blindmatrix_shop_by_suppliers_column_width')) ? get_option('option_blindmatrix_shop_by_suppliers_column_width') : '24';
        $allproducts[$key]['menu_total'] = $total;
        $allproducts[$key]['menu_width'] = $width;
        $allproducts[$key]['menu_icon_style'] = '';
        $allproducts[$key]['values'][]= array(
            'menu_name'   => $name,
            'menu_link'   => $page_link,
            'menu_icon'   => 'no-image',
        );
    } 
    return $allproducts ;
}
function blindmatrix_v4_menu_color_list(){
global $category_img_file_path;
$colorlist = blindmatrix_v4_get_all_color_categories();
$allproducts = array();
//colors list
 foreach( $colorlist as $key => $singlecolor){ 
    $img           =  isset($singlecolor['img']) ? $singlecolor['img']:'';
    $color_name    = $singlecolor['name'];
    $color_slug    = str_replace(" ","-",strtolower($color_name));
    $list_page_url = get_site_url().'/shop-by-colors/'.$color_slug.'/';
    $menu_img_icon = $category_img_file_path.$img;
    $key           = !empty(get_option('option_blindmatrix_shop_by_colors_title')) ? get_option('option_blindmatrix_shop_by_colors_title') : 'shop by colors';
    $key           = str_replace(" ","-",$key);
    $total         = !empty(get_option('option_blindmatrix_shop_by_color_totals_products')) ? get_option('option_blindmatrix_shop_by_color_totals_products') : '12';
    $width         = !empty(get_option('option_blindmatrix_shop_by_color_column_width')) ? get_option('option_blindmatrix_shop_by_color_column_width') : '24';
    $allproducts[$key]['menu_total'] = $total;
    $allproducts[$key]['menu_width'] = $width;
    $allproducts[$key]['menu_icon_style'] = 'box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);';
    $allproducts[$key]['values'][]= array(
        'menu_name'   => $color_name,
        'menu_link'   => $list_page_url,
        'menu_icon'   => $menu_img_icon,
    );
 }
    return $allproducts ;
}
function blindmatrix_v4_menu_type_list(){
$allproducts        = array();    
$product_group      = blindmatrix_v4_product_grouping_page_id();
$productgroupurl    = get_page_link($product_group);	  
$product_groups     = blindmatrix_v4_product_groups();  
$icon_sub           = get_option('option_blindmatrix_v4_group_icon_submit');
 //product group list
 foreach ($product_groups as $key_id => $product_group) {
	$hasHyphen      = strpos($key_id, '-') !== false;
	$ProductName    = $hasHyphen ? strtolower(str_replace('-', ' ', $key_id)) : $key_id;
    $list_page_url  = $productgroupurl . $key_id;
    $menu_img_icon  = $icon_sub[$key_id];
    $key            = !empty(get_option('option_blindmatrix_shop_by_type_title')) ? get_option('option_blindmatrix_shop_by_type_title') : 'shop by type';
    $key            = str_replace(" ","-",$key);
    $total          = !empty(get_option('option_blindmatrix_shop_by_type_totals_products')) ? get_option('option_blindmatrix_shop_by_type_totals_products') : '12';
    $width          = !empty(get_option('option_blindmatrix_shop_by_type_column_width')) ? get_option('option_blindmatrix_shop_by_type_column_width') : '24';
    $allproducts[$key]['menu_total'] = $total;
    $allproducts[$key]['menu_width'] = $width;
    $allproducts[$key]['menu_icon_style'] = '';
    $allproducts[$key]['values'][]= array(
        'menu_name'   => $ProductName,
        'menu_link'   => $list_page_url,
        'menu_icon'   => $menu_img_icon,
    );
} 
    return $allproducts ;
}

add_action('wp_ajax_blindmatrix_run_now_action','blindmatrix_run_now_action');
add_action('wp_ajax_nopriv_blindmatrix_run_now_action','blindmatrix_run_now_action');

function blindmatrix_run_now_action(){
    delete_option('blindmatrix_v4_hide_api_sync_notice');
    delete_option('blindmatrix_v4_manual_sync_timestamp');
    update_option('blindmatrix_v4_is_manual_sync','1');
    update_option('blindmatrix_v4_manual_sync_timestamp',time());
    if(class_exists('V4_Cron_Handler')){
        V4_Cron_Handler::schedule_my_recurring_action();
    }
    echo wp_send_json_success(true);
    exit;
}
/**
 * Get formatted date in local time.
 *
 * @return string
 */
function blindmatrix_v4_get_formatted_time($time){
	if(!$time){
		return '';
	}
	$timestamp_with_offset = $time + get_option( 'gmt_offset', 0 ) * HOUR_IN_SECONDS;
	$format = get_option('date_format') .' '. get_option('time_format');
	return date_i18n( $format, $timestamp_with_offset );
}
add_filter('woocommerce_cart_item_name',function($name, $cart_item, $cart_item_key){
    	$blindmatrix_v4_parameters_data = isset($cart_item['blindmatrix_v4_parameters_data']) ? $cart_item['blindmatrix_v4_parameters_data']:array();
	if(empty($blindmatrix_v4_parameters_data)){
		return $name;
	}
	$_type             = isset($blindmatrix_v4_parameters_data['type']) ? $blindmatrix_v4_parameters_data['type']:'';
	if('quote_link' == $_type){
	    return $name;
	}
	if(isset($blindmatrix_v4_parameters_data["free_sample_data"])){
	    return $name;
	}
	$edit_html = '';
	$visualizer_page_url = blindmatrix_v4_get_visualizer_page_url($blindmatrix_v4_parameters_data);
	if($visualizer_page_url){
	   $visualizer_page_url = add_query_arg(array('cart_item_key' => $cart_item_key),$visualizer_page_url); 
	   $edit_html = $name.'<a href="'.$visualizer_page_url.'" class="button" style="padding: 4px 6px; width: auto; font-weight: 700; text-transform: capitalize; text-align: center; margin-left: 5px;"><span class="dashicons dashicons-edit" style="font-size: 16px; line-height: 0.9; width: auto; height: auto;"></span> Edit</a>';
	}
	if($edit_html){
	    $copy_html = '<a href="#" class="button blindmatrix-v4-copy-product" data-key="'.$cart_item_key.'" style="padding: 4px 6px; width: auto; font-weight: 700; text-transform: capitalize; text-align: center; margin-left: 5px;"><i class="fa-solid fa-copy"></i> Copy</a>';
	    return $edit_html.' '.$copy_html;
	}
	return $name;
},999,3);
add_action('wp_ajax_nopriv_blindmatrix_v4_copy_product','blindmatrix_v4_copy_product');
add_action('wp_ajax_blindmatrix_v4_copy_product','blindmatrix_v4_copy_product');
function blindmatrix_v4_copy_product(){
    if(!isset($_POST)){
        return;
    }
    $cart_item_key = isset($_POST['cart_item_key']) ? $_POST['cart_item_key']:'';
    if(!$cart_item_key){
        return;
    }
    $cart_item   = WC()->cart->get_cart_item($cart_item_key);
    $product_id  = blindmatrix_v4_product_id();
    $quantity    = !empty($cart_item['quantity']) ? $cart_item['quantity']:1;
    $blindmatrix_v4_parameters_data = !empty($cart_item['blindmatrix_v4_parameters_data']) ? $cart_item['blindmatrix_v4_parameters_data']:array();  
    WC()->cart->add_to_cart( $product_id, $quantity,0,array(),array('blindmatrix_v4_parameters_data'=> $blindmatrix_v4_parameters_data,'old_cart_item_key' => $cart_item_key));
    echo wp_json_encode(array('success' => true));
    exit;
}
add_action('wp_ajax_nopriv_csv_googleads', 'csv_googleads'); 
add_action('wp_ajax_csv_googleads', 'csv_googleads');
function csv_googleads(){
    global $base_site_url;
    global $v4_product_visualizer_page;
    global $fabric_image_file_path;
    global $v4_shutter_visualizer_page;
	$index              = $_POST['productcode'];
	$allproduct_export  = $_POST['allproduct_export'];
	$fieldscategoryid   = '';
    $product_list = blindmatrix_v4_get_product_list_data();
		$RAND = rand();
        $output_filename = 'MyPosts_' . $RAND . '.csv';
        $output_handle = @fopen( 'php://output', 'w' );
	 	$header_array = array("id","title","description","link","price","availability","image link","brand");
		 header( 'Cache-Control: must-revalidate, post-check=0, pre-check=0' );
         header( 'Content-Description: File Transfer' );
         header( 'Content-type: text/csv' );
         header( 'Content-Disposition: attachment; filename=' . $output_filename );
         header( 'Expires: 0' );
         header( 'Pragma: public' );
       // Insert header row
        fputcsv( $output_handle, $header_array );
      //  Parse results to csv format
            if($allproduct_export == 'true'){
                foreach ($product_list as $product):
                    $product_id             = $product["pei_productid"];    
                    $product_title          = $product["pei_ecomProductName"]; 
                    $product_description    = $product['pi_productdescription']; 
                    $categoryId             = $product['pi_category'];
                    $fieldscategoryname ='';
                    if($categoryId == 3){
                        $fieldscategoryname  =  'Blinds With Fabric';
                        $fieldscategoryid    = 5;
                    }
                    else if($categoryId == 4){
                        $fieldscategoryname  =  'Blinds With Slats';
                        $fieldscategoryid    = 20;
                    }
                    else if($categoryId == 5){
                        $fieldscategoryname  =  'Shutter';
                        $fieldscategoryid = 21;
                    } 
					blindmatrix_v4_set_all_fabric_and_color_products($product_id,$fieldscategoryid,array('related_fabric'=> $fabricid,'showall' => true ));
                    $all_fabric_and_color_products = blindmatrix_v4_get_all_fabric_and_color_products($product_id,$fieldscategoryid,array('related_fabric'=> $fabricid));
                    foreach ($all_fabric_and_color_products as $fabric_and_color_products):
                        $fabric_id                  = $fabric_and_color_products['fd_id'];
                        $color_id                   = $fabric_and_color_products['cd_id'];
                        $matmapid                   = $fabric_and_color_products['matmapid'];
                        $pricing_grp_id             = $fabric_and_color_products['groupid'];
                        $supplier_id                = $fabric_and_color_products['supplierid'];
                        $fabricname                 = $fabric_and_color_products['fabricname'];
                        $colorname                  = $fabric_and_color_products['colorname'];
                        $minprice                   = $categoryId == 5 ? $fabric_and_color_products['colorunitcost']:$fabric_and_color_products['minprice'];
                        $fabric_and_color_image_url = $fabric_image_file_path.$fabric_and_color_products['colorimage'];
                        $productslug                = str_replace(" ","-",strtolower($product_title));
                        $fieldscategoryname_new     =  str_replace(" ","-",strtolower($fieldscategoryname));
                        $fabricname                 = $fabricname." ".$colorname;
                        $fabricname_slug            = str_replace(" ","-",strtolower($fabricname));
                        if($fieldscategoryname_new == 'blinds-with-fabric'){
                            $visulizer_page_link =  $base_site_url.'/'.$v4_product_visualizer_page.'/'.$fieldscategoryname_new.'/'.$productslug.'/'.$fabricname_slug.'/'.$fabric_id.'/'.$color_id.'/'.$matmapid.'/'.$pricing_grp_id.'/'.$supplier_id;
                        }elseif($fieldscategoryname_new == 'blinds-with-slates'){
                            $fabric_id           = 0;
                            $fabricname          = $colorname;
                            $fabricname_slug     = str_replace(" ","-",strtolower($fabricname));
                            $visulizer_page_link = $base_site_url.'/'.$v4_product_visualizer_page.'/'.$fieldscategoryname_new.'/'.$productslug.'/'.$fabricname_slug.'/'.$fabric_id.'/'.$color_id.'/'.$matmapid.'/'.$pricing_grp_id.'/'.$supplier_id;
                        }
                        else{ 
                            $mapid               = $fabric_and_color_products['mapid'];
                            $visulizer_page_link = $base_site_url.'/'.$v4_shutter_visualizer_page.'/'.$product_id.'/'.$fabric_id.'/'.$mapid;
                        }
                        $productname                = $product_title." ".$fabricname;
                        $leadArray = array($color_id,ucfirst($productname),$product_description,$visulizer_page_link,$minprice,'in_stock',$fabric_and_color_image_url,ucfirst($fieldscategoryname)); 
                    //Add row to file
                       fputcsv( $output_handle, $leadArray );
                    endforeach;
                endforeach;   
            }
            else{
                $product_id             = $product_list[$index]['pei_productid'];
                $product_description    = $product_list[$index]['pi_productdescription'];
                $categoryId             = $product_list[$index]['pi_category'];
                $product_title          = $product_list[$index]["pei_ecomProductName"]; 
                    $fieldscategoryname = '';
                    if($categoryId == 3){
                        $fieldscategoryname  =  'Blinds With Fabric';
                        $fieldscategoryid = 5;
                    }
                    else if($categoryId == 4){
                        $fieldscategoryname  =  'Blinds With Slats';
                        $fieldscategoryid = 20;
                    } 
                    else if($categoryId == 5){
                        $fieldscategoryname  =  'Shutter';
                        $fieldscategoryid = 21;
                    }  
				blindmatrix_v4_set_all_fabric_and_color_products($product_id,$fieldscategoryid,array('related_fabric'=> $fabricid,'showall' => true ));
                $all_fabric_and_color_products = blindmatrix_v4_get_all_fabric_and_color_products($product_id,$fieldscategoryid,array('related_fabric'=> $fabricid));
                foreach ($all_fabric_and_color_products as $fabric_and_color_products):
                    $fabric_id                  = $fabric_and_color_products['fd_id'];
                    $color_id                   = $fabric_and_color_products['cd_id'];
                    $matmapid                   = $fabric_and_color_products['matmapid'];
                    $pricing_grp_id             = $fabric_and_color_products['groupid'];
                    $supplier_id                = $fabric_and_color_products['supplierid'];
                    $fabricname                 = $fabric_and_color_products['fabricname'];
                    $colorname                  = $fabric_and_color_products['colorname'];
                    $minprice                   = $categoryId == 5 ? $fabric_and_color_products['colorunitcost']:$fabric_and_color_products['minprice'];
                    $fabric_and_color_image_url = $fabric_image_file_path.$fabric_and_color_products['colorimage'];
                    $productslug                = str_replace(" ","-",strtolower($product_title));
                    $fieldscategoryname_new     = str_replace(" ","-",strtolower($fieldscategoryname));
                    $fabricname                 = $fabricname." ".$colorname;
                    $fabricname_slug            = str_replace(" ","-",strtolower($fabricname));
                    if($fieldscategoryname_new == 'blinds-with-fabric'){
                        $visulizer_page_link =  $base_site_url.'/'.$v4_product_visualizer_page.'/'.$fieldscategoryname_new.'/'.$productslug.'/'.$fabricname_slug.'/'.$fabric_id.'/'.$color_id.'/'.$matmapid.'/'.$pricing_grp_id.'/'.$supplier_id;
                    }elseif($fieldscategoryname_new == 'blinds-with-slates'){
                        $fabric_id           = 0;
                        $fabricname          = $colorname;
                        $fabricname_slug     = str_replace(" ","-",strtolower($fabricname));
                        $visulizer_page_link = $base_site_url.'/'.$v4_product_visualizer_page.'/'.$fieldscategoryname_new.'/'.$productslug.'/'.$fabricname_slug.'/'.$fabric_id.'/'.$color_id.'/'.$matmapid.'/'.$pricing_grp_id.'/'.$supplier_id;
                    }
                    else{ 
                        $mapid               = $fabric_and_color_products['mapid'];
                        $visulizer_page_link = $base_site_url.'/'.$v4_shutter_visualizer_page.'/'.$product_id.'/'.$fabric_id.'/'.$mapid;
                    }
                    $productname                = $product_title." ".$fabricname;
                    $leadArray = array($color_id,ucfirst($productname),$product_description,$visulizer_page_link,$minprice,'in_stock',$fabric_and_color_image_url,ucfirst($fieldscategoryname)); 
                   // Add row to file
                   fputcsv( $output_handle, $leadArray );
                endforeach;
            }
        // Close output file stream
        fclose( $output_handle );
        die();
}
add_filter('woocommerce_coupon_get_items_to_validate',function($cart_items,$obj){
    $applied_coupons = $obj->get_object()->get_applied_coupons();
    $product_id = 0;
    $altered_cart_items = array();
    $coupon_based_on = '';
    if(!empty($applied_coupons)){
        foreach($applied_coupons as $applied_coupon){
            $coupon          = new WC_Coupon($applied_coupon);
            $product_id      = get_post_meta($coupon->get_id(),'cc_productId',true);
            $coupon_based_on = get_post_meta($coupon->get_id(),'cc_couponBasedOn',true);
        }
        if(1 == $coupon_based_on){
            foreach($cart_items as $cart_item){
                $cart_object = isset($cart_item->object) ? $cart_item->object:'';
                $blindmatrix_v4_parameters_data = !empty($cart_object['blindmatrix_v4_parameters_data']) ? $cart_object['blindmatrix_v4_parameters_data']:array();
                if($blindmatrix_v4_parameters_data['product_id'] == $product_id){
                    $altered_cart_items[] = $cart_item;
                }
            }
            return $altered_cart_items;
        }
    }
	return $cart_items;
},10,2);
add_filter('woocommerce_coupon_is_valid', 'blindmatrix_v4_coupon_validation', 10, 2);
function blindmatrix_v4_coupon_validation($valid, $coupon ) {    
    foreach($coupon->get_meta_data() as $meta_data){
        if(!isset($meta_data->key)){
            continue;
        }
		$coupon_error = blindmatrix_v4_coupon_error_message($coupon,$meta_data);
        if($coupon_error){
			throw new Exception($coupon_error);
			return false;
		}
    }
    return $valid;
}
add_action( 'woocommerce_check_cart_items', function(){	
	if(!empty(WC()->cart->get_applied_coupons() )){
	  foreach ( WC()->cart->get_applied_coupons() as $code ) {
		$coupon = new WC_Coupon( $code );
		$remove_coupon = false;
		foreach($coupon->get_meta_data() as $meta){
			$coupon_error = blindmatrix_v4_coupon_error_message($coupon,$meta);
			if($coupon_error){
				$remove_coupon = true;
			}
		}
		if ( $remove_coupon ) {
			$coupon->add_coupon_message( WC_Coupon::E_WC_COUPON_INVALID_REMOVED );
			WC()->cart->remove_coupon( $code );
		}
	  }
	}
}, 1 );
function blindmatrix_v4_coupon_error_message($coupon,$meta_data){
		$cart_product_ids = array();
    	if(!empty(WC()->cart->get_cart())){
        	foreach(WC()->cart->get_cart() as $cart_item){
            	$blindmatrix_v4_parameters_data = isset($cart_item['blindmatrix_v4_parameters_data']) ? $cart_item['blindmatrix_v4_parameters_data']:array();
            	$cart_product_ids[] = isset($blindmatrix_v4_parameters_data['product_id']) ? $blindmatrix_v4_parameters_data['product_id']:0;
        	}
    	}
		// Tax Validation 
		if(!empty($cart_product_ids)){
			if('excl' != get_option('blindmatrix_vat_type')){
				return 'Coupon is not valid.';
			}
		}
		// Start Date Validation 
    	if('cc_startdate' == $meta_data->key){
       		$start_date = get_post_meta($coupon->get_id(),$meta_data->key,true);
       		if($start_date && strtotime(current_time('mysql')) < strtotime($start_date)){
				return 'Coupon is not valid.';
            }
        }
        // End Date Validation 
        if('cc_enddate' == $meta_data->key){
           $end_date = get_post_meta($coupon->get_id(),$meta_data->key,true);
           if($end_date && strtotime(current_time('mysql')) > strtotime($end_date)){
    			return 'Coupon is expired.';
            }
        }
		// Active Status Validation
        if('cc_activestatus' == $meta_data->key){
            $status = get_post_meta($coupon->get_id(),$meta_data->key,true);
			if(1 == $status){
				return 'Coupon is not valid.';
			}
        }
        // Product Validation
        $validate_product_not_exists = false;
        if('cc_productId' == $meta_data->key){
            $product_id = get_post_meta($coupon->get_id(),$meta_data->key,true);
            if(!empty($product_id) && !empty($cart_product_ids)){
				$validate_product_not_exists = true;
				foreach($cart_product_ids as $cart_product_id){
					if($product_id == $cart_product_id){
					    $validate_product_not_exists = false;
					}
				}
            }
            if($validate_product_not_exists){
                return 'Coupon is not valid.';
            }
        }
	return '';
}

function custom_woocommerce_cart_item_thumbnail($thumbnail, $cart_item, $cart_item_key) {
	$blindmatrix_v4_parameters_data = isset($cart_item['blindmatrix_v4_parameters_data']) ? $cart_item['blindmatrix_v4_parameters_data']:array();
	if(!empty($blindmatrix_v4_parameters_data['shutter_color_image'])){
		$img_url = $blindmatrix_v4_parameters_data['shutter_color_image'];
        $thumbnail = "<img src='$img_url' alt='New Image'>";
	}
	return $thumbnail;
}
add_filter('woocommerce_cart_item_thumbnail', 'custom_woocommerce_cart_item_thumbnail', 10, 3);

add_action('wp_head',function(){
    if(!isset($_GET['blindmatrix_v4_sync'])){
        return;
    }
    
    if(isset($_REQUEST['blindmatrix_v4_hide_api_sync_notice'])){
        update_option('blindmatrix_v4_hide_api_sync_notice',1);
        wp_safe_redirect('?blindmatrix_v4_sync=true');
        exit;
    }
    
    ?>
    <style>
     body {
        justify-content: center;
        align-items: center;
        background: #000;
        display: flex;
        height: 100vh;
        padding: 0;
        margin: 0;
    }

    .progress {
        background: rgba(255,255,255,0.1);
        justify-content: flex-start;
        border-radius: 100px;
        align-items: center;
        position: relative;
        padding: 0 5px;
        display: flex;
        height: 40px;
        width: 500px;
        margin: auto;
    }
        
    .progress-value {
        /*animation: load 3s normal forwards;*/
        box-shadow: 0 10px 40px -10px #fff;
        border-radius: 100px;
        background: #fff;
        height: 30px;
        width: 0;
    }
        
     /* Define animation class */
        .animate-progress {
            animation: load 3s forwards; /* Apply keyframe animation */
        }

        /* Define the keyframes */
        @keyframes load {
            0% {
                width: 0;
            }
            100% {
                width: var(--progress-width); /* Use a custom property for dynamic width */
            }
        }
    </style>
    
    <script type="text/javascript">
        jQuery(document).ready(function(){
            if(jQuery('.blindmatrix-progress-bar').length > 0 ){
                function progress_bar_action($count){
                    var data= { action:'blindmatrix_run_now_progress_bar_action','count':$count };
                    jQuery.ajax({
			            url: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
			            data: data,
			            type: 'POST',
			            dataType: "json",
			            success: function( response ) {
			            if(response.success){
			                jQuery('.progress-value').addClass('animate-progress');
			                if(100 == response.count){
			                    jQuery('.progress-value').css('--progress-width', '100%');
			                    setTimeout(function(){
			                        alert('API Sync Successfully Done.')
			                        window.location.reload();
			                    }, 1000);
			                }else{
			                    jQuery('.progress-value').css('--progress-width', response.count+'%');
			                    progress_bar_action(response.count);
			                }
			            }
		              }
		           });
                }
		        progress_bar_action(20);
          } 
        });
    </script>
    <div style="text-align:center;margin-top:30px;">
        <h2 style="margin-bottom:35px;color:#fff;">Sync Blindmatrix v4 Application</h2>
        <?php 
        $display_run_now = true;
        if(as_next_scheduled_action( 'blindmatrix_v4_cron' )): 
            ?>
		    <div class="progress blindmatrix-progress-bar">
                <div class="progress-value"></div>
            </div>
		    <?php 
		    $display_run_now = false;  
		endif; ?>
		
        <a href="#" class="button blindmatrix-v4-run-now-action" style="background-color: #00c2ff !important;color:#fff !important;text-decoration:none;margin-top:30px;<?php echo !$display_run_now ? 'display:none;':'';?>">Run now</a>
    </div>
    <?php
    exit;
});

add_action('wp_ajax_blindmatrix_run_now_progress_bar_action','blindmatrix_run_now_progress_bar_action');
add_action('wp_ajax_nopriv_blindmatrix_run_now_progress_bar_action','blindmatrix_run_now_progress_bar_action');

function blindmatrix_run_now_progress_bar_action(){
    $count = absint($_POST['count']);
    if(as_next_scheduled_action( 'blindmatrix_v4_cron' )){
        $count = $count+20;
    }
    
    if($count >= 80){
        $count = 80;
    }
    
    if(!as_next_scheduled_action( 'blindmatrix_v4_cron' )){
        $count = 100;
    }
    echo wp_json_encode(array('count' => $count,'success' => true));
    exit;
}
add_action("wp_ajax_appointment_available_time_v4", "appointment_available_time_fn_v4");
add_action("wp_ajax_nopriv_appointment_available_time_v4", "appointment_available_time_fn_v4");

function appointment_available_time_fn_v4() {
    if (isset($_POST['value']) && isset($_POST['appointmenttypeid'])) {
        $date = date_create($_POST['value']);
        $date = date_format($date, "Y-m-d");
		if ( isset( $_POST['appointment_api_credentials'] ) ) {
			$appointment_api_credentials = $_POST['appointment_api_credentials']; 
		}
        $blindmatrix_appointment_args = array(
            'date' => $date,
            'appointmenttypeid' => $_POST['appointmenttypeid'],
        );

        $resultcontact = CallAPI_v4("POST", 'appointmentavailabletime', json_encode($blindmatrix_appointment_args), false, $appointment_api_credentials);

        if (is_string($resultcontact)) {
            $resultcontact = json_decode($resultcontact, true);
        }

        wp_send_json($resultcontact);
    } else {
        wp_send_json_error(["message" => "Invalid request"]);
    }

    wp_die(); 
}

add_action("wp_ajax_create_appointment_v4", "create_appointment_v4_fn");
add_action("wp_ajax_nopriv_create_appointment_v4", "create_appointment_v4_fn");

function create_appointment_v4_fn() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === "create_appointment_v4") {

        parse_str($_POST['value'], $parsedData);

        $firstname = $parsedData['firstname_ap'] ?? '';
        $lastname = $parsedData['lastname_ap'] ?? '';
        $billing_company = trim($firstname . ' ' . $lastname);
        $productsvalue = isset($parsedData['productsvalue']) ? stripslashes($parsedData['productsvalue']) : '';
        $appointment_type_name = isset($parsedData['appointment_type_name']) ? stripslashes($parsedData['appointment_type_name']) : '';
        $email_ap = $parsedData['email_ap'] ?? '';
		if ( isset( $_POST['appointment_api_credentials'] ) ) {
			$appointment_api_credentials =  $_POST['appointment_api_credentials']; 
		}
        $blindmatrix_appointment_args = array(
            'appointment_type'     => $parsedData['appointment_type'] ?? '',
            'billing_company'      => $billing_company,
            'appointment_users'    => $parsedData['appointment_users'] ?? '',
            'appointment_date'     => $parsedData['appointment_date'] ?? '',
            'appointment_time'     => $parsedData['appointment_time'] ?? '',
            'billing_first_name'   => $firstname,
            'billing_last_name'    => $lastname,
            'billing_email'        => $email_ap,
            'billing_phone'        => $parsedData['telephone_ap'] ?? '',
            'billing_address_1'    => $parsedData['address1_ap'] ?? '',
            'billing_address_2'    => $parsedData['address2_ap'] ?? '',
            'billing_city'         => $parsedData['city_ap'] ?? '',
            'billing_state'        => $parsedData['country_ap'] ?? '',
            'billing_postcode'     => $parsedData['postcode_ap'] ?? '',
            'source'               => $parsedData['source_ap'] ?? '',
            'description'          => $parsedData['message_ap'] ?? '',
            'selectedProducts'     => wp_unslash($productsvalue),
            'timezone'             => $_POST['timezone'] ?? 'UTC'
        );

        if (function_exists('CallAPI_v4')) {
            $resultappointment = CallAPI_v4("POST", 'createappointment', json_encode($blindmatrix_appointment_args), false, $appointment_api_credentials);

            $start_ap_n = date('h:i a', strtotime($parsedData['appointment_time']));
            $date = date_create($parsedData['appointment_date']);
            $date = date_format($date, "d-m-Y");

            ob_start();
            ?>
			<div style="font-size: 14px;">Dear <?php echo esc_html($firstname . ' ' . $lastname); ?>,</div>
			<div style="font-size: 14px;">
				Thank you for booking an <?php echo esc_html($appointment_type_name); ?> appointment with one of our designers.
			</div>
			<br>
			<div style="font-size: 14px;">
				Your appointment is scheduled for <?php echo esc_html($date); ?> at <?php echo esc_html($start_ap_n); ?>. Based on the details you have provided, we may contact you prior to the appointment to ensure we bring or prepare anything specific for our meeting.
			</div>
			<br>
			<div style="font-size: 14px;">
				If the date and time you selected become inconvenient, please let us know.
			</div>
			<br>
			<div style="font-size: 14px;">
				Thank you — we look forward to seeing you soon.
			</div>
		

            <?php
            $body = ob_get_clean();

            $headers = array('Content-Type: text/html; charset=UTF-8');

            if (!empty($email_ap)) {
                wp_mail($email_ap, 'Appointment Confirmation', $body, $headers);
            }

            $admin_email = get_option('admin_email');
            if (!empty($admin_email)) {
                wp_mail($admin_email, 'New Appointment Booking', $body, $headers);
            }

            header('Content-Type: application/json');
            echo json_encode($resultappointment);
        } else {
            wp_send_json_error([
                'message' => 'API function not found.'
            ]);
        }

        exit;
    } else {
        wp_send_json_error([
            'message' => 'Invalid request.'
        ]);
    }
}

	
	
