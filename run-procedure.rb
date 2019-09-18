#!/usr/bin/env ruby
require 'json'


def run_procedure(filename)
    file = File.read(filename)

    scenes = JSON.parse(file)

    scenes.each { |item|
        # context = "{ \"targetLayerID\": \"#{item[0]}\",\"sampleLayerID\": \"#{item[1]}\",\"imageURL\": \"#{item[2]}\" }"
        context = "{ \"assignments\": #{item["assignments"].to_json} }"

        command = "bash sketch.sh run Angle.sketchplugin  Angle-Apply-Procedure --context='#{context}'"
        # puts command
        system(command)
    }
end


run_procedure('procedure.json')
run_procedure('procedure-it.json')
run_procedure('procedure-de.json')
run_procedure('procedure-fr.json')
run_procedure('procedure.json')
run_procedure('procedure-it.json')
run_procedure('procedure-de.json')
run_procedure('procedure-fr.json')