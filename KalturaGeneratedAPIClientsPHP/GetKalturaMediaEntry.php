<?php
require_once('KalturaClient.php');

$config = new KalturaConfiguration();
$config->setServiceUrl('https://www.kaltura.com');
$client = new KalturaClient($config);

// Credentials For Kaltura Session
$secret = "69fe402f3429ede6dbf4b4f928767bf6"; //Remember to provide the correct secret according to the sessionType you want
$partnerId = "4186473";
$expiry = 86400;
$privileges = "*";

// $sessionType mean Kaltura Session Type. It may be 0 or 2, 0 for user and 2 for admin (https://www.kaltura.com/api_v3/testmeDoc/enums/KalturaSessionType.html)
$sessionType = "2";  

$pageSize = $_GET['pageSize'];
$pageIndex = $_GET['pageIndex'];
$searchText = $_GET['searchText'];

try {
  /**
   * Use Kaltura Session to get the api token
   * @purpose To get those media list, which do not have any 'Entitlement Enforcement/Permission Category'
   * @return string token
   */
  $ks = $client->session->start($secret, null, $sessionType, $partnerId, $expiry, $privileges);
  $client->setKS($ks);
  $filter = new KalturaMediaEntryFilter();
  $filter->mediaTypeIn = 1;
  $filter->searchTextMatchOr = $searchText;
  $pager = new KalturaFilterPager();
  $pager->pageSize = $pageSize;
  $pager->pageIndex = $pageIndex;
  try {
    $result = $client->media->listAction($filter, $pager);
    echo json_encode(array("results" => $result));
  } catch (Exception $e) {
    echo json_encode(array("error" => $e->getMessage()));
  }
} catch (Exception $e) {
  echo json_encode(array("error" => $e->getMessage()));
}
