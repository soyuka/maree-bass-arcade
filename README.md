https://api-v2.soundcloud.com/users/9757708/albums?client_id=f0sxU3Az3dcl0lS1M9wFJ00SqawVL72n&limit=1000&offset=0&linked_partitioning=1&app_version=1580460667&app_locale=fr

# TODO

- Animate release details
- Credit

jq '.collection[].purchase_url' src/releases.json >> url
xargs -n 1 curl -O < artworks_list_t500x500


