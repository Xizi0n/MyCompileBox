#!/bin/bash

cd usercode

exec  1> $"/usercode/logfile.txt"
exec  2> $"/usercode/errors"

compiler=$1
file=$2
output=$3
addtionalArg=$4

START=$(date +%s.%2N)
#Branch 1 Interpreter was called
if [ "$output" = "" ]; then
    $compiler /usercode/$file -< $"/usercode/inputFile" #| tee /usercode/output.txt
#Branch 2
else
	#In case of compile errors, redirect them to a file
        $compiler /usercode/$file $addtionalArg #&> /usercode/errors.txt
	#Branch 2a Succesfull compile
	if [ $? -eq 0 ];	then
		$output -< $"/usercode/inputFile" #| tee /usercode/output.txt    
	#Branch 2b Compile error
	else
	    echo "Compilation Failed"
	    #if compilation fails, display the output file	
	    #cat /usercode/errors.txt
	fi
fi

END=$(date +%s.%2N)
runtime=$(echo "$END - $START" | bc)


echo "*-COMPILEBOX::ENDOFOUTPUT-*" $runtime 


mv /usercode/logfile.txt /usercode/completed.txt

#nodejs file.js

