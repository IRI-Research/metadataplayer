<?php

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->annotations[0]->id)) {
    $data->annotations[0]->id = uniqid("annotation_");
}

if (!isset($data->annotations[0]->type)) {
    $data->annotations[0]->type = uniqid("annotationType_");
}

print_r(json_encode($data));

?>