<?php

$data = json_decode($HTTP_RAW_POST_DATA);

if (!isset($data->annotations[0]->id)) {
    $data->annotations[0]->id = uniqid("annotation_");
}

if (!isset($data->annotations[0]->type)) {
    $data->annotations[0]->type = uniqid("annotationType_");
}

print_r(json_encode($data));

?>