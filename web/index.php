<?php 
// allow heroku to detect it as php app while only serving static html
include_once("index.html");
?>
<script src="https://s3.amazonaws.com/assets.heroku.com/boomerang/boomerang.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function() {
    Boomerang.init({app: 'foo', addon: 'bar'});
  });
</script>
