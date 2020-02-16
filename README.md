https://api-v2.soundcloud.com/users/9757708/albums?client_id=f0sxU3Az3dcl0lS1M9wFJ00SqawVL72n&limit=1000&offset=0&linked_partitioning=1&app_version=1580460667&app_locale=fr

# TODO

- Animate release details
- Credit

jq '.collection[].purchase_url' src/releases.json >> url
xargs -n 1 curl -O < artworks_list_t500x500

http get "https://api-v2.soundcloud.com/users/9757708/albums?client_id=f0sxU3Az3dcl0lS1M9wFJ00SqawVL72n&limit=1000&offset=0&linked_partitioning=1&app_version=1580460667&app_locale=fr" > releases.json
jq '.collection[] | {id: .id, year: .release_date | fromdate | strftime("%Y"), title: .title, artwork: .artwork_url, artwork_large: .artwork_url | sub("large"; "t500x500"), artist: (if .genre == "" then .tracks[0].genre else .genre end), download: .purchase_url}' releases.json | jq -s -c > database.json



Get bit.ly redirect locations:

jq -r '.[].download | select(. != null) | select(. |test("bit.ly"))' database.json > bitly
jq -c '.[].download | select(. != null) | select(. |test("bit.ly"))' database.json | xargs -L 1 curl -sI | grep  --line-buffered Location | awk '{print $2}' > bitly_after
paste bitly bitly_after > test


