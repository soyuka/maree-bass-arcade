# Get soundcloud api results
http get "https://api-v2.soundcloud.com/users/9757708/albums?client_id=f0sxU3Az3dcl0lS1M9wFJ00SqawVL72n&limit=1000&offset=0&linked_partitioning=1&app_version=1580460667&app_locale=fr" > releases.json
# Rework the database with jq
jq '.collection[] | {id: .id, year: .release_date | fromdate | strftime("%Y"), title: .title | sub("...free download on https://www.mareebass.fr"; "") | sub("...free on https://www.mareebass.fr"; ""), artwork: .artwork_url | sub("https://i1.sndcdn.com"; "/artworks"), artwork_large: .artwork_url | sub("large"; "t500x500") | sub("https://i1.sndcdn.com"; "/artworks"), artist: (if .genre == "" then .tracks[0].genre else .genre end) | split(" - ")[1], artist_search: (if .genre == "" then .tracks[0].genre else .genre end) | split(" - ")[1], download: .purchase_url}' releases.json | jq -s -c > database.json
# Pick bitly urls
jq -r '.[].download | select(. != null) | select(. |test("bit.ly"))' database.json > bitly
# Get bitly redirect location in another file
jq -c '.[].download | select(. != null) | select(. |test("bit.ly"))' database.json | xargs -L 1 curl -sI | grep  --line-buffered Location | awk '{print $2}' > bitly_after
# merge the two files
paste -d, bitly bitly_after > bitly_done
while IFS=, read -r bitly resolved
do
  resolved=$(echo $resolved | sed 's|/|\\/|g' | sed 's|\.|\\\.|g' | sed 's/\r$//')
  bitly=$(echo $bitly | sed 's|/|\\/|g' | sed 's|\.|\\\.|g' | sed 's/\r$//')
  sed -i "s@$bitly@$resolved@g" database.json
done < ./bitly_done
jq '.[] | select(.download != null) | {id: .id | tostring, url: .download | sub("http://mareebass.fr/documents/sons/"; "") | sub("http://s451072707.onlinehome.fr/"; "")}' database.json | jq -s -c > server/releases_id.json
cp database.json src/database.json
json2csv -i database.json -f id,year,title,artwork,artwork_large,artist,artist_search,download > database.csv
