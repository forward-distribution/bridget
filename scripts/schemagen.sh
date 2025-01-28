#!/usr/bin/env bash

compiler=$1
dir=$2
target=$3

rm -rf $target
mkdir -p $target
for schema in $dir/*.json; do
  tf="$target/$(basename $schema .json).cjs"
  $compiler compile -s $schema -o $tf
done


