#!/usr/bin/env ruby
require 'json'
require 'optparse'

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: example.rb [options]"

  opts.on('-f', '--image-folder PATH', 'Images root folder') { |v| $imagesPath = v }

end.parse!

# $imagesPath = '/Users/jacobmartin/Documents/Development/screenshots/'

def run_procedure(filename)
    file = File.read(filename)

    scenes = JSON.parse(file)

    scenes.each { |item|
        # context = "{ \"targetLayerID\": \"#{item[0]}\",\"sampleLayerID\": \"#{item[1]}\",\"imageURL\": \"#{item[2]}\" }"
        context = "{ \"assignments\": #{item["assignments"].to_json}, \"imagesPath\": \"#{$imagesPath}\" }"

        command = "bash sketch.sh run Angle.sketchplugin  Angle-Apply-Procedure --without-activating --context='#{context}'"
        # puts command
        system(command)
    }
    puts "\n----------------"
end

unless $imagesPath.nil?

run_procedure('procedure.json')
run_procedure('procedure-it.json')
run_procedure('procedure-de.json')
run_procedure('procedure-fr.json')
run_procedure('procedure-zh-cn.json')
run_procedure('procedure.json')
run_procedure('procedure-it.json')
run_procedure('procedure-de.json')
run_procedure('procedure-fr.json')
run_procedure('procedure-zh-cn.json')

end
