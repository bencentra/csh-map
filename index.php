<?php
$user_data = array();
$user_data['uid'] = htmlentities($_SERVER['WEBAUTH_USER']);
$user_data['cn'] = htmlentities($_SERVER['WEBAUTH_LDAP_CN']);
?>
<!DOCTYPE html>
<html>
<head>
  <title>CSH Alumni Map</title>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
  <link type="text/css" rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
  <link type="text/css" rel="stylesheet" href="https://members.csh.rit.edu/~bencentra/alumni-map/client/dist/main.css">
</head>
<body>
<div id="spin"></div>
<div id="csh-map"></div>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCMg7g6Cq-D_y-jVmnvX3XNfcYZc5lPu_8&v=3.22"></script>
<script type="text/javascript" src="https://members.csh.rit.edu/~bencentra/alumni-map/client/dist/csh-map-ui.min.js"></script>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script type="text/javascript">
document.addEventListener('DOMContentLoaded', function() {
  var spinner, timeout, config, map;
  config = {
    hostUrl: '',
    apiUrl: 'https://bencentra.com/csh-map/v1',
    uid: '<?php echo $user_data['uid']; ?>',
    cn: '<?php echo $user_data['cn']; ?>'
  };
  map = new CSHMap(config);
  map.init().then(function() {
    clearTimeout(timeout);
    if (spinner) spinner.stop();
  });
  timeout = setTimeout(function() {
    spinner = new Spinner().spin(document.querySelector('#spin'));
  }, 250);
});
</script>
</body>
</html>
