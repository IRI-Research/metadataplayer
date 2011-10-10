Layout of the unittests directory
==================================

We've got a directory for tests - unittests/tests. Add your tests there. There should be only one file per functionality area tested (i.e - all the
tests about JSONSerializer should be in jsonserializer.js). Your tests should be wrapped in a function named "test_$filename$" where $filename$ is the
name of your file. Don't forget to define a module for your tests and to add a reference to your file in index.html
