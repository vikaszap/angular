<?php
global $fabric_image_file_path;
global $image_file_path;
global $v4_product_page;
global $img_file_path_url;
global $sample_img_frame_url;  
global $v4_product_visualizer_page;
global $v4_visualizer_page_permalink;
$fieldscategoryname = get_query_var("fieldscategoryname");
$productslug        = get_query_var("productname");
$fabricid           = get_query_var("fabricid");
$fabricname         = urldecode(get_query_var("fabricname"));
$colorid            = get_query_var("colorid");
$pricegroup_id      = get_query_var("pricegroupid");
$supplier_id        = get_query_var("supplierid");
$matmapid           = get_query_var("mapid");
$_fabric_view       = $fabricname;
if('single_view' == $fabricname){
    $fabricname = '';
}

if('accessories' == $fieldscategoryname){
    //Accessories Product Visualizer
    include('accessories_view_v4.php');
    return;
}

$productname        = str_replace("-"," ",strtolower($productslug));
$product_list_page_link ='/'.$v4_product_page.'/'.$fieldscategoryname.'/'.$productslug.'/';
$v4_visualizer_page_permalink = site_url().'/'.$v4_product_visualizer_page.'/'.$fieldscategoryname.'/'.$productslug.'/'.$fabricname.'/'.$fabricid.'/'.$colorid.'/'.$matmapid.'/'.$pricegroup_id.'/'.$supplier_id;
//get product details
$product_list = blindmatrix_v4_get_product_list_data();
$id = array_search(strtolower($productname), array_map('strtolower', array_column($product_list, 'pei_ecomProductName')));
$_product_list_data = isset($product_list[$id]) ? $product_list[$id]:array();
$product_id = $product_list[$id]['pei_productid'];
$productcategoryid = $product_list[$id]['pi_category'];
$product_description = $product_list[$id]['pi_productdescription'];
$product_default_name = $product_list[$id]['label'];
$product_minimum_price = $product_list[$id]['minimum_price'];
$ecomFreeSample = $product_list[$id]['pei_ecomFreeSample'];
$ecomsampleprice = $product_list[$id]['pei_ecomsampleprice'];
$product_specs = isset($product_list[$id]['pei_prospec']) ? $product_list[$id]['pei_prospec']:'' ;
$recipeid     = isset($product_list[$id]['recipeid']) ? $product_list[$id]['recipeid']:'' ;
$option_data = get_option('blindmatrix_v4_option_data');
$ecomFreeSample = $product_list[$id]['pei_ecomFreeSample'];
$v4_productlist_option_arr   = blindmatrix_v4_get_product_list_data();
$chosen_product_data 		 = isset($v4_productlist_option_arr[$id]) ? $v4_productlist_option_arr[$id]:array();
if($productcategoryid == 3){
   $delivery_duration = isset($option_data['product_spec']['blinds_with_fabrics'][$product_id]['delivery_duration']) ? $option_data['product_spec']['blinds_with_fabrics'][$product_id]['delivery_duration']:NUll;
   $visualizertagline = isset($option_data['product_spec']['blinds_with_fabrics'][$product_id]['visualizertagline']) ? $option_data['product_spec']['blinds_with_fabrics'][$product_id]['visualizertagline']:NUll;
   $fieldscategoryid = 5;
  }elseif($productcategoryid == 4){
    $delivery_duration = isset($option_data['product_spec']['blinds_with_slates'][$product_id]['delivery_duration']) ? $option_data['product_spec']['blinds_with_slates'][$product_id]['delivery_duration']:NUll;
    $visualizertagline = isset($option_data['product_spec']['blinds_with_slates'][$product_id]['visualizertagline']) ? $option_data['product_spec']['blinds_with_slates'][$product_id]['visualizertagline']:NUll;
    $fieldscategoryid = 20;
  }
//get unit data
$unit_result    = blindmatrix_v4_unittype_data($product_id);
$unit_type_data = json_decode(json_encode($unit_result->result->unittype), true);

$_fabric_args           =  array(
//	'related_fabric' => $fabricid,
	'matmapid'       => $matmapid,
	'colorid'        => $colorid,
);
//get color data
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

$mode                           = 'productEdit/'.$product_id;  
$product_edit_list_data_obj     = CallAPI_v4("POST",$mode,json_encode(array('mode' => 'view')));
$netpricecomesfrom              = !empty($product_edit_list_data_obj->result->netpricecomesfrom) ? $product_edit_list_data_obj->result->netpricecomesfrom:'';
$costpricecomesfrom             = !empty($product_edit_list_data_obj->result->costpricecomesfrom) ? $product_edit_list_data_obj->result->costpricecomesfrom :'';

if( $productcategoryid == 3){
    $fieldtypeid = 5;
}
else if($productcategoryid == 4){
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

$parameters_arr_response   = CallAPI_v4("GET",'products/fields/withdefault/list/'.$recipeid.'/1/0',false,true);
$productionformuladata     = $parameters_arr_response['0']->productionformuladata;
$parameters_arr            = $parameters_arr_response['0']->data;
$matched_supplier_name     = '';
if(!empty($parameters_arr) && is_array($parameters_arr)){
    foreach($parameters_arr as $_parameter_data){
       $_parameter_data = (array) $_parameter_data;
       if(isset($_parameter_data['fieldtypeid']) && '17' == $_parameter_data['fieldtypeid']){
           // Supplier
           $supplier_id           = !empty($_parameter_data["optiondefault"]) ? $_parameter_data["optiondefault"]:'';
           $options_value         = !empty($_parameter_data['optionsvalue']) ?  $_parameter_data['optionsvalue']:array();
           $options_value_arr     = json_decode(json_encode($options_value), true);
           $index                 = array_search($supplier_id, array_column($options_value_arr, 'id'));
           $option_name           = isset($options_value_arr[$index]['optionname']) ? $options_value_arr[$index]['optionname']:'';
           if($option_name){
               $matched_supplier_name  = $option_name;
           }
       }
       
       if(isset($_parameter_data['fieldtypeid']) && '13' == $_parameter_data['fieldtypeid']){
           // Product Type
           $pricegroup_id = !empty($_parameter_data["optiondefault"]) ? $_parameter_data["optiondefault"]:'';
       }
    }
}

// $_color_args = array(
//      'matmapid'       => $matmapid,
//      'fabricid'       => $fabricid,
//      'colorid'        => $colorid,
// );
// $color_arr = blindmatrix_v4_get_all_fabric_and_color_products($product_id,$fieldscategoryid,$_color_args);

//get fraction data
$inchfraction_array = array();
if(3 != $unit_result->result->jobfraction){
    $inchfraction_array = blindmatrix_v4_unittype_inch_fraction_data($product_id);
}
$color_arr = $color_arr[0];
$product_minimum_price  = $color_arr['minprice'];
$min_width = $color_arr['minwidth'];
$max_width = $color_arr['maxwidth'];
$min_drop  = $color_arr['mindrop'];
$max_drop  = $color_arr['maxdrop'];
$pricetable_maxwidth = !empty($color_arr['pricetable_maxwidth']) ? floatval($color_arr['pricetable_maxwidth']):0;
if(empty($max_width) && !empty($pricetable_maxwidth)){
	$max_width = $pricetable_maxwidth;
}
$pricetable_maxdrop  = !empty($color_arr['pricetable_maxdrop']) ? floatval($color_arr['pricetable_maxdrop']):0;
if(empty($max_drop) && !empty($pricetable_maxdrop)){
	$max_drop = $pricetable_maxdrop;
}
$placeholder_text = '';
if($min_width){
	$placeholder_text = 'Min - '.$min_width;
}
if($max_width){
	$placeholder_text = '' != $min_width ? $placeholder_text.' & ' : $placeholder_text; 
	$placeholder_text = $placeholder_text. 'Max - '.$max_width;
}
    $color_imag_url = $fabric_image_file_path.$color_arr['colorimage'];
    $unit_cost = $color_arr['unitcost'];
    $supplier_name = $color_arr['pricetablesupplier'];
// get all form data
    // $parameters_arr = blindmatrix_v4_stored_parameters_data($product_id);
// get tax data
    $tax_list_response_arr = blindmatrix_v4_taxlist();
    $chosen_tax_arr_key    = array_search(1, array_column($tax_list_response_arr, 'isDefault'));
    $chosen_tax_arr        = isset($tax_list_response_arr[$chosen_tax_arr_key]) ? $tax_list_response_arr[$chosen_tax_arr_key]:array();
    $background_color_image_url = $color_imag_url;
    // get selected background image
    $mainframe = !empty($product_list[$id]["visualizer_url"])? $product_list[$id]["visualizer_url"]:'';
    // get selected frame image
     $productlisting_frame_url   = !empty($product_list[$id]["frame_url"])? $product_list[$id]["frame_url"]:'';
    // get color field data
    $color_field_data    = array(
		'fieldId'        => isset($color_field_data['fieldId']) ? $color_field_data['fieldId']:'' ,
		'fieldName'      => isset($color_field_data['fieldName']) ? $color_field_data['fieldName']:'',
		'fieldCode'      => isset($color_field_data['fieldCode']) ? $color_field_data['fieldCode']:'',
		'fabricorcolor'  => isset($color_field_data['fabricorcolor']) ? $color_field_data['fabricorcolor']:'',
		'dualseq'        => isset($color_field_data['dualseq']) ? $color_field_data['dualseq']:'',
		'fieldType'      => isset($color_field_data['fieldType']) ? $color_field_data['fieldType']:'',
		'fieldLevel'     => isset($color_field_data['fieldLevel']) ? $color_field_data['fieldLevel']:''
	);
	// product data array 
    $product_details_arr = array(
        'Supplier'     => $supplier_name,
        'Product'      => $productname, 
        "Product Type" => isset($color_arr['prices']) ? $color_arr['prices']:'-',
        'Supplier' 	   => $supplier_name,
        'Fabric' 	   => isset($color_arr['fabricname']) ? $color_arr['fabricname']:'-',
        'Color' 	   => isset($color_arr['colorname']) ? $color_arr['colorname']:'-',   
    );
	if(isset($color_arr['category']) && '3' != $color_arr['category']){
		unset($product_details_arr['Fabric']);
	}
	$fabric_linked_color_data = array();
	$_fabric_args           =  array(
		'related_fabric' => $fabricid,
		'matmapid'       => $matmapid,
		'colorid'        => $colorid,
	);

	blindmatrix_v4_set_all_fabric_and_color_products($product_id,$fieldscategoryid,array_merge(array('showall' => true ),$_fabric_args));
	$related_products_list_data        = blindmatrix_v4_get_all_fabric_and_color_products($product_id,$fieldscategoryid,$_fabric_args);
	if(!empty($color_arr['fd_id']) && is_array($fabric_list) && !empty($fabric_list)){
	    $fabric_id = $color_arr['fd_id'];
	    foreach($fabric_list as $fabric_list_val){
	        if(!empty($fabric_list_val['fd_id']) && $fabric_id == $fabric_list_val['fd_id']){
	            $fabric_linked_color_data[$fabric_id][] = $fabric_list_val;
	        }
	    }
	}else{
		
		$colordatalist = $related_products_list_data;
		$exists = false;
		foreach ($colordatalist as $item) {
			if ($item['matmapid'] == $color_arr['matmapid']) {
				$exists = true;
				break;
			}
		}

		if (!$exists) {
			$colordatalist[] = $color_arr;
		}

		$fabric_linked_color_data[0] = $colordatalist;
	}

$blindmatrix_v4_option_data =  get_option('blindmatrix_v4_option_data');
$_category_name 			= '';
if('3' == $productcategoryid){
	$_category_name = 'blinds_with_fabrics';
}
		
if('4' == $productcategoryid){
	$_category_name = 'blinds_with_slates';
}

$hide_frame = false;
if(isset($blindmatrix_v4_option_data['product_spec'][$_category_name][$product_id]["hide_frame_visualizer"]) && 'on' == $blindmatrix_v4_option_data['product_spec'][$_category_name][$product_id]["hide_frame_visualizer"]){
	$hide_frame = true;
}

$stored_cart_item_key                = isset($_GET['cart_item_key']) ? $_GET['cart_item_key']:'';
$_cart_item                          = WC()->cart->get_cart_item($stored_cart_item_key);
$cart_blindmatrix_v4_parameters_data = !empty($_cart_item['blindmatrix_v4_parameters_data']) ? $_cart_item['blindmatrix_v4_parameters_data']:array();  
if('' != $matched_supplier_name){
    $supplier_name = $matched_supplier_name;
}
?>

<form name="blindmatrix_v4_parameters_form" id="blindmatrix_v4_parameters_form" class="tooltip-container blindmatrix-v4-parameters-form cart <?php echo in_array($productcategoryid,array('3','4')) ? 'blinds-parameters-form':''; ?>" action="" method="post" enctype="multipart/form-data">
<input type='hidden' id="color_array" name="blindmatrix_v4_parameters_data[color_array]" value='<?php echo wp_json_encode($color_arr); ?>' />
<input type='hidden' id="listcolorfields" name="blindmatrix_v4_parameters_data[listcolorfields]" value='<?php echo wp_json_encode($color_field_data); ?>' />
<input type='hidden' id="fabric_and_color_name" name="blindmatrix_v4_parameters_data[fabric_and_color_name]" value="<?php echo (ucwords(str_replace('-',' ',$fabricname))); ?>" />
<input type='hidden' id="fabricname" name="blindmatrix_v4_parameters_data[fabricname]" value="<?php echo $color_arr['fabricname']; ?>" />
<input type='hidden' id="colorname" name="blindmatrix_v4_parameters_data[colorname]" value="<?php echo $color_arr['colorname']; ?>" />
<input type='hidden' id="pricetablesupplier" name="blindmatrix_v4_parameters_data[pricetablesupplier]" value="<?php echo $color_arr['pricetablesupplier']; ?>" />
<input type='hidden' id="category" name="blindmatrix_v4_parameters_data[category]" value="<?php echo $color_arr['category']; ?>" />
<input type='hidden' id="pricing_group_type" name="blindmatrix_v4_parameters_data[pricing_group_type]" value="<?php echo $color_arr['prices']; ?>" />
<input type='hidden' id="matmapid" name="blindmatrix_v4_parameters_data[matmapid]" value="<?php echo $matmapid; ?>" />
<input type='hidden' id="productname" name="blindmatrix_v4_parameters_data[productname]" value="<?php echo ucwords($productname); ?>" />
<input type='hidden' id="product_default_name" name="blindmatrix_v4_parameters_data[product_default_name]" value="<?php echo ($product_default_name); ?>" />
<input type='hidden' id="overallproductname" name="blindmatrix_v4_parameters_data[overallproductname]" value="<?php echo !empty($fabricname) ? ucwords($productname).' - ':ucwords($productname); ?><?php echo !empty($fabricname) ? ucwords(str_replace('-',' ',$fabricname)):''; ?>" />
<input type='hidden' id="fieldscategoryname" name="blindmatrix_v4_parameters_data[fieldscategoryname]" value="<?php echo ucwords(str_replace('-',' ',$fieldscategoryname)); ?>" />
<input type='hidden' id="product_id" name="blindmatrix_v4_parameters_data[product_id]" value="<?php echo($product_id); ?>" />
<input type='hidden' id="fabricid" name="blindmatrix_v4_parameters_data[fabricid]" value="<?php echo($fabricid); ?>" />
<input type='hidden' id="colorid" name="blindmatrix_v4_parameters_data[colorid]" value="<?php echo($colorid); ?>" />
<input type='hidden' id="rules_cost_price_comes_from" name="blindmatrix_v4_parameters_data[rules_cost_price_comes_from]" value="<?php echo $costpricecomesfrom; ?>" />
<input type='hidden' id="rules_net_price_comes_from" name="blindmatrix_v4_parameters_data[rules_net_price_comes_from]" value="<?php echo $netpricecomesfrom; ?>" />
<input type='hidden' id="vatvat_percentageprice" name="blindmatrix_v4_parameters_data[vat_percentage]" value="<?php echo esc_attr(!empty($chosen_tax_arr['taxValue']) ? $chosen_tax_arr['taxValue']:''); ?>" />
<input type='hidden' id="chosen_tax_data" name="blindmatrix_v4_parameters_data[chosen_tax_data]" value="<?php echo esc_attr(!empty($chosen_tax_arr) ? json_encode($chosen_tax_arr):''); ?>" />
<input type='hidden' id="vatproduct_typeprice" name="blindmatrix_v4_parameters_data[product_type]" value="<?php echo($pricegroup_id); ?>" />
<input type='hidden' id="supplier_id" name="blindmatrix_v4_parameters_data[supplier_id]" value="<?php echo ($supplier_id); ?>" />
<input type='hidden' id="supplier_name" name="blindmatrix_v4_parameters_data[supplier_name]" value="<?php echo ($supplier_name); ?>" />
<input type='hidden' id="unitlabel" name="blindmatrix_v4_parameters_data[unitlabel]" value="Unit Type"/>
<input type='hidden' id="min_width" name="blindmatrix_v4_parameters_data[min_width]" value="<?php echo ($min_width); ?>" />
<input type='hidden' id="max_width" name="blindmatrix_v4_parameters_data[max_width]" value="<?php echo ($max_width); ?>" />
<input type='hidden' id="min_drop" name="blindmatrix_v4_parameters_data[min_drop]" value="<?php echo ($min_drop); ?>" />
<input type='hidden' id="max_drop" name="blindmatrix_v4_parameters_data[max_drop]" value="<?php echo ($max_drop); ?>" />
<input type='hidden' id="unittype" name="blindmatrix_v4_parameters_data[unittype]" value="" />
<input type='hidden' id="finalcostprice" name="blindmatrix_v4_parameters_data[finalcostprice]" value="" />
<input type='hidden' id="finalnetprice" name="blindmatrix_v4_parameters_data[finalnetprice]" value="" />
<input type='hidden' id="costprice" name="blindmatrix_v4_parameters_data[costprice]" value="" />
<input type='hidden' id="grossprice" name="blindmatrix_v4_parameters_data[grossprice]" value="" />
<input type='hidden' id="netprice" name="blindmatrix_v4_parameters_data[netprice]" value="" />
<input type='hidden' id="vatprice" name="blindmatrix_v4_parameters_data[vatprice]" value="" />
<input type='hidden' id="ecomsampleprice" name="blindmatrix_v4_parameters_data[ecomsampleprice]" value="<?php echo $ecomsampleprice; ?>" />
<input type='hidden' id="ecomFreeSample" name="blindmatrix_v4_parameters_data[ecomFreeSample]" value="<?php echo $ecomFreeSample; ?>" />
<input type='hidden' id="hide_visualizer_frame" name="blindmatrix_v4_parameters_data[hide_visualizer_frame]" value="<?php echo $hide_frame ? 'yes':'no'; ?>" />	
<input type='hidden' id="stored_cart_item_key" name="blindmatrix_v4_parameters_data[stored_cart_item_key]" value="<?php echo $stored_cart_item_key; ?>" />
<input type='hidden' id="recipeid" name="blindmatrix_v4_parameters_data[recipeid]" value="<?php echo $recipeid; ?>" />
<input type='hidden' id="blindmatrix_v4_list_changed_on_load" name="blindmatrix_v4_parameters_data[list_changed]">
    <div class="w-100 blinds container p-sm-0"  style="max-width: 1250px;" >
        <div class="productaname py-3">
            <a href="<?php echo($product_list_page_link);?>" target="_self" class="lowercase fw-bold mb-1">
            <i class="fa-solid fa-angle-left"></i>  <span>Back to <?php echo ucwords($productname); ?></span>
            </a>
            <h1 class="product-title product_title entry-title prodescprotitle"><span class="setcolorname fw-bolder fst-italic"><?php echo !empty($fabricname) ? ucwords($productname).' - ' : ucwords($productname); ?><?php echo ucwords(str_replace('-',' ',$fabricname)); ?></span></h1>
        </div>
        <div id="configurator-root" class="product_visualizer_wrapper">
            <div class="d-md-flex gap-2 flex-nowrap" >
                <div class="col-md-6 col-sm-12 position-relative overflow-visible" style="box-shadow: 1px 0 5px #ccc; border-radius:10px" >
                    <div class="position-sticky sticky-top z-0">
                    <div class="product_preview">
                        <div id="main-img" class="configuratorpreviewimage" >
							<?php 
							if(!$hide_frame):
							?>
                            	<img decoding="async" class="configurator-main-headertype" src="<?php echo($mainframe);?>" style="border-radius: 10px; background-image: url(<?php echo($background_color_image_url);?>);" alt="blinds image">
							<?php 
							else:
								?>
								<img decoding="async" class="configurator-main-headertype" src="<?php echo($background_color_image_url);?>" style="border-radius: 10px; ;" alt="blinds image">
								<?php
							endif;
							?>
                            <input type='hidden' id="fabric_img_url" name="blindmatrix_v4_parameters_data[fabric_img_url]" value="<?php echo($background_color_image_url);?>" />  
                            <p class="preview-desc blinds">  Diagram is for illustration only. </p>
                        </div>
                    </div>
					  <?php if(!$hide_frame): ?>
                        <!-- Slider -->
                        <div class="col-md-12 slider-container position-relative my-2 py-2 border-top-1">
                            <div class="blindmatrix-v4-slider ">
                                <?php
                                    $product_img_array     = json_decode($product_list[$id]["pi_backgroundimage"],true);    
                                    $product_deafultimage  = json_decode($product_list[$id]["pi_deafultimage"],true);  
                                $frame_img_count = 0;
                                foreach( $product_img_array as $product_img):
                                    $selected_frame='';
                                    $frame_img_count+=1;
                                        $frame_file_path_url = $image_file_path.$product_img;
                                        if(isset($product_deafultimage['defaultimage']['backgrounddefault']) && $product_deafultimage['defaultimage']['backgrounddefault'] != ""){
                                            if (strpos($product_img, $product_deafultimage['defaultimage']['backgrounddefault']) != false) {
                                                $selected_frame = 'selected_frame';
                                            }
                                        }
                                        $product_img_upload  = $image_file_path.$product_img;
                                        if ( is_wp_error( $product_img_upload ) ) {
                                           continue;
                                        }
                                    ?>
                                    <div>
                                        <a class="multiple-frame-list-button <?php echo( $selected_frame);?>">
                                            <img src="<?php echo($frame_file_path_url);?>" alt=""  width="200" height="100" style="border-radius: 10px; background-image: url(<?php echo($background_color_image_url);?>);" />
                                        </a>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                            <!-- control arrows -->
                           <?php if(3 < $frame_img_count): ?>
                            <div class="prev">
                                <span class="glyphicon icon-left" aria-hidden="true">&#11164;</span>
                            </div>
                            <div class="next">
                                <span class="glyphicon icon-right" aria-hidden="true">&#11166;</span>
                            </div>
                            <?php endif ?>
                        </div>
					   <?php endif; ?>
                    </div>
                </div>
             <!--   product parameters start-->
            <div class="product-wrapper col-md-6 col-sm-12">
                <div class="product-from-price position-relative">
                    <div class=" d-flex justify-content-between position-absolute w-100 cusoffsec" style="top: -30px; ">
                        <p style="<?php echo ( !is_null($visualizertagline) && empty($visualizertagline))?"visibility:hidden":"";?>" class="bm-spec-tagline-minprice"><?php  echo (is_null($visualizertagline) || empty($visualizertagline))?"Transform Your Windows With ".ucwords($productname):$visualizertagline;?></p>
                        <p class="price product-page-price mb-0 proprice" style="<?php echo 'single_view' == $_fabric_view ? 'display:none': 'display:block'; ?>"><span class="bm-spec-tagline-minprice" style='color:var(--color-primary);'> From </span><span class="bm-min-product-price"><?php echo wc_price($product_minimum_price); ?></span></p>
                    </div>
                </div>
                <div class="product-info ">
                <div class='blindmatrix-v4-error-messages-wrapper'></div>
                    <h3 class="text-center fs-5 fw-bolder" >Please enter your measurements</h3>
                    <!-- unit select section -->
                    <div class="blinds-measurement" >
                        <div colspan="2" class="value" >
                            <span class="form-control-wrap ">
                                <span class="d-flex radio" >
                                    <?php 
                                    if(!empty($unit_type_data) && is_array($unit_type_data)):
                                    foreach ($unit_type_data as $unit_type):
                                        $unit_name = $unit_type['name'];
                                        $unit_id = $unit_type['id'];
                                        $unit_select='';
                                        if($unit_type['defaultid'] != 0){
                                            $unit_select='checked';
                                        }
                                        if(0 == $unit_type['hideshow']){
                                            continue;
                                        }
                                        ?>
                                        <span class="list-item">
                                            <label class='align-middle'>
                                                <input class="blindmatrix_v4_parameters_data align-middle" name="blindmatrix_v4_parameters_data[unit]" data-id="<?php echo($unit_id);?>" class="js-unit" value="<?php echo($unit_name);?>" <?php echo($unit_select);?> type="radio">
                                                <span class="list-item-label fw-bolder"><?php echo($unit_name);?></span>
                                            </label>
                                        </span>
                                    <?php endforeach;
                                    endif; ?>
                                </span>
                            </span>
                        </div>
                    </div>
                <!-- parameters listing section -->
             <?php
               $blindmatrix_menu_type = get_option('blindmatrix_menu_type', 'on_top');        
                if('on_top' == $blindmatrix_menu_type){
                    $parameters_arr_swap = array('width', 'height'); // Initialize array with 'width' and 'height'
                    foreach ($parameters_arr as $parameter) {
                        $parameter       = (array) $parameter;
                        $field_type_id = isset($parameter['fieldtypeid']) ? $parameter['fieldtypeid'] : '';
                        if ($field_type_id == 11) {
                            $parameters_arr_swap[0] = $parameter;
                        } elseif ($field_type_id == 12) {
                            $parameters_arr_swap[1] = $parameter;
                        } else {
                            $parameters_arr_swap[] = $parameter;
                        }
                    }
                }else{
                    $parameters_arr_swap = $parameters_arr; 
                }     
                $parameter_count = 0;
                foreach($parameters_arr_swap as $parameter){
                    $parameter               = (array) $parameter;
                    $showFieldOnEcommerce    = isset($parameter['showfieldecomonjob'])? $parameter['showfieldecomonjob'] :'';
                    $field_type_id           = isset($parameter['fieldtypeid'])? $parameter['fieldtypeid'] :'';
                    $field_name              = isset($parameter['fieldname'])? $parameter['fieldname'] :'';
                    $field_id                = isset($parameter['fieldid'])? $parameter['fieldid'] :'';
					$default_option          = isset($parameter['optiondefault'])?$parameter['optiondefault']:'';
                    $multiple                = isset($parameter['selection']) ? $parameter['selection'] : '';
                    $mandatory               = isset($parameter['mandatory'])? $parameter['mandatory'] :'';
                    $mandatory               = ('1' == $mandatory) ? 'on':'off';
                    $field_information       = isset($parameter['fieldInformation'])? $parameter['fieldInformation'] :'';
                    $field_level             = isset($parameter['fieldlevel'])? $parameter['fieldlevel'] :'';
                    $field_has_sub_option    = isset($parameter['field_has_sub_option'])? $parameter['field_has_sub_option'] : 0 ;      
                    $ruleoverride            = isset($parameter['ruleoverride'])? $parameter['ruleoverride'] : '' ;  
                    $css                     = '';
                    if(!$field_type_id || !$field_name || !$field_id){
                        continue;
                    }
                    
                    if(0 === $showFieldOnEcommerce && !in_array($field_type_id,array('13','17','14','5','34')) ){
                        continue;
                    }
                    
                    $extra_class ='w-75 rounded-3';
                    $extra_wrapper_class = '';
                    $bootstrap_class = ' d-flex justify-content-between align-items-center my-2 py-2 ';
                    $options = array();
                    $fraction_array = array();
                    $options_data = array();
                    $custom_attributes = array();
                    $custom_attributes_final = array();
                    $placeholder_attr = '';
					$extra_data = array();
					$widthdrop_img_array = array();
					$error_message = '';
                    if(11 == $field_type_id){
                        $widthdrop_img_array['src'] = plugin_dir_url( __FILE__ ).'images/arrow.png';
                        $extra_class ='blindmatrix-v4-width-val w-68 rounded-end';
                        $custom_attributes = array(
                            'min' => $min_width,
                            'max' => $max_width,
                        );
                        $placeholder_attr = $placeholder_text;
                        $fraction_array['data'] = $inchfraction_array;
                        $fraction_array['name'] = 'widthfraction';
                        $widthdrop_img_array['name'] = 'width measurement';
                        $widthdrop_img_array['class'] = 'width-measure-icon measure-icon';
                        
                        $error_message = $placeholder_attr;
                    }
                    if(12 == $field_type_id){
                        $widthdrop_img_array['src'] = plugin_dir_url( __FILE__ ).'images/arrow.png';
                        $extra_class ='blindmatrix-v4-drop-val w-68 rounded-end';
                        $custom_attributes = array(
                            'min' => $min_drop,
                            'max' => $max_drop,
                        );
                        $placeholder_attr = $placeholder_text;
                        $fraction_array['data'] = $inchfraction_array;
                        $fraction_array['name'] = 'dropfraction';
                        $widthdrop_img_array['name'] = 'drop measurement';
                        $widthdrop_img_array['class'] = 'drop-measure-icon measure-icon';
                        
                        $error_message = $placeholder_attr;
                    }
                    if(5 == $field_type_id || 13 == $field_type_id || 14 == $field_type_id || 17 == $field_type_id || 20 == $field_type_id){
                        $extra_wrapper_class ='blindmatrix-v4-parameter-wrapper-hidden';
                    }
                    
                    if(0 === $ruleoverride){
                        $custom_attributes = array_merge($custom_attributes,array('readonly' => true));
                        $css               = 'cursor: not-allowed; background: #eee;';
                    }
                    
                    if(20 == $field_type_id){
                        // Blinds with slates field.
                        $post_Data = array(
                            "filterids" => isset($filterids_data_arr['optionarray'][$field_id]) && is_array($filterids_data_arr['optionarray'][$field_id]) ? $filterids_data_arr['optionarray'][$field_id]:array(), 
                            "productionformulalist" => array(),
                            "productid" => $product_id,
                        );
                        
                        $blinds_with_slates_sub_result_data_arr = CallAPI_v4("POST",'products/get/fabric/options/list/'.$recipeid.'/1/0/'.$field_type_id.'/0/'.$field_id.'/?perpage=50',json_encode($post_Data),true);
                        $blinds_with_slates_result_data_arr     = $blinds_with_slates_sub_result_data_arr[0]->data[0]->optionsvalue;
                        if(empty($blinds_with_slates_result_data_arr) || !is_array($blinds_with_slates_result_data_arr)){
                            continue;
                        }
                        
                        $parameter['optionsvalue']  = $blinds_with_slates_result_data_arr; 
                        $parameter['optionsbackup'] = $blinds_with_slates_result_data_arr; 
                    }
                    
                    if(5 == $field_type_id){
                        // Blinds with fabrics field.
                        $post_Data = array(
                            "filterids" => isset($filterids_data_arr['optionarray'][$field_id]) && is_array($filterids_data_arr['optionarray'][$field_id]) ? $filterids_data_arr['optionarray'][$field_id]:array(), 
                            "productionformulalist" => array(),
                            "productid" => $product_id,
                        );
                        
                        $blinds_with_fabrics_sub_result_data_arr = CallAPI_v4("POST",'products/get/fabric/options/list/'.$recipeid.'/1/0/'.$field_type_id.'/0/'.$field_id.'/?perpage=50',json_encode($post_Data),true);
                        $blinds_with_fabrics_result_data_arr     = $blinds_with_fabrics_sub_result_data_arr[0]->data[0]->optionsvalue;
                        if(empty($blinds_with_fabrics_result_data_arr) || !is_array($blinds_with_fabrics_result_data_arr)){
                            continue;
                        }
                        
                        $_data = array(
                                "pricegroupid" => $pricegroup_id,
                                "supplierid" => $supplier_id,
                                "productid" => $product_id,
                                "optionid" => array($fabricid),
                                "subfieldoptionlinkid" => array($fabricid),
                                "productionformulalist" => array(),
                                "orderitemselectedvalues" => array(
                                    $field_id => array($fabricid)
                                ),
                        );
                        
                        $blinds_with_fabrics_color_result_data_arr = CallAPI_v4("POST",'products/fields/list/0/'.$recipeid.'/2/'.$field_type_id.'/'.$field_id,json_encode($_data),true);
                        $blinds_with_fabrics_color_result_data_arr  = json_decode(json_encode($blinds_with_fabrics_color_result_data_arr['0']->data), true);

                        if(!empty($blinds_with_fabrics_color_result_data_arr) && is_array($blinds_with_fabrics_color_result_data_arr)){
                            $parameter['subchild']  = $blinds_with_fabrics_color_result_data_arr; 
                        }
                        
                        $parameter['optionsvalue']  = $blinds_with_fabrics_result_data_arr; 
                        $parameter['optionsbackup'] = $blinds_with_fabrics_result_data_arr;
                    }
                    
                    $input_class = "blindmatrix-v4-input  m-0  $extra_class";
                    $wrapper_class = "blindmatrix-v4-parameter-wrapper $extra_wrapper_class";
                    $hidden_items = array(
                       array(
                            'class' => 'label',
                            'name'      => "blindmatrix_v4_parameters_data[$field_type_id][$field_id][label]",
                            'value'     => $field_name,
                       ),
                       array(
                             'class' => 'field_data',
                             'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$field_id][field_data]",
                             'value' => json_encode($parameter),
                       )
                    );
                    $input_name = "blindmatrix_v4_parameters_data[$field_type_id][$field_id][value]";
                    if(3 == $field_type_id){
                        $post_Data = array(
                            "filterids" => 3 == $field_type_id && isset($filterids_data_arr['optionarray'][$field_id]) && is_array($filterids_data_arr['optionarray'][$field_id]) ? $filterids_data_arr['optionarray'][$field_id]:array(), 
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
                        
                        // $result_data_arr = blindmatrix_v4_list_type_parameter_data($product_id,$field_id);
                        //  if(empty($result_data_arr['result'] || !is_array($result_data_arr['result']))){
                        //     continue;
                        // }
                        // $result_count = !empty($result_data_arr['result']) && is_array($result_data_arr['result']) ? count($result_data_arr['result']):0;
                        // $temp_count   = 0;
                        // foreach($result_data_arr['result'] as $sub_comp_value){
                        //     $customerType_data = !empty($sub_comp_value['customerType']) ? json_decode($sub_comp_value['customerType'],true):array();
                        //     $show_ecommerce = isset($customerType_data[4]) ? $customerType_data[4]:false;
                        //     if(!$show_ecommerce){
                        //         $temp_count++; 
                        //     }
                        // }
                        // if($result_count == $temp_count){
                        //     continue;
                        // }
                        $hidden_items = array(
                            array(
                                'class' => 'label',
                                'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$field_id][label]",
                                'value' => $field_name,
                            ),
                            array(
                                'class' => 'value',
                                'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$field_id][value]",
                                'value' => '',
                            ),
                            array(
                                'class' => 'field_data',
                                'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$field_id][field_data]",
                                'value' => json_encode($parameter),
                            ),
                            array(
                                'class' => 'option_data',
                                'name'  => "blindmatrix_v4_parameters_data[$field_type_id][$field_id][option_data]",
                                'value' => json_encode($result_data_arr),
                            )
                        );
                        foreach ($result_data_arr as $list_value) {
                            $list_value             = (array) $list_value;
                            $show_ecommerce         = !empty($list_value['availableForEcommerce']) ? $list_value['availableForEcommerce']:0;
                            if(!$show_ecommerce){
                                continue;
                            }
                            
			    	// 		$customerType_data      = !empty($list_value['customerType']) ? json_decode($list_value['customerType'],true):array();
			    	// 		$show_ecommerce         = isset($customerType_data[4]) ? $customerType_data[4]:false;
                            $id                     = isset($list_value['fieldoptionlinkid']) ? $list_value['fieldoptionlinkid']:'';
                            $option_name            = isset($list_value['optionname']) ? $list_value['optionname']:'';
                            $option_image_url       = isset($list_value['optionimage']) ? $list_value['optionimage']:'';
                            $option_id              = isset($list_value['optionid']) ? $list_value['optionid']:'';
                            $option_qty             = isset($list_value['optionqty']) ? $list_value['optionqty']:'1';
                            if(!$option_id || !$option_name){
                                continue;
                            }
                            $options[$id] = $option_name;
                            $option_image_url = str_replace('/storage','',$option_image_url);
                            $option_image_url = ltrim($option_image_url,'/');
                            $options_data[$id]['img_url'] = '';
                            if($option_image_url){
                                $options_data[$id]['img_url'] = $img_file_path_url.$option_image_url;
                            }
                           $options_data[$id]['field_id'] = $id;
                            $options_data[$id]['option_id'] = $option_id;
							$extra_data[$id]['option_id'] = $option_id;
                        }
                        $multiple_attr_class = 1 == $multiple ? 'blindmatrix-multiple-select2':'';
                        $input_class = "w-75 m-0 rounded-3 blindmatrix-v4-select2 $multiple_attr_class";
                        $input_name = "blindmatrix_v4_parameters_data[$field_type_id][$field_id][chosen_options][]";
                    }
                    
                    $cart_blindmatrix_v4_parameter_value = !empty($cart_blindmatrix_v4_parameters_data[$field_type_id][$field_id]['value']) ? $cart_blindmatrix_v4_parameters_data[$field_type_id][$field_id]['value']:array();
                    if(!empty($cart_blindmatrix_v4_parameters_data[$field_type_id][$field_id]['chosen_options'])){
                        $cart_blindmatrix_v4_parameter_value = $cart_blindmatrix_v4_parameters_data[$field_type_id][$field_id]['chosen_options'];
                    }
                    
                    $field_args = array(
                        'input_class'       => $input_class,
                        'wrapper_class'     => $wrapper_class,
                        'bootstrap_class'   => $bootstrap_class,
                        'label'             => $field_name,
                        'label_information' => $field_information,
                        'placeholder'       => $placeholder_attr,
                        'name'              => $input_name,
                        'mandatory'         => $mandatory,
                        'custom_attributes' => $custom_attributes,
                        'options'           => $options,
                        'options_data'      => $options_data,
                        'default'           => $default_option,
                        'description'       => '',
                        'value'             => '',
                        'stored_value'      => !empty($cart_blindmatrix_v4_parameter_value) ? $cart_blindmatrix_v4_parameter_value :'',
                        'multiple'          => $multiple,
                        'data'              => array(
                            'field_type_id'         => $field_type_id,
                            'field_id'              => $field_id,
                            'category_id'           => $productcategoryid,
                            'fieldlevel'            => $field_level,
                            'field_has_sub_option'  => $field_has_sub_option,
                            'recipeid'              => $recipeid,
                        ),
                        'css'               => $css,
                        'hidden_items'      => $hidden_items,
						'extra_data'        => $extra_data,
                        'fraction_array'    => $fraction_array,
                        'wd_img_array'      => $widthdrop_img_array,
                        'error_message'     => $error_message,
                    );
                    echo get_blindmatrix_v4_parameters_HTML($field_type_id,$field_args);
                    
                        if(3 == $parameter_count && 'single_view' != $_fabric_view){
                            $free_sample_args = array(
							    'pei_productid' 	   => $product_id,
							    'free_sample_price'    => $ecomsampleprice,
							    'chosen_product_data'  => $_product_list_data,
							    'parameters_arr' 	   => $parameters_arr,
							    'fabric_and_color_arr' => $color_arr,
							    'parameter_field_data' => array(),
						    );
						    
                            $color_field_args = array(
                              'input_class'          => $input_class,
                              'wrapper_class'        => 'blindmatrix-v4-parameter-wrapper',
                              'bootstrap_class'      => $bootstrap_class,
                              'label'                => 'Colours',
                              'color_wrapper_class'  => 'blindmatrix-v4-color-data-wrapper',
                              'color_children_class' => 'blindmatrix-v4-color-data',
                              'value'                => $fabric_linked_color_data,
                              'chosen_color_id'      => $colorid,
                              'colorname'            => isset($color_arr['colorname']) ? $color_arr['colorname']:'-',   
                              'product_id'           => $product_id,
                              'free_sample_args'     => $free_sample_args
                            );    
                            echo blindmatrix_v4_render_colors_HTML($color_field_args);
                        }
                        $parameter_count++;
                }
                ?>
                        <!-- product price section -->
                        <input type="hidden" value="<?php echo(get_option('blindmatrix_vat_type')); ?>"  id="vat_available" />  
                        <div class="price_wrapper" style="display:none;">
                            <div class="price_text">Your Price</div>
                            <div class="showprice_wrapper" > </div>
                        </div>
                        <!-- quantity and add to cart select section -->
                        <div class="woocommerce-variation-add-to-cart variations_button ">
                                <div class="quantity buttons_added blindmatrix-v4-parameter-wrapper-hidden">
                                    <input type="button" value="-" class="minus button is-form">
                                    <?php $cart_quantity = !empty($_cart_item['quantity']) ? $_cart_item['quantity']:1; 
                                    ?>
                                    <input type="number" id="qty" class="input-text qty text" step="1" min="1" max="" name="blindmatrix_v4_parameters_data[qty]" value="<?php echo $cart_quantity; ?>" title="Qty" size="4" placeholder="" inputmode="numeric">
                                    <input type="button" value="+" class="plus button is-form">
                                </div>
                                <button type="submit" name="submit-btn" value="Submit" class="rounded-pill blindmatrix-v4-add_to_cart_button button font-1"><i class="fa-solid fa-cart-shopping"></i> Add to cart</button>
                            </div>
                            <p style="text-align: center;padding-bottom: 17px;<?php echo ( !is_null($delivery_duration) && empty($delivery_duration))?"visibility:hidden":"";?>" class="paramlable"> <span> <i class="fas fa-shipping-fast"></i></span>  Delivered in<strong class="paramval">&nbsp;&nbsp;<?php echo  is_null($delivery_duration)?"5-6 working days":$delivery_duration;?></strong></p>
                            <!-- product parameters end-->
                    </div>
                    <!-- get a quote start-->
            <div class='d-flex justify-content-between quote-section-wrapper py-2'>        
                <div class="accordion col-8" id="accordionExample">
                    <div class="accordion-item Show-order-item-accordion m-0">
                     <h2 class="accordion-header mb-0">
                        <button class="accordion-button Show_order_details collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Show Order Details 
                        </button>
                     </h2>
                        <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body p-2">
                                <div id="allparametervalue" style="font-size: 14px;" class="text-dark">
                                    <table class="blindmatrix-v4-show-order-details-contents border-0">
                                        <tbody></tbody>
                                    </table>
                                </div>                    
                            </div>
                        </div>
                    </div>
                </div>
                    <div class="col-4 text-center" >
                        <button type="submit" name="quote-btn" value="quote" class="rounded-pill blindmatrix-v4-get_a_quote button primary-background-color m-0 disabled">
                        <i class="fas fa-envelope me-2"></i>Submit an Enquiry</button>
                    </div>  
            </div>    	
                <!-- get a quote end-->
                <div class="col-12 position-relative" >
                    <?php if('1' == $ecomFreeSample): ?>
                    <!-- product free sample start-->
					<div class="cusordersample d-flex justify-content-around align-items-center">
						<span class="ordersampleimg" >
							<img id="myimage"  src="<?php echo($background_color_image_url); ?>" width="80" alt="" class="attachment-woocommerce_thumbnail" style="  -webkit-mask-image: url(<?php echo($sample_img_frame_url); ?>); mask-image: url(<?php echo($sample_img_frame_url);?>); -webkit-mask-size: 100%; mask-size: 100%;">
                        </span>
                         <?php
						  $free_sample_args = array(
							'pei_productid' 	   => $product_id,
							'free_sample_price'    => $ecomsampleprice,
							'chosen_product_data'  => $_product_list_data,
							'parameters_arr' 	   => $parameters_arr,
							'fabric_and_color_arr' => $color_arr,
							'parameter_field_data' => array(),
						  );
						  $free_sample_data = blindmatrix_v4_get_free_sample_data($free_sample_args);
						 ?>
					    <button type="button" onclick="freesample(this)"
                        class="single_add_to_cart_button rounded-pill m-0 button " style="background-color:#00B67A;"
                        data-color_id='<?php echo($colorid);?>' data-fabric_id='<?php echo($fabricid);?>' data-price_group_id='<?php echo($pricegroup_id);?>' data-fabricname='<?php echo($fabricname);?>' data-fabric_image_url='<?php echo($background_color_image_url);?>' data-free_sample_data='<?php echo !empty($free_sample_data) && is_array($free_sample_data) ? json_encode($free_sample_data):''; ?>' >
                            <span class="freesample-button p-0" >Order Free Sample<?php echo $ecomsampleprice >= 1 ? ' - '. wc_price($ecomsampleprice):''; ?></span>
                        </button>
					</div>
                    <!-- product free sample end-->
                    <?php endif; ?>
					<table class="border-0">
						<tr class="guides-page-contianer">
							<td class="d-flex gap-1 justify-content-between p-0 pt-2"colspan="3" >
								<a class="col-6" target="_blank" href="/measuring-guide/">Measuring Guide</a>
								<a class="col-6" target="_blank" href="/fitting-guide/">Fitting Guide</a>
							</td>
						</tr>
					</table>
				</div>
                </div>
            </div>
        </div>
    </div>
    <!-- product footer content section start-->
    <div class="product-footer w-100 container mt-md-5 p-1" style="max-width: 1250px; margin-bottom:36px">
        <div class="">
        <div class="tabbed-content product-tabs-single">
			<!--- bm_tab_product -->
            <ul class="nav nav-tabs m-0 " id="myTab" role="tablist">
				<?php 
				if(!empty($color_arr['ecomdescription'])):
				   ?>
					<li class="nav-item tab-description-header-v4" role="presentation">
                        <button class="nav-link fw-semibold" id="description-tab" data-bs-toggle="tab" data-bs-target="#tab_tab-description" type="button" role="tab" aria-controls="tab_tab-description" >description</button>
                	</li>
				<?php endif; ?>
            <?php if($product_specs != ''){ ?>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link fw-semibold <?php echo empty($color_arr['ecomdescription']) ? 'active':''; ?>" id="specification-tab" data-bs-toggle="tab" data-bs-target="#tab_tab-specification" type="button" role="tab" aria-controls="tab_tab-specification" >product specification</button>
                    </li>
                <?php } ?>
                <li class="nav-item" role="presentation">
                    <button class="nav-link fw-semibold <?php if($product_specs == ''){ echo('active'); }?>" id="details-tab" data-bs-toggle="tab" data-bs-target="#tab_tab-details" type="button" role="tab" aria-controls="tab_tab-details" >details</button>
                </li>
            </ul>
            <div class="tab-content tab-panels product_tab_panels_bm" id="myTabContent">
				<?php 
				if(!empty($color_arr['ecomdescription'])):
				   ?>
					<div class="panel entry-content tab-pane fade show" id="tab_tab-description" role="tabpanel" aria-labelledby="description-tab" tabindex="0">
                   		<div class="product_color_description_v4 d-flex justify-content-between">
                        	<div class="product_color_description_wrapper_v4 w-100"><p class="product_color_description_msg_v4"><?php echo $color_arr['ecomdescription']; ?></p></div>
                    	</div>
                	</div>
				<?php endif; ?>
				
                <?php 
					if($product_specs != ''): 
					 ?>
                    <div class="panel entry-content tab-pane fade <?php echo empty($color_arr['ecomdescription']) ? 'active show':''; ?>" id="tab_tab-specification" role="tabpanel" aria-labelledby="specification-tab" tabindex="0">
                        <div class="product_details_v4 d-flex justify-content-between">
                            <div class="product_details_dec_v4 w-100"><p ><?php echo ($product_specs); ?></p></div>
                        </div>
                    </div>
                <?php endif; ?>
                <div class="panel entry-content tab-pane fade <?php if($product_specs == ''){ echo('show active'); }?>" id="tab_tab-details" role="tabpanel" aria-labelledby="details-tab" tabindex="0">
                    <div   class="product_details_v4 d-flex justify-content-between">
                    <?php if($product_description != ''){ ?>
                        <div class="product_details_dec_v4 scrollable_desc"><p ><?php echo ($product_description); ?></p></div>
                    <?php } ?>
                    <table style="<?php echo ($product_description != '')?"":"width:100%" ?>" class="product_details_bm">
                        <?php foreach($product_details_arr as $key => $value ):
                                $extra_class = '';
                                if('Color' == $key):
                                    $extra_class = 'product_spec_color_name';
                                endif;
                        ?>
                        
                        <tr style="margin:5px 0px" class="d-flex gap-2">
                            <td class="p-2 product_details_td"><b> <?php echo  $key ?></b></td>
                            <td class="p-2 <?php echo $extra_class; ?>"> <?php echo  ucwords($value); ?><br/></td>
                        </tr>
                        <?php endforeach; ?>  
                    </table>
                    </div>
                </div>
            </div>
        </div> 
            <br>
            <?php 
			echo do_shortcode('[BlindMatrixv4 source="social-share"]');
         ?>
        </div>  
</form>
<br/>
<br/>
<?php 

if(is_array($related_products_list_data) && !empty($related_products_list_data) && count($related_products_list_data) >= 3):
?>
<div class="v4_related_products "><h5>Related Products</h5></div>
<?php

$html = [];
ob_start();
$fabric_view = 'false';
$product_listing_arr = [];
if('true' == $fabric_view){
//   if(!empty($related_products_list_data) && is_array($related_products_list_data)){    
//   foreach($related_products_list_data as $fabric_id => $matmap_and_color_data){
//     $matched_color_arr = array();    
//     $fabric_grouped_data = array();
//     if(!empty($matmap_and_color_data) && is_array($matmap_and_color_data)){
//         foreach($matmap_and_color_data as $matmap_and_color_id => $product_data){
//             $matmap_and_color_ids = !is_array($matmap_and_color_id) ? explode('-',$matmap_and_color_id):array();
//             $matmap_id = isset($matmap_and_color_ids[0]) ? $matmap_and_color_ids[0]:'';
//             $color_id = isset($matmap_and_color_ids[1]) ? $matmap_and_color_ids[1]:'';
//             if(!$color_id){
//                 continue;
//             }
//             $color_data = isset($product_data['colours']['original']['result']['dataset']) ? $product_data['colours']['original']['result']['dataset']:array();
//             if(is_array($color_data) && !empty($color_data)){
//                 $color_data_index = array_search($color_id, array_column($color_data, 'id'));
//                     if(!empty($color_data[$color_data_index])){
//                         $matched_fabric_and_color_arr = $color_data[$color_data_index];
//                             $matched_color_arr[$matmap_id] = $matched_fabric_and_color_arr;
//                     } 
//                 }
//             }
//             $fabric_grouped_data = array(
//                 'groupid'    => isset($product_data['groupid']) ? $product_data['groupid']:0 ,
//                 'fabricname' => isset($product_data['fabricname']) ? $product_data['fabricname']:'' ,
//                 'cd_id'      => isset($product_data['cd_id']) ? $product_data['cd_id']:0 ,
//                 'matmapid'   => isset($product_data['matmapid']) ? $product_data['matmapid']:0 ,
//                 'supplierid' => isset($product_data['supplierid']) ? $product_data['supplierid']:0 ,
//                 'minprice'   => isset($product_data['minprice']) ? $product_data['minprice']:0 ,
//             );
//         }
//         $product_listing_arr[] = array(
//             'fabric_and_color_arr' => array(),
//             'matched_color_arr'    => $matched_color_arr,
//             'fd_id'                => $fabric_id,  
//             'fabric_grouped_data'  => $fabric_grouped_data,  
//         );
//     }
//   }
}else{
    if(!empty($related_products_list_data) && is_array($related_products_list_data)){ 
        foreach($related_products_list_data as $fabric_and_color_arr){
            $product_listing_arr[] = array(
                'fabric_and_color_arr'  => $fabric_and_color_arr,  
                'matched_color_arr'     => array(), 
                'matmap_id'             => isset($fabric_and_color_arr['matmapid']) ? $fabric_and_color_arr['matmapid']:'',
                'fabric_grouped_data'   => array(),  
            );
        }
    }
}
?>
<div class="products row related_product_slider">
<?php
$parameter_field_data = array();	
$blindmatrix_v4_option_data =  get_option('blindmatrix_v4_option_data');
	$hide_frame = false;
    $_category_name = '';
foreach($product_listing_arr as $product_listing_value):
		if('5' == $fieldscategoryid){
			$_category_name = 'blinds_with_fabrics';
		}
		if('20' == $fieldscategoryid){
			$_category_name = 'blinds_with_slates';
		}
		if(isset($blindmatrix_v4_option_data['product_spec'][$_category_name][$product_id]["hide_frame_listing"]) && 'on' == $blindmatrix_v4_option_data['product_spec'][$_category_name][$product_id]["hide_frame_listing"]){
			$hide_frame = true;
		}
    $fabric_and_color_arr   = isset($product_listing_value['fabric_and_color_arr']) ? $product_listing_value['fabric_and_color_arr']:'';
    $fabric_grouped_data    = isset($product_listing_value['fabric_grouped_data']) ? $product_listing_value['fabric_grouped_data']:'';
    $matmapid               = !empty($fabric_and_color_arr['matmapid']) ? $fabric_and_color_arr['matmapid'] : 0;
    $pricing_grp_id         = !empty($fabric_and_color_arr['groupid']) ? $fabric_and_color_arr['groupid'] : $fabric_grouped_data['groupid'];
    $minprice               = !empty($fabric_and_color_arr['minprice']) ? $fabric_and_color_arr['minprice'] : $fabric_grouped_data['minprice'];
    $supplier_id            = !empty($fabric_and_color_arr['supplierid']) ? $fabric_and_color_arr['supplierid'] : $fabric_grouped_data['supplierid'];
    $color_img_url          = !empty($fabric_and_color_arr['colorimage']) ? $fabric_and_color_arr['colorimage'] : $fabric_grouped_data['colorimage'];
    $fabric_id              = !empty($fabric_and_color_arr['fd_id']) ? $fabric_and_color_arr['fd_id'] : $product_listing_value['fd_id'];
    $color_id               = !empty($fabric_and_color_arr['cd_id']) ? $fabric_and_color_arr['cd_id'] : 0;
    $fabricname             = !empty($fabric_and_color_arr['fabricname']) ? trim($fabric_and_color_arr['fabricname']) : trim($fabric_grouped_data['fabricname']);
    $colorname              = !empty($fabric_and_color_arr['colorname']) ? trim($fabric_and_color_arr['colorname']) : trim($fabric_grouped_data['colorname']);
	if(!empty($fabric_and_color_arr['fd_id'] ) && !empty($fabric_and_color_arr['cd_id'] ) && $fabric_and_color_arr['fd_id'] == $fabricid && $fabric_and_color_arr['cd_id'] == $colorid){
		continue;
	}
    $fabric_img_url         = $fabric_image_file_path.$color_img_url;
    $fabricname             = $fabricname." ".$colorname;
    $fabricname_slug        = str_replace(" ","-",strtolower($fabricname));
    global $v4_product_visualizer_page;
    if($fieldscategoryname == 'blinds-with-fabric'){
        $visulizer_page_link = '/'.$v4_product_visualizer_page.'/'.$fieldscategoryname.'/'.$productslug.'/'.$fabricname_slug.'/'.$fabric_id.'/'.$color_id.'/'.$matmapid.'/'.$pricing_grp_id.'/'.$supplier_id;
    }else{
        $fabric_id           = 0;
        $fabricname          = $colorname;
        $fabricname_slug     = str_replace(" ","-",strtolower($fabricname));
        $visulizer_page_link = '/'.$v4_product_visualizer_page.'/'.$fieldscategoryname.'/'.$productslug.'/'.$fabricname_slug.'/'.$fabric_id.'/'.$color_id.'/'.$matmapid.'/'.$pricing_grp_id.'/'.$supplier_id;
    }
?>    
    <div class=" product row-box-shadow-2" >
        <div class="col-inner" >
            <div class="product-small box " >
                <div class="box-image" >
                    <div class="image-fade_in_back" >
                        <a class="text-dark" href="<?php echo($visulizer_page_link);?>">
                           <?php 
								if(!$hide_frame):
									?>
									<img src="<?php echo($productlisting_frame_url);?>" class="product-frame frame_backgound" style="background-image:url(<?php echo($fabric_img_url);?>);">
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
                <div class="d-flex align-items-center justify-content-between m-2" >
                    <div class="product details product-item-details" >
                        <h6 class="fw-bold text-capitalize"><a class="product-item-link text-dark fw-bold" href="<?php echo($visulizer_page_link);?>"><?php echo($fabricname);?></a></h6>
                        <?php if(isset($minprice) && $minprice != ''):?>
                                <span class="price-container">
                                    <span id="product-price" class="price-wrapper ">From : <?php echo(wc_price($minprice));?>
                                    </span>
                                </span>
                        <?php endif?>
                    </div>
                    <div class="d-flex justify-content-center" >
                        <a href="<?php echo($visulizer_page_link);?>" title="<?php echo($fabricname);?>" class="">
                            <div class="product-image-container position-relative" >
                                <img style="  -webkit-mask-image: url(<?php echo($sample_img_frame_url); ?>); mask-image: url(<?php echo($sample_img_frame_url);?>);  -webkit-mask-size: 100%;mask-size: 100%;" alt="<?php echo($fabricname);?>" src="<?php echo($fabric_img_url);?>" width="75" height="75" style="" class=" swatch-img">
                            </div>									   
                        </a>
                    </div>
                </div>
                <a href="<?php echo($visulizer_page_link);?>" class="button d-block w-100 bm-v4-buynow text-white m-0 rounded-0 box-shadow-2 text-center">
                            <i class="fa-solid fa-cart-shopping"></i> <span class="ms-1 my-1"> Buy Now</span>
                            </a>
                <?php if($ecomFreeSample == 1): 
						$free_sample_price = isset($_POST['free_sample_price']) ?$_POST['free_sample_price']:'' ;
						$free_sample_args = array(
									'pei_productid' 	   => $product_id,
									'free_sample_price'    => $ecomsampleprice,
									'chosen_product_data'  => $chosen_product_data,
									'parameters_arr' 	   => $parameters_arr,
									'fabric_and_color_arr' => $fabric_and_color_arr,
									'parameter_field_data' => $parameter_field_data,
						);
						$free_sample_data = blindmatrix_v4_get_free_sample_data($free_sample_args);	
				?>    
                <a class="sample_addtocart_container d-block" style="margin:5px 0 !important" href="javascript:;" data-color_id='<?php echo($color_id);?>' data-fabric_id='<?php echo($fabric_id);?>' data-price_group_id='<?php echo($pricing_grp_id);?>' data-fabricname='<?php echo($fabricname);?>' data-fabric_image_url='<?php echo($fabric_img_url);?>' data-free_sample_data='<?php echo !empty($free_sample_data) && is_array($free_sample_data) ? json_encode($free_sample_data):''; ?>'  onclick="freesample(this)">
                    <span class="free-sample-price">Free Sample<?php echo $ecomsampleprice >= 1 ? ' - '.wc_price($ecomsampleprice):''; ?></span>
                </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
<?php  
endforeach;
?>
</div> <!-- product footer content section end-->
<?php endif;
